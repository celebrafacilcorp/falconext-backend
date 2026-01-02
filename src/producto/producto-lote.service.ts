import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductoLoteService {
    constructor(private readonly prisma: PrismaService) { }

    /**
     * Obtener lotes disponibles de un producto (ordenados por vencimiento FEFO)
     * FEFO = First Expire, First Out
     */
    async obtenerLotesDisponibles(productoId: number, empresaId: number) {
        // Verificar que el producto pertenece a la empresa
        const producto = await this.prisma.producto.findFirst({
            where: { id: productoId, empresaId },
        });

        if (!producto) {
            throw new NotFoundException('Producto no encontrado');
        }

        return this.prisma.productoLote.findMany({
            where: {
                productoId,
                activo: true,
                stockActual: { gt: 0 },
            },
            orderBy: { fechaVencimiento: 'asc' }, // FEFO
            include: {
                producto: {
                    select: {
                        descripcion: true,
                        codigo: true,
                    },
                },
            },
        });
    }

    /**
     * Crear nuevo lote al ingresar mercadería
     */
    async crearLote(data: {
        productoId: number;
        empresaId: number;
        lote: string;
        fechaVencimiento: Date;
        stockInicial: number;
        costoUnitario?: number;
        proveedor?: string;
    }) {
        // Verificar que el producto pertenece a la empresa
        const producto = await this.prisma.producto.findFirst({
            where: { id: data.productoId, empresaId: data.empresaId },
        });

        if (!producto) {
            throw new NotFoundException('Producto no encontrado');
        }

        // Verificar que no existe un lote con el mismo código para este producto
        const loteExistente = await this.prisma.productoLote.findUnique({
            where: {
                productoId_lote: {
                    productoId: data.productoId,
                    lote: data.lote,
                },
            },
        });

        if (loteExistente) {
            throw new BadRequestException(
                `Ya existe un lote con código "${data.lote}" para este producto`,
            );
        }

        return this.prisma.productoLote.create({
            data: {
                productoId: data.productoId,
                lote: data.lote,
                fechaVencimiento: data.fechaVencimiento,
                stockInicial: data.stockInicial,
                stockActual: data.stockInicial,
                costoUnitario: data.costoUnitario,
                proveedor: data.proveedor,
            },
            include: {
                producto: true,
            },
        });
    }

    /**
     * Descontar stock de un lote específico (para ventas)
     * Automáticamente elige el lote más próximo a vencer si no se especifica
     */
    async descontarStockLote(
        productoId: number,
        cantidad: number,
        movimientoKardexId: number,
        loteId?: number, // Opcional: si no se proporciona, usa FEFO
    ) {
        let loteSeleccionado;

        if (loteId) {
            // Lote específico proporcionado
            loteSeleccionado = await this.prisma.productoLote.findUnique({
                where: { id: loteId },
            });
        } else {
            // FEFO automático: seleccionar el lote más próximo a vencer
            loteSeleccionado = await this.prisma.productoLote.findFirst({
                where: {
                    productoId,
                    activo: true,
                    stockActual: { gte: cantidad },
                },
                orderBy: { fechaVencimiento: 'asc' },
            });
        }

        if (!loteSeleccionado) {
            throw new BadRequestException(
                'No hay lotes disponibles con stock suficiente',
            );
        }

        if (loteSeleccionado.stockActual < cantidad) {
            throw new BadRequestException(
                `Stock insuficiente en el lote "${loteSeleccionado.lote}". Disponible: ${loteSeleccionado.stockActual}`,
            );
        }

        // Descontar en transacción
        await this.prisma.$transaction([
            // Actualizar stock del lote
            this.prisma.productoLote.update({
                where: { id: loteSeleccionado.id },
                data: { stockActual: { decrement: cantidad } },
            }),

            // Registrar en MovimientoKardexLote
            this.prisma.movimientoKardexLote.create({
                data: {
                    productoLoteId: loteSeleccionado.id,
                    movimientoId: movimientoKardexId,
                    cantidad,
                    stockAnterior: loteSeleccionado.stockActual,
                    stockActual: loteSeleccionado.stockActual - cantidad,
                },
            }),
        ]);

        return loteSeleccionado;
    }

    /**
     * Aumentar stock de un lote (para devoluciones o ajustes)
     */
    async aumentarStockLote(
        loteId: number,
        cantidad: number,
        movimientoKardexId: number,
    ) {
        const lote = await this.prisma.productoLote.findUnique({
            where: { id: loteId },
        });

        if (!lote) {
            throw new NotFoundException('Lote no encontrado');
        }

        await this.prisma.$transaction([
            this.prisma.productoLote.update({
                where: { id: loteId },
                data: { stockActual: { increment: cantidad } },
            }),

            this.prisma.movimientoKardexLote.create({
                data: {
                    productoLoteId: loteId,
                    movimientoId: movimientoKardexId,
                    cantidad,
                    stockAnterior: lote.stockActual,
                    stockActual: lote.stockActual + cantidad,
                },
            }),
        ]);
    }

    /**
     * Alertar productos próximos a vencer
     */
    async obtenerProductosPorVencer(
        empresaId: number,
        diasAnticipacion = 30,
    ) {
        const fechaLimite = new Date();
        fechaLimite.setDate(fechaLimite.getDate() + diasAnticipacion);

        return this.prisma.productoLote.findMany({
            where: {
                producto: { empresaId },
                fechaVencimiento: { lte: fechaLimite },
                stockActual: { gt: 0 },
                activo: true,
            },
            include: {
                producto: {
                    select: {
                        descripcion: true,
                        codigo: true,
                        precioUnitario: true,
                    },
                },
            },
            orderBy: { fechaVencimiento: 'asc' },
        });
    }

    /**
     * Obtener lotes vencidos
     */
    async obtenerLotesVencidos(empresaId: number) {
        const hoy = new Date();

        return this.prisma.productoLote.findMany({
            where: {
                producto: { empresaId },
                fechaVencimiento: { lt: hoy },
                stockActual: { gt: 0 },
                activo: true,
            },
            include: {
                producto: true,
            },
            orderBy: { fechaVencimiento: 'desc' },
        });
    }

    /**
     * Obtener todos los lotes de un producto (con historial)
     */
    async obtenerLotesProducto(productoId: number, empresaId: number) {
        const producto = await this.prisma.producto.findFirst({
            where: { id: productoId, empresaId },
        });

        if (!producto) {
            throw new NotFoundException('Producto no encontrado');
        }

        return this.prisma.productoLote.findMany({
            where: { productoId },
            include: {
                movimientosKardex: {
                    include: {
                        movimiento: {
                            select: {
                                concepto: true,
                                fecha: true,
                                tipoMovimiento: true,
                            },
                        },
                    },
                    orderBy: { id: 'desc' },
                    take: 5, // Últimos 5 movimientos por lote
                },
            },
            orderBy: { fechaVencimiento: 'asc' },
        });
    }

    /**
     * Desactivar lote (no eliminar físicamente)
     */
    async desactivarLote(loteId: number, empresaId: number) {
        const lote = await this.prisma.productoLote.findUnique({
            where: { id: loteId },
            include: { producto: true },
        });

        if (!lote) {
            throw new NotFoundException('Lote no encontrado');
        }

        if (lote.producto.empresaId !== empresaId) {
            throw new BadRequestException('No tienes permisos para este lote');
        }

        return this.prisma.productoLote.update({
            where: { id: loteId },
            data: { activo: false },
        });
    }
}
