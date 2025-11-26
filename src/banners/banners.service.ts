import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { FeaturesService } from '../features/features.service';

@Injectable()
export class BannersService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly featuresService: FeaturesService,
    ) { }

    async create(empresaId: number, createBannerDto: CreateBannerDto) {
        // Validar si tiene feature activado
        await this.featuresService.validarFeature(empresaId, 'tieneBanners');

        // Validar límite
        const bannersCount = await this.prisma.banner.count({
            where: { empresaId },
        });
        await this.featuresService.validarLimite(empresaId, 'banners', bannersCount);

        return this.prisma.banner.create({
            data: {
                ...createBannerDto,
                empresaId,
            },
        });
    }

    async findAll(empresaId: number) {
        return this.prisma.banner.findMany({
            where: { empresaId },
            orderBy: { orden: 'asc' },
        });
    }

    async findOne(id: number, empresaId: number) {
        const banner = await this.prisma.banner.findFirst({
            where: { id, empresaId },
        });
        if (!banner) throw new NotFoundException('Banner no encontrado');
        return banner;
    }

    async update(id: number, empresaId: number, updateBannerDto: UpdateBannerDto) {
        await this.findOne(id, empresaId); // Verificar propiedad
        return this.prisma.banner.update({
            where: { id },
            data: updateBannerDto,
        });
    }

    async remove(id: number, empresaId: number) {
        await this.findOne(id, empresaId); // Verificar propiedad
        return this.prisma.banner.delete({
            where: { id },
        });
    }
}
