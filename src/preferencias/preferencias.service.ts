import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PreferenciasService {
  constructor(private readonly prisma: PrismaService) {}

  async getTabla(usuarioId: number, empresaId: number, tabla: string) {
    if (!tabla) throw new BadRequestException('tabla requerida');
    const pref = await this.prisma.preferenciaTabla.findUnique({
      where: {
        usuarioId_empresaId_tabla: {
          usuarioId,
          empresaId,
          tabla,
        },
      },
    });
    return pref?.visibleColumns ?? null;
  }

  async setTabla(usuarioId: number, empresaId: number, tabla: string, visibleColumns: string[]) {
    if (!tabla) throw new BadRequestException('tabla requerida');
    if (!Array.isArray(visibleColumns)) throw new BadRequestException('visibleColumns inválido');
    const clean = visibleColumns.filter((x) => typeof x === 'string');
    const data = {
      usuarioId,
      empresaId,
      tabla,
      visibleColumns: clean as any,
    } as any;
    const saved = await this.prisma.preferenciaTabla.upsert({
      where: {
        usuarioId_empresaId_tabla: {
          usuarioId,
          empresaId,
          tabla,
        },
      },
      create: data,
      update: { visibleColumns: clean as any },
    });
    return saved.visibleColumns;
  }
}
