import { IsEnum, IsOptional, IsNumber } from 'class-validator';

export enum EstadoPedidoTienda {
  PENDIENTE = 'PENDIENTE',
  CONFIRMADO = 'CONFIRMADO',
  EN_PREPARACION = 'EN_PREPARACION',
  LISTO = 'LISTO',
  ENTREGADO = 'ENTREGADO',
  CANCELADO = 'CANCELADO',
}

export class ActualizarEstadoPedidoDto {
  @IsEnum(EstadoPedidoTienda)
  estado: EstadoPedidoTienda;

  @IsNumber()
  @IsOptional()
  usuarioConfirma?: number;
}
