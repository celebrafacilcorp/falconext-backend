import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProductoDto {
  @IsOptional()
  @IsString()
  codigo?: string;

  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsInt()
  unidadMedidaId: number;

  @IsString()
  tipoAfectacionIGV: string; // '10', '20', '30', '40'

  @IsNumber()
  precioUnitario: number;

  @IsOptional()
  @IsNumber()
  igvPorcentaje?: number; // default 18

  @IsInt()
  stock: number;

  @IsOptional()
  @IsInt()
  categoriaId?: number;

  @IsOptional()
  @IsInt()
  stockMinimo?: number;

  @IsOptional()
  @IsInt()
  stockMaximo?: number;
}
