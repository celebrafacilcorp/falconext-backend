import { Module } from '@nestjs/common';
import { PreferenciasService } from './preferencias.service';
import { PreferenciasController } from './preferencias.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PreferenciasController],
  providers: [PreferenciasService],
  exports: [PreferenciasService],
})
export class PreferenciasModule {}
