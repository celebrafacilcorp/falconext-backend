import { Module } from '@nestjs/common';
import { BannersService } from './banners.service';
import { BannersController } from './banners.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { FeaturesModule } from '../features/features.module';

@Module({
    imports: [PrismaModule, FeaturesModule],
    controllers: [BannersController],
    providers: [BannersService],
})
export class BannersModule { }
