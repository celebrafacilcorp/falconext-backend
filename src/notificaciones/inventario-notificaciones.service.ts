import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificacionesService } from './notificaciones.service';

@Injectable()
export class InventarioNotificacionesService {
  private readonly logger = new Logger(InventarioNotificacionesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificacionesService: NotificacionesService,
  ) {}

  /**
   * Verifica el inventario de todas las empresas y genera notificaciones
   */
  async verificarInventarioTodasEmpresas() {
    this.logger.log('🔍 Verificando inventario de todas las empresas...');

    try {
      const empresas = await this.prisma.empresa.findMany({
        where: { estado: 'ACTIVO' },
        select: { id: true, razonSocial: true },
      });

      for (const empresa of empresas) {
        await this.verificarInventarioEmpresa(empresa.id);
      }

      this.logger.log('✅ Verificación de inventario completada');
    } catch (error) {
      this.logger.error('❌ Error al verificar inventario:', error);
    }
  }

  /**
   * Verifica el inventario de una empresa específica
   */
  async verificarInventarioEmpresa(empresaId: number) {
    try {
      // 1. Productos con stock en 0
      const productosAgotados = await this.prisma.producto.findMany({
        where: {
          empresaId,
          estado: 'ACTIVO',
          stock: 0,
        },
        select: {
          id: true,
          codigo: true,
          descripcion: true,
          stock: true,
        },
      });

      // 2. Productos con stock bajo (menor o igual al mínimo)
      const productosBajoStock = await this.prisma.producto.findMany({
        where: {
          empresaId,
          estado: 'ACTIVO',
          stock: { gt: 0 },
          stockMinimo: { gt: 0 },
        },
        select: {
          id: true,
          codigo: true,
          descripcion: true,
          stock: true,
          stockMinimo: true,
        },
      });

      // Filtrar solo los que están por debajo del mínimo
      const productosCriticos = productosBajoStock.filter(
        (p) => p.stock <= (p.stockMinimo || 0),
      );

      // 3. Generar notificaciones si hay productos críticos
      if (productosAgotados.length > 0) {
        await this.notificarProductosAgotados(empresaId, productosAgotados);
      }

      if (productosCriticos.length > 0) {
        await this.notificarProductosBajoStock(empresaId, productosCriticos);
      }

      this.logger.log(
        `📊 Empresa ${empresaId}: ${productosAgotados.length} agotados, ${productosCriticos.length} bajo stock`,
      );

      return {
        productosAgotados: productosAgotados.length,
        productosBajoStock: productosCriticos.length,
      };
    } catch (error) {
      this.logger.error(
        `❌ Error al verificar inventario de empresa ${empresaId}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Notifica productos agotados
   */
  private async notificarProductosAgotados(
    empresaId: number,
    productos: any[],
  ) {
    // Obtener administradores de la empresa
    const admins = await this.prisma.usuario.findMany({
      where: {
        empresaId,
        rol: { in: ['ADMIN_EMPRESA', 'USUARIO_EMPRESA'] },
        estado: 'ACTIVO',
      },
      select: { id: true },
    });

    if (admins.length === 0) return;

    let mensaje = '';
    if (productos.length === 1) {
      mensaje = `El producto "${productos[0].descripcion}" (${productos[0].codigo}) está AGOTADO.`;
    } else if (productos.length <= 5) {
      const lista = productos.map((p) => `• ${p.descripcion} (${p.codigo})`).join('\n');
      mensaje = `${productos.length} productos están AGOTADOS:\n${lista}`;
    } else {
      const lista = productos.slice(0, 5).map((p) => `• ${p.descripcion} (${p.codigo})`).join('\n');
      mensaje = `${productos.length} productos están AGOTADOS:\n${lista}\n... y ${productos.length - 5} más. Revisa tu inventario.`;
    }

    // Crear notificación para cada admin
    for (const admin of admins) {
      const notificacion = await this.prisma.notificacion.create({
        data: {
          usuarioId: admin.id,
          empresaId,
          tipo: 'CRITICAL',
          titulo: '⚠️ Productos Agotados',
          mensaje,
          leida: false,
        },
      });

      // Enviar en tiempo real via WebSocket
      this.notificacionesService['gateway']?.enviarNotificacionAUsuario(
        admin.id,
        notificacion,
      );
    }
  }

  /**
   * Notifica productos con stock bajo
   */
  private async notificarProductosBajoStock(
    empresaId: number,
    productos: any[],
  ) {
    // Obtener administradores de la empresa
    const admins = await this.prisma.usuario.findMany({
      where: {
        empresaId,
        rol: { in: ['ADMIN_EMPRESA', 'USUARIO_EMPRESA'] },
        estado: 'ACTIVO',
      },
      select: { id: true },
    });

    if (admins.length === 0) return;

    let mensaje = '';
    if (productos.length === 1) {
      mensaje = `El producto "${productos[0].descripcion}" tiene stock bajo (${productos[0].stock} unidades, mínimo: ${productos[0].stockMinimo}).`;
    } else if (productos.length <= 5) {
      const lista = productos
        .map((p) => `• ${p.descripcion} (${p.codigo}): ${p.stock} unidades (mín: ${p.stockMinimo})`)
        .join('\n');
      mensaje = `${productos.length} productos tienen stock bajo:\n${lista}`;
    } else {
      const lista = productos
        .slice(0, 5)
        .map((p) => `• ${p.descripcion} (${p.codigo}): ${p.stock} unidades (mín: ${p.stockMinimo})`)
        .join('\n');
      mensaje = `${productos.length} productos tienen stock bajo:\n${lista}\n... y ${productos.length - 5} más. Considera reabastecer.`;
    }

    // Crear notificación para cada admin
    for (const admin of admins) {
      const notificacion = await this.prisma.notificacion.create({
        data: {
          usuarioId: admin.id,
          empresaId,
          tipo: 'WARNING',
          titulo: '📦 Stock Bajo',
          mensaje,
          leida: false,
        },
      });

      // Enviar en tiempo real via WebSocket
      this.notificacionesService['gateway']?.enviarNotificacionAUsuario(
        admin.id,
        notificacion,
      );
    }
  }

  /**
   * Verifica un producto específico después de una venta
   */
  async verificarProductoDespuesVenta(productoId: number, empresaId: number) {
    try {
      const producto = await this.prisma.producto.findUnique({
        where: { id: productoId },
        select: {
          id: true,
          codigo: true,
          descripcion: true,
          stock: true,
          stockMinimo: true,
        },
      });

      if (!producto) return;

      // Si el stock llegó a 0
      if (producto.stock === 0) {
        await this.notificarProductosAgotados(empresaId, [producto]);
      }
      // Si el stock está por debajo del mínimo
      else if (
        producto.stockMinimo &&
        producto.stock <= producto.stockMinimo
      ) {
        await this.notificarProductosBajoStock(empresaId, [producto]);
      }
    } catch (error) {
      this.logger.error(
        `❌ Error al verificar producto ${productoId}:`,
        error,
      );
    }
  }
}
