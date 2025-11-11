import { Module } from '@nestjs/common';
import { EmpresaService } from './empresa.service';
import { EmpresaController } from './empresa.controller';
import { RolesGuard } from '../common/guards/roles.guard';

@Module({
  controllers: [EmpresaController],
  providers: [EmpresaService, RolesGuard],
  exports: [EmpresaService],
})
export class EmpresaModule {}
