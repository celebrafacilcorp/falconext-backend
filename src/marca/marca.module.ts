import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { MarcaService } from './marca.service';
import { MarcaController } from './marca.controller';

@Module({
  imports: [PrismaModule],
  providers: [MarcaService],
  controllers: [MarcaController],
  exports: [MarcaService],
})
export class MarcaModule {}
