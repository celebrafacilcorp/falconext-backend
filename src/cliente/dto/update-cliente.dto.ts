import { IsEmail, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateClienteDto {
  @IsInt()
  id: number;

  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  direccion?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsString()
  ubigeo?: string;

  @IsOptional()
  @IsString()
  departamento?: string;

  @IsOptional()
  @IsString()
  provincia?: string;

  @IsOptional()
  @IsString()
  distrito?: string;

  @IsOptional()
  @IsEnum(['CLIENTE', 'CLIENTE_PROVEEDOR', 'PROVEEDOR'])
  persona?: 'CLIENTE' | 'CLIENTE_PROVEEDOR' | 'PROVEEDOR';
}
