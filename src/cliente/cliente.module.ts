import { Module } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { ClienteController } from './cliente.controller';
import { RolesGuard } from '../common/guards/roles.guard';

@Module({
  controllers: [ClienteController],
  providers: [ClienteService, RolesGuard],
  exports: [ClienteService],
})
export class ClienteModule {}
