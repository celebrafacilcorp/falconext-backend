import { Body, Controller, Get, Put, Query, UseGuards } from '@nestjs/common';
import { PreferenciasService } from './preferencias.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { User } from '../common/decorators/user.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('preferencias')
export class PreferenciasController {
  constructor(private readonly service: PreferenciasService) {}

  @Get('tabla')
  @Roles('ADMIN_EMPRESA', 'USUARIO_EMPRESA')
  async getPreferenciaTabla(
    @User() user: any,
    @Query('tabla') tabla: string,
    @Query('empresaId') empresaIdParam?: string,
  ) {
    const empresaId = Number(empresaIdParam ?? user?.empresaId);
    if (!empresaId || Number.isNaN(empresaId)) {
      throw new Error('empresaId inválido');
    }
    const result = await this.service.getTabla(user.id, empresaId, tabla);
    return { visibleColumns: result };
  }

  @Put('tabla')
  @Roles('ADMIN_EMPRESA', 'USUARIO_EMPRESA')
  async setPreferenciaTabla(
    @User() user: any,
    @Query('tabla') tabla: string,
    @Query('empresaId') empresaIdParam: string,
    @Body() body: { visibleColumns: string[] },
  ) {
    const empresaId = Number(empresaIdParam ?? user?.empresaId);
    if (!empresaId || Number.isNaN(empresaId)) {
      throw new Error('empresaId inválido');
    }
    const visible = await this.service.setTabla(user.id, empresaId, tabla, body?.visibleColumns || []);
    return { visibleColumns: visible };
  }
}
