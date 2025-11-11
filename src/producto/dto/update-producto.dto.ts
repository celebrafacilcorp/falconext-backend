import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateProductoDto {
  @IsInt()
  id: number;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsInt()
  categoriaId?: number | null;

  @IsOptional()
  @IsInt()
  unidadMedidaId?: number;

  @IsOptional()
  @IsString()
  tipoAfectacionIGV?: string;

  @IsOptional()
  @IsNumber()
  valorUnitario?: number;

  @IsOptional()
  @IsNumber()
  igvPorcentaje?: number;

  @IsOptional()
  @IsNumber()
  precioUnitario?: number;

  @IsOptional()
  @IsInt()
  stock?: number;

  @IsOptional()
  @IsNumber()
  costoUnitario?: number;

  @IsOptional()
  @IsInt()
  stockMinimo?: number;

  @IsOptional()
  @IsInt()
  stockMaximo?: number;
}
