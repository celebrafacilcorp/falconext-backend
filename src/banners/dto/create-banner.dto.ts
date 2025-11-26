import { IsString, IsOptional, IsBoolean, IsNumber, IsUrl } from 'class-validator';

export class CreateBannerDto {
    @IsString()
    titulo: string;

    @IsString()
    @IsUrl()
    imagenUrl: string;

    @IsString()
    @IsOptional()
    link?: string;

    @IsNumber()
    @IsOptional()
    orden?: number;

    @IsBoolean()
    @IsOptional()
    activo?: boolean;
}
