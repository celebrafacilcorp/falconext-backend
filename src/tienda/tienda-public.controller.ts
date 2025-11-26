import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { TiendaService } from './tienda.service';
import { CrearPedidoDto } from './dto/crear-pedido.dto';

@Controller('public/store')
export class TiendaPublicController {
  constructor(private readonly tiendaService: TiendaService) { }

  @Get(':slug')
  async obtenerTienda(@Param('slug') slug: string) {
    return this.tiendaService.obtenerTiendaPorSlug(slug);
  }

  @Get(':slug/products')
  async obtenerProductos(
    @Param('slug') slug: string,
    @Query('page') page = '1',
    @Query('limit') limit = '30',
    @Query('search') search = '',
  ) {
    return this.tiendaService.obtenerProductosTienda(slug, Number(page) || 1, Number(limit) || 30, search);
  }

  @Get(':slug/products/:id')
  async obtenerProductoDetalle(
    @Param('slug') slug: string,
    @Param('id') id: string,
  ) {
    return this.tiendaService.obtenerProductoDetalle(slug, +id);
  }

  @Get(':slug/payment-config')
  async obtenerConfiguracionPago(@Param('slug') slug: string) {
    return this.tiendaService.obtenerConfiguracionPago(slug);
  }

  @Get(':slug/shipping-config')
  async obtenerConfiguracionEnvio(@Param('slug') slug: string) {
    return this.tiendaService.obtenerConfiguracionEnvioPublica(slug);
  }

  @Get('track/:codigo')
  async rastrearPedido(@Param('codigo') codigo: string) {
    return this.tiendaService.obtenerPedidoPorCodigo(codigo);
  }

  @Post(':slug/orders')
  async crearPedido(
    @Param('slug') slug: string,
    @Body() dto: CrearPedidoDto,
  ) {
    return this.tiendaService.crearPedido(slug, dto);
  }
}
