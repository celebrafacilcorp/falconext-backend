import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrearPagoDto } from './dto/crear-pago.dto';

@Injectable()
export class PagoService {
  constructor(private readonly prisma: PrismaService) {}

  async registrarPago(
    comprobanteId: number,
    dto: CrearPagoDto,
    usuarioId?: number,
    empresaId?: number,
  ) {
    const comprobante = await this.prisma.comprobante.findUnique({
      where: { id: comprobanteId },
    });

    if (!comprobante) {
      throw new NotFoundException('Comprobante no encontrado');
    }

    // Validar que el comprobante pertenezca a la empresa del usuario
    if (empresaId && comprobante.empresaId !== empresaId) {
      throw new BadRequestException('El comprobante no pertenece a tu empresa');
    }

    if (comprobante.estadoEnvioSunat === 'ANULADO') {
      throw new BadRequestException(
        'No se puede registrar pago en comprobante anulado',
      );
    }

    const saldoActual = comprobante.saldo ?? 0;
    if (dto.monto <= 0) {
      throw new BadRequestException('El monto debe ser mayor a 0');
    }
    if (dto.monto > saldoActual) {
      throw new BadRequestException(
        `El monto no puede exceder el saldo pendiente (${saldoActual})`,
      );
    }

    const pago = await this.prisma.pago.create({
      data: {
        comprobanteId,
        usuarioId,
        empresaId,
        monto: dto.monto,
        medioPago: (dto.medioPago ?? 'EFECTIVO').toUpperCase(),
        observacion: dto.observacion,
        referencia: dto.referencia,
      },
    });

    const nuevoSaldo = saldoActual - dto.monto;
    let nuevoEstado = 'PAGO_PARCIAL';
    if (nuevoSaldo <= 0) {
      nuevoEstado = 'COMPLETADO';
    } else if (nuevoSaldo === saldoActual) {
      nuevoEstado = 'PENDIENTE_PAGO';
    }

    const comprobanteActualizado = await this.prisma.comprobante.update({
      where: { id: comprobanteId },
      data: {
        saldo: Math.max(0, nuevoSaldo),
        estadoPago: nuevoEstado as any,
      },
    });

    return { pago, comprobanteActualizado };
  }

  async obtenerPagos(comprobanteId: number) {
    const comprobante = await this.prisma.comprobante.findUnique({
      where: { id: comprobanteId },
      include: { pagos: { orderBy: { fecha: 'desc' } } },
    });

    if (!comprobante) {
      throw new NotFoundException('Comprobante no encontrado');
    }

    return {
      comprobanteId,
      pagos: comprobante.pagos,
      totalPagado: comprobante.pagos.reduce((sum, p) => sum + p.monto, 0),
      saldoPendiente: comprobante.saldo,
      estadoPago: comprobante.estadoPago,
    };
  }

  async listarTodos(filtros?: {
    empresaId?: number;
    usuarioId?: number;
    clienteId?: number;
    estadoPago?: string;
    fechaInicio?: string;
    fechaFin?: string;
    medioPago?: string;
  }) {
    const where: any = {};
    if (filtros?.empresaId) where.empresaId = filtros.empresaId;
    if (filtros?.usuarioId) where.usuarioId = filtros.usuarioId;
    if (filtros?.medioPago) where.medioPago = filtros.medioPago.toUpperCase();
    if (filtros?.fechaInicio || filtros?.fechaFin) {
      where.fecha = {};
      if (filtros.fechaInicio)
        where.fecha.gte = new Date(`${filtros.fechaInicio}T00:00:00.000Z`);
      if (filtros.fechaFin)
        where.fecha.lte = new Date(`${filtros.fechaFin}T23:59:59.999Z`);
    }
    if (filtros?.clienteId) {
      where.comprobante = { clienteId: filtros.clienteId };
    }
    if (filtros?.estadoPago) {
      where.comprobante = {
        ...where.comprobante,
        estadoPago: filtros.estadoPago,
      };
    }

    const pagos = await this.prisma.pago.findMany({
      where,
      orderBy: { fecha: 'desc' },
      include: {
        usuario: { select: { id: true, nombre: true, email: true } },
        comprobante: {
          select: {
            id: true,
            serie: true,
            correlativo: true,
            tipoDoc: true,
            fechaEmision: true,
            mtoImpVenta: true,
            estadoPago: true,
            saldo: true,
            cliente: {
              select: { id: true, nombre: true, nroDoc: true },
            },
          },
        },
      },
    });
    return pagos;
  }

  async reportePorPeriodo(
    empresaId: number,
    fechaInicio: string,
    fechaFin: string,
  ) {
    const inicio = new Date(`${fechaInicio}T00:00:00.000Z`);
    const fin = new Date(`${fechaFin}T23:59:59.999Z`);

    const pagos = await this.prisma.pago.findMany({
      where: {
        empresaId,
        fecha: { gte: inicio, lte: fin },
      },
      include: {
        usuario: { select: { id: true, nombre: true } },
        comprobante: {
          select: {
            id: true,
            serie: true,
            correlativo: true,
            tipoDoc: true,
            mtoImpVenta: true,
            cliente: { select: { nombre: true } },
          },
        },
      },
      orderBy: { fecha: 'desc' },
    });

    const totalPagado = pagos.reduce((sum, p) => sum + p.monto, 0);
    const porMedioPago = pagos.reduce(
      (acc, p) => {
        acc[p.medioPago] = (acc[p.medioPago] || 0) + p.monto;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      periodo: { inicio, fin },
      totalPagado,
      cantidadPagos: pagos.length,
      porMedioPago,
      pagos,
    };
  }

  async reversarPago(pagoId: number, empresaId?: number) {
    const pago = await this.prisma.pago.findUnique({
      where: { id: pagoId },
      include: { comprobante: true },
    });

    if (!pago) throw new NotFoundException('Pago no encontrado');

    if (empresaId && pago.empresaId !== empresaId) {
      throw new BadRequestException('El pago no pertenece a tu empresa');
    }

    const comprobante = pago.comprobante;

    // Restaurar saldo
    const nuevoSaldo = (comprobante.saldo ?? 0) + pago.monto;
    let nuevoEstado = comprobante.estadoPago;
    if (nuevoSaldo > 0 && comprobante.estadoPago === 'COMPLETADO') {
      nuevoEstado = 'PAGO_PARCIAL';
    }

    // Eliminar pago
    await this.prisma.pago.delete({ where: { id: pagoId } });

    // Actualizar comprobante
    return this.prisma.comprobante.update({
      where: { id: comprobante.id },
      data: { saldo: nuevoSaldo, estadoPago: nuevoEstado as any },
    });
  }
}
