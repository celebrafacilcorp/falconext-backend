import { Module } from '@nestjs/common';
import { CategoriaService } from './categoria.service';
import { CategoriaController } from './categoria.controller';
import { RolesGuard } from '../common/guards/roles.guard';

@Module({
  controllers: [CategoriaController],
  providers: [CategoriaService, RolesGuard],
  exports: [CategoriaService],
})
export class CategoriaModule {}
