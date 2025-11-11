import {
  BadRequestException,
  Controller,
  Get,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { User } from '../common/decorators/user.decorator';
import { ContabilidadService } from './contabilidad.service';
import { ArqueoService } from './arqueo.service';
import { CajaService } from '../caja/caja.service';
import type { Response } from 'express';
import * as XLSX from 'xlsx';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('contabilidad')
export class ContabilidadController {
  constructor(
    private readonly service: ContabilidadService,
    private readonly arqueoService: ArqueoService,
    private readonly cajaService: CajaService,
  ) {}

  @Get('obtener-reporte')
  @Roles('ADMIN_EMPRESA', 'USUARIO_EMPRESA')
  async obtenerReporte(
    @User() user: any,
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
  ) {
    if (!fechaInicio || !fechaFin)
      throw new BadRequestException('fechaInicio y fechaFin son requeridos');
    const data = await this.service.obtenerReporte(
      user.empresaId,
      fechaInicio,
      fechaFin,
    );
    return data;
  }

  @Get('obtener-reporte-informales')
  @Roles('ADMIN_EMPRESA', 'USUARIO_EMPRESA')
  async obtenerReporteInformales(
    @User() user: any,
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
  ) {
    if (!fechaInicio || !fechaFin)
      throw new BadRequestException('fechaInicio y fechaFin son requeridos');
    const data = await this.service.obtenerReporteInformales(
      user.empresaId,
      fechaInicio,
      fechaFin,
    );
    return data;
  }

  @Get('reporte-exportar')
  @Roles('ADMIN_EMPRESA', 'USUARIO_EMPRESA')
  async exportarReporte(
    @User() user: any,
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
    @Res() res: Response,
  ) {
    if (!fechaInicio || !fechaFin)
      throw new BadRequestException('fechaInicio y fechaFin son requeridos');
    const { comprobantes, resumen } = await this.service.obtenerReporte(
      user.empresaId,
      fechaInicio,
      fechaFin,
    );

    // Preparar datos para Excel siguiendo formato del proyecto Node original
    const datosExcel = comprobantes.map((comp) => ({
      TIPO: comp.comprobante,
      SERIE: comp.serie,
      CORRELATIVO: comp.correlativo,
      'NUMERO DOCUMENTO': comp.cliente?.nroDoc ?? '',
      CLIENTE: comp.cliente?.nombre ?? '',
      'FECHA EMISIÓN': new Date(comp.fechaEmision).toISOString().split('T')[0],
      'ESTADO SUNAT': comp.estadoEnvioSunat,
      'OPERACION GRAVADAS': Number(comp.mtoOperGravadas ?? 0),
      IGV: Number(comp.mtoIGV ?? 0),
      TOTAL: Number(comp.mtoImpVenta ?? 0),
    }));

    // Crear hoja de cálculo
    const worksheet = XLSX.utils.json_to_sheet(datosExcel);

    // Ajustar anchos de columnas
    worksheet['!cols'] = [
      { wch: 12 }, // TIPO
      { wch: 10 }, // SERIE
      { wch: 15 }, // CORRELATIVO
      { wch: 20 }, // NUMERO DOCUMENTO
      { wch: 30 }, // CLIENTE
      { wch: 30 }, // FECHA EMISIÓN
      { wch: 30 }, // ESTADO SUNAT
      { wch: 30 }, // OPERACION GRAVADAS
      { wch: 30 }, // IGV
      { wch: 30 }, // TOTAL
    ];

    // Agregar filas vacías de separación
    XLSX.utils.sheet_add_aoa(worksheet, [[''], ['']], { origin: -1 });

    // Agregar filas de resumen como en el proyecto Node original
    const resumenData = [
      ['BOLETAS', resumen.totalBoletas],
      ['FACTURAS', resumen.totalFacturas],
      ['NOTA DE CREDITO', resumen.totalNotasCredito],
      ['NOTA DE DEBITO', resumen.totalNotasDebito],
      ['TOTAL DESCUENTO', resumen.totalDescuentos],
      ['TOTAL INAFECTAS', resumen.totalInafectas],
      ['TOTAL GRAVADAS', resumen.totalGravadas],
      ['TOTAL IGV', resumen.totalIGV],
      ['TOTALES:', resumen.totalVenta],
    ];

    XLSX.utils.sheet_add_aoa(
      worksheet,
      resumenData.map(([label, value]) =>
        Array(8).fill('').concat([label, value]),
      ),
      { origin: -1 },
    );

    // Crear y devolver el archivo
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Comprobantes');
    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

    // Generar archivo Excel
    const fileName = `reporte-contabilidad-${fechaInicio}_a_${fechaFin}.xlsx`;
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Length', buffer.length.toString());
    return res.end(buffer, 'binary');
  }

  @Get('reporte-informales-exportar')
  @Roles('ADMIN_EMPRESA', 'USUARIO_EMPRESA')
  async exportarReporteInformales(
    @User() user: any,
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
    @Res() res: Response,
  ) {
    if (!fechaInicio || !fechaFin)
      throw new BadRequestException('fechaInicio y fechaFin son requeridos');
    const { comprobantes, resumen } =
      await this.service.obtenerReporteInformales(
        user.empresaId,
        fechaInicio,
        fechaFin,
      );

    // Preparar datos para Excel siguiendo formato del proyecto Node original
    const datosExcel = comprobantes.map((comp) => ({
      TIPO: comp.comprobante,
      SERIE: comp.serie,
      CORRELATIVO: comp.correlativo,
      'NUMERO DOCUMENTO': comp.cliente?.nroDoc ?? '',
      CLIENTE: comp.cliente?.nombre ?? '',
      'FECHA EMISIÓN': new Date(comp.fechaEmision).toISOString().split('T')[0],
      'ESTADO PAGO': comp.estadoPago,
      SALDO: Number(comp.saldo ?? 0),
      'MEDIO PAGO': comp.medioPago || '-',
      'ESTADO OT': comp.estadoOT || '-',
      ADELANTO: Number(comp.adelanto ?? 0),
      TOTAL: Number(comp.mtoImpVenta ?? 0),
    }));

    // Crear hoja de cálculo
    const worksheet = XLSX.utils.json_to_sheet(datosExcel);

    // Ajustar anchos de columnas
    worksheet['!cols'] = [
      { wch: 12 }, // TIPO
      { wch: 10 }, // SERIE
      { wch: 15 }, // CORRELATIVO
      { wch: 20 }, // NUMERO DOCUMENTO
      { wch: 30 }, // CLIENTE
      { wch: 20 }, // FECHA EMISIÓN
      { wch: 15 }, // ESTADO PAGO
      { wch: 12 }, // SALDO
      { wch: 15 }, // MEDIO PAGO
      { wch: 12 }, // ESTADO OT
      { wch: 12 }, // ADELANTO
      { wch: 12 }, // TOTAL
    ];

    // Agregar filas vacías de separación
    XLSX.utils.sheet_add_aoa(worksheet, [[''], ['']], { origin: -1 });

    // Agregar filas de resumen como en el proyecto Node original
    const resumenData = [
      ['TICKETS', resumen.totalTickets],
      ['NOTAS DE VENTA', resumen.totalNotasVenta],
      ['RECIBOS HONORARIOS', resumen.totalRecibosHonorarios],
      ['COMPROBANTES PAGO', resumen.totalComprobantesPago],
      ['NOTAS PEDIDO', resumen.totalNotasPedido],
      ['ORDENES TRABAJO', resumen.totalOrdenesTrabajo],
      ['TOTALES:', resumen.totalVenta],
    ];

    XLSX.utils.sheet_add_aoa(
      worksheet,
      resumenData.map(([label, value]) =>
        Array(10).fill('').concat([label, value]),
      ),
      { origin: -1 },
    );

    // Crear y devolver el archivo
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      'Comprobantes Informales',
    );
    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

    // Generar archivo Excel
    const fileName = `reporte-informales-${fechaInicio}_a_${fechaFin}.xlsx`;
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Length', buffer.length.toString());
    return res.end(buffer, 'binary');
  }

  @Get('obtener-arqueo')
  @Roles('ADMIN_EMPRESA', 'USUARIO_EMPRESA')
  async obtenerArqueo(
    @User() user: any,
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
  ) {
    if (!fechaInicio || !fechaFin)
      throw new BadRequestException('fechaInicio y fechaFin son requeridos');
    const data = await this.arqueoService.obtenerArqueoCaja(
      user.empresaId,
      fechaInicio,
      fechaFin,
    );
    return data;
  }

  @Get('arqueo-exportar')
  @Roles('ADMIN_EMPRESA', 'USUARIO_EMPRESA')
  async exportarArqueo(
    @User() user: any,
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
    @Res() res: Response,
  ) {
    if (!fechaInicio || !fechaFin)
      throw new BadRequestException('fechaInicio y fechaFin son requeridos');
    const { resumen, movimientosCaja, ingresosPorMedioPago } =
      await this.arqueoService.obtenerArqueoCaja(
        user.empresaId,
        fechaInicio,
        fechaFin,
      );

    // Preparar datos para Excel siguiendo formato del proyecto Node original
    const datosExcel = movimientosCaja.map((mov) => ({
      TIPO: mov.tipo,
      DOCUMENTO: mov.documento,
      CLIENTE: mov.cliente,
      FECHA: new Date(mov.fecha).toISOString().split('T')[0],
      CONCEPTO: mov.concepto,
      'MEDIO PAGO': mov.medioPago,
      MONTO: Number(mov.monto),
      REFERENCIA: mov.referencia || '-',
    }));

    // Crear hoja de cálculo
    const worksheet = XLSX.utils.json_to_sheet(datosExcel);

    // Ajustar anchos de columnas
    worksheet['!cols'] = [
      { wch: 12 }, // TIPO
      { wch: 20 }, // DOCUMENTO
      { wch: 30 }, // CLIENTE
      { wch: 15 }, // FECHA
      { wch: 25 }, // CONCEPTO
      { wch: 15 }, // MEDIO PAGO
      { wch: 12 }, // MONTO
      { wch: 20 }, // REFERENCIA
    ];

    // Agregar filas vacías de separación
    XLSX.utils.sheet_add_aoa(worksheet, [[''], ['']], { origin: -1 });

    // Agregar resumen de arqueo
    const resumenData = [
      ['RESUMEN ARQUEO DE CAJA', ''],
      ['TOTAL EFECTIVO', resumen.detalleEfectivo],
      ['TOTAL YAPE', resumen.detalleYape],
      ['TOTAL PLIN', resumen.detallePlin],
      ['TOTAL TRANSFERENCIA', resumen.detalleTransferencia],
      ['TOTAL TARJETA', resumen.detalleTarjeta],
      ['TOTAL DIGITAL', resumen.totalDigital],
      ['TOTAL INGRESOS:', resumen.totalIngresos],
    ];

    XLSX.utils.sheet_add_aoa(
      worksheet,
      resumenData.map(([label, value]) =>
        Array(6).fill('').concat([label, value]),
      ),
      { origin: -1 },
    );

    // Crear y devolver el archivo
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Arqueo de Caja');
    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

    // Generar archivo Excel
    const fileName = `arqueo-caja-${fechaInicio}_a_${fechaFin}.xlsx`;
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Length', buffer.length.toString());
    return res.end(buffer, 'binary');
  }
}
