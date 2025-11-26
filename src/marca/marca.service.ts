import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MarcaService {
  constructor(private readonly prisma: PrismaService) {}

  async crear(nombre: string, empresaId: number) {
    const existe = await this.prisma.marca.findFirst({ where: { nombre, empresaId } });
    if (existe) throw new ForbiddenException('Ya existe una marca con ese nombre en tu empresa');
    return this.prisma.marca.create({ data: { nombre, empresaId } });
  }

  async listar(empresaId: number) {
    return this.prisma.marca.findMany({ where: { empresaId }, orderBy: { id: 'desc' } });
  }

  async obtenerPorId(id: number, empresaId: number) {
    const marca = await this.prisma.marca.findFirst({ where: { id, empresaId } });
    if (!marca) throw new NotFoundException('Marca no encontrada');
    return marca;
  }

  async actualizar(id: number, nombre: string, empresaId: number) {
    const marca = await this.prisma.marca.findFirst({ where: { id, empresaId } });
    if (!marca) throw new NotFoundException('Marca no encontrada');
    // Validar duplicado
    const existe = await this.prisma.marca.findFirst({ where: { nombre, empresaId, NOT: { id } } });
    if (existe) throw new ForbiddenException('Ya existe otra marca con ese nombre');
    return this.prisma.marca.update({ where: { id }, data: { nombre } });
  }

  async eliminar(id: number, empresaId: number) {
    const marca = await this.prisma.marca.findFirst({ where: { id, empresaId } });
    if (!marca) throw new NotFoundException('Marca no encontrada');
    return this.prisma.marca.delete({ where: { id } });
  }
}
