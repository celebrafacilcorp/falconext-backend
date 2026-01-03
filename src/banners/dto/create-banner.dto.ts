import { IsString, IsOptional, IsBoolean, IsNumber, IsUrl } from 'class-validator';

export class CreateBannerDto {
    @IsString()
    titulo: string;

    @IsString()
    @IsOptional()
    subtitulo?: string;

    @IsString()
    @IsUrl()
    imagenUrl: string;

    @IsString()
    @IsOptional()
    linkUrl?: string;

    @IsNumber()
    @IsOptional()
    productoId?: number;

    @IsNumber()
    @IsOptional()
    orden?: number;

    @IsBoolean()
    @IsOptional()
    activo?: boolean;
}

