import { IsOptional, IsString, IsNumber, IsDecimal, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';

export enum TipoCaja {
  APERTURA = 'APERTURA',
  CIERRE = 'CIERRE',
  INGRESO = 'INGRESO',
  EGRESO = 'EGRESO',
}

export class AperturaCajaDto {
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  montoInicial: number;

  @IsOptional()
  @IsString()
  observaciones?: string;

  @IsOptional()
  @IsString()
  turno?: string; // MAÑANA, TARDE, NOCHE
}

export class CierreCajaDto {
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  montoEfectivo: number;

  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  montoYape: number;

  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  montoPlin: number;

  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  montoTransferencia: number;

  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  montoTarjeta: number;

  @IsOptional()
  @IsString()
  observaciones?: string;
}

export class MovimientoCajaDto {
  @IsEnum(TipoCaja)
  tipoMovimiento: TipoCaja;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  monto?: number;

  @IsOptional()
  @IsString()
  medioPago?: string;

  @IsOptional()
  @IsString()
  concepto?: string;

  @IsOptional()
  @IsString()
  observaciones?: string;
}

export class EstadoCajaDto {
  @IsOptional()
  @IsString()
  fechaInicio?: string;

  @IsOptional()
  @IsString()
  fechaFin?: string;
}