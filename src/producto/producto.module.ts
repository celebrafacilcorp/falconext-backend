import { Module, forwardRef } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { ProductoController } from './producto.controller';
import { RolesGuard } from '../common/guards/roles.guard';
import { KardexModule } from '../kardex/kardex.module';
import { S3Module } from '../s3/s3.module';

@Module({
  imports: [forwardRef(() => KardexModule), S3Module],
  controllers: [ProductoController],
  providers: [ProductoService, RolesGuard],
  exports: [ProductoService],
})
export class ProductoModule {}
