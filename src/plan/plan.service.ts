import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';

@Injectable()
export class PlanService {
    constructor(private prisma: PrismaService) { }

    async create(createPlanDto: CreatePlanDto) {
        return this.prisma.plan.create({
            data: createPlanDto,
        });
    }

    async findAll() {
        return this.prisma.plan.findMany({
            orderBy: { costo: 'asc' },
            include: {
                _count: {
                    select: { empresas: true }
                }
            }
        });
    }

    async findOne(id: number) {
        const plan = await this.prisma.plan.findUnique({
            where: { id },
        });
        if (!plan) throw new NotFoundException(`Plan with ID ${id} not found`);
        return plan;
    }

    async update(id: number, updatePlanDto: UpdatePlanDto) {
        // Verificar existencia
        await this.findOne(id);
        return this.prisma.plan.update({
            where: { id },
            data: updatePlanDto,
        });
    }

    async remove(id: number) {
        await this.findOne(id);
        // Verificar si tiene empresas
        const count = await this.prisma.empresa.count({ where: { planId: id } });
        if (count > 0) {
            throw new Error(`No se puede eliminar el plan porque tiene ${count} empresas asignadas.`);
        }

        return this.prisma.plan.delete({
            where: { id },
        });
    }
}
