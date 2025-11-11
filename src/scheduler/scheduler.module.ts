import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulerService } from './scheduler.service';
import { VerificarPendientesSunatService } from './services/verificar-pendientes-sunat.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotificacionesModule } from '../notificaciones/notificaciones.module';

@Module({
  imports: [ScheduleModule.forRoot(), NotificacionesModule],
  providers: [SchedulerService, VerificarPendientesSunatService, PrismaService],
})
export class SchedulerModule {}
