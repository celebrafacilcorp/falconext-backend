import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductoService } from './producto.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { User } from '../common/decorators/user.decorator';
import type { Response } from 'express';
import { CreateProductoDto } from './dto/create-producto.dto';
import { ListProductoDto } from './dto/list-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('producto')
export class ProductoController {
  constructor(private readonly service: ProductoService) {}

  @Post('crear')
  @Roles('ADMIN_EMPRESA', 'USUARIO_EMPRESA')
  async crear(
    @Body() dto: CreateProductoDto,
    @User() user: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    const producto = await this.service.crear(dto, user.empresaId);
    res.locals.message = 'Producto creado correctamente';
    return producto;
  }

  @Get('listar')
  @Roles('ADMIN_EMPRESA', 'USUARIO_EMPRESA')
  async listar(
    @User() user: any,
    @Query() query: ListProductoDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const resultado = await this.service.listar({
      empresaId: user.empresaId,
      search: query.search,
      page: query.page,
      limit: query.limit,
      sort: query.sort,
      order: query.order,
    });
    res.locals.message = 'Productos listados correctamente';
    return resultado;
  }

  @Get(':id')
  @Roles('ADMIN_EMPRESA', 'USUARIO_EMPRESA')
  async obtenerPorId(
    @Param('id', ParseIntPipe) id: number,
    @User() user: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    const producto = await this.service.obtenerPorId(id, user.empresaId);
    res.locals.message = 'Producto obtenido correctamente';
    return producto;
  }

  @Put(':id')
  @Roles('ADMIN_EMPRESA', 'USUARIO_EMPRESA')
  async actualizar(
    @Param('id', ParseIntPipe) id: number,
    @User() user: any,
    @Body() body: Omit<UpdateProductoDto, 'id' | 'empresaId'>,
    @Res({ passthrough: true }) res: Response,
  ) {
    const actualizado = await this.service.actualizar({
      id,
      empresaId: user.empresaId,
      ...body,
    }, user.id); // Pasar el usuarioId para el kardex
    res.locals.message = 'Producto actualizado correctamente';
    return actualizado;
  }

  @Patch(':id/estado')
  @Roles('ADMIN_EMPRESA', 'USUARIO_EMPRESA')
  async cambiarEstado(
    @Param('id', ParseIntPipe) id: number,
    @User() user: any,
    @Body() body: { estado: 'ACTIVO' | 'INACTIVO' | 'PLACEHOLDER' },
    @Res({ passthrough: true }) res: Response,
  ) {
    const actualizado = await this.service.cambiarEstado(
      id,
      user.empresaId,
      body.estado as any,
    );
    res.locals.message = `Producto ${body.estado === 'ACTIVO' ? 'activado' : body.estado === 'INACTIVO' ? 'desactivado' : 'actualizado'} correctamente`;
    return actualizado;
  }

  @Get('empresa/:empresaId/codigo-siguiente')
  @Roles('ADMIN_EMPRESA', 'USUARIO_EMPRESA')
  async codigoSiguientePorEmpresa(@Param('empresaId') empresaIdParam: string) {
    const empresaId = Number(empresaIdParam);
    if (!empresaId || Number.isNaN(empresaId)) {
      throw new BadRequestException('empresaId debe ser un número válido');
    }
    const codigo = await this.service.obtenerSiguienteCodigo(empresaId, 'PR');
    return { codigo };
  }

  @Post('carga-masiva')
  @Roles('ADMIN_EMPRESA', 'USUARIO_EMPRESA')
  @UseInterceptors(FileInterceptor('file'))
  async cargarMasivo(@UploadedFile() file: any, @User() user: any) {
    if (!file) {
      return {
        total: 0,
        exitosos: 0,
        fallidos: 0,
        detalles: [{ error: 'No se proporcionó un archivo Excel' }],
      };
    }
    return this.service.cargaMasiva(file.buffer, user.empresaId);
  }

  @Get('empresa/:empresaId/exportar-archivo/:search')
  @Roles('ADMIN_EMPRESA', 'USUARIO_EMPRESA')
  async exportarBuscar(
    @Param('empresaId') empresaIdParam: string,
    @Param('search') search: string,
    @Res() res: Response,
  ) {
    const empresaId = Number(empresaIdParam);
    if (!empresaId || Number.isNaN(empresaId)) {
      throw new BadRequestException('empresaId debe ser un número válido');
    }
    const buffer = await this.service.exportar(empresaId, search);
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', 'attachment; filename=productos.xlsx');
    res.status(200).send(buffer);
  }

  @Get('empresa/:empresaId/exportar-archivo')
  @Roles('ADMIN_EMPRESA', 'USUARIO_EMPRESA')
  async exportarArchivoEmpresa(
    @Param('empresaId') empresaIdParam: string,
    @Res() res: Response,
  ) {
    const empresaId = Number(empresaIdParam);
    if (!empresaId || Number.isNaN(empresaId)) {
      throw new BadRequestException('empresaId debe ser un número válido');
    }
    const buffer = await this.service.exportar(empresaId, undefined);
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', 'attachment; filename=productos.xlsx');
    res.status(200).send(buffer);
  }

  // Endpoint para compatibilidad con frontend kardex
  @Get()
  @Roles('ADMIN_EMPRESA', 'USUARIO_EMPRESA')
  async listarProductos(
    @User() user: any,
    @Query() query: ListProductoDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const resultado = await this.service.listar({
      empresaId: user.empresaId,
      search: query.search,
      page: query.page,
      limit: query.limit,
      sort: query.sort,
      order: query.order,
    });
    res.locals.message = 'Productos listados correctamente';
    return resultado;
  }
}
