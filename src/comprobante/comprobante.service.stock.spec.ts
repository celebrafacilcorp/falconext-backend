import { Test, TestingModule } from '@nestjs/testing';
import { ComprobanteService } from './comprobante.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('ComprobanteService - Stock Management', () => {
  let service: ComprobanteService;
  let prisma: PrismaService;

  const mockPrismaService = {
    comprobante: {
      findUnique: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
      findFirst: jest.fn(),
    },
    producto: {
      findUnique: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
    },
    cliente: {
      findFirst: jest.fn(),
    },
    tipoOperacion: {
      findUnique: jest.fn(),
    },
    motivoNota: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ComprobanteService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ComprobanteService>(ComprobanteService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('anularComprobante', () => {
    it('debería revertir stock para comprobante formal (factura)', async () => {
      const mockComprobante = {
        id: 1,
        tipoDoc: '01', // Factura
        serie: 'F0A1',
        correlativo: 1,
        detalles: [
          { id: 1, productoId: 100, cantidad: 5, descripcion: 'Producto A' },
          { id: 2, productoId: 101, cantidad: 3, descripcion: 'Producto B' },
        ],
      };

      const mockProductos = [
        { id: 100, stock: 10 },
        { id: 101, stock: 20 },
      ];

      mockPrismaService.comprobante.findUnique.mockResolvedValue(
        mockComprobante,
      );
      mockPrismaService.producto.findUnique
        .mockResolvedValueOnce(mockProductos[0])
        .mockResolvedValueOnce(mockProductos[1]);
      mockPrismaService.comprobante.update.mockResolvedValue({
        ...mockComprobante,
        estadoEnvioSunat: 'ANULADO',
      });

      await service.anularComprobante(1);

      // Verificar que se consultó el stock de ambos productos
      expect(mockPrismaService.producto.findUnique).toHaveBeenCalledTimes(2);
      expect(mockPrismaService.producto.findUnique).toHaveBeenCalledWith({
        where: { id: 100 },
        select: { stock: true },
      });
      expect(mockPrismaService.producto.findUnique).toHaveBeenCalledWith({
        where: { id: 101 },
        select: { stock: true },
      });

      // Verificar que se actualizó el stock correctamente (incrementando las cantidades)
      expect(mockPrismaService.producto.update).toHaveBeenCalledTimes(2);
      expect(mockPrismaService.producto.update).toHaveBeenCalledWith({
        where: { id: 100 },
        data: { stock: 15 }, // 10 + 5
      });
      expect(mockPrismaService.producto.update).toHaveBeenCalledWith({
        where: { id: 101 },
        data: { stock: 23 }, // 20 + 3
      });

      // Verificar que se actualizó el estado del comprobante
      expect(mockPrismaService.comprobante.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          estadoEnvioSunat: 'ANULADO',
        },
      });
    });

    it('debería revertir stock para comprobante informal (ticket)', async () => {
      const mockComprobante = {
        id: 2,
        tipoDoc: 'TICKET', // Ticket
        serie: 'T001',
        correlativo: 1,
        detalles: [
          { id: 3, productoId: 102, cantidad: 2, descripcion: 'Producto C' },
        ],
      };

      const mockProducto = { id: 102, stock: 5 };

      mockPrismaService.comprobante.findUnique.mockResolvedValue(
        mockComprobante,
      );
      mockPrismaService.producto.findUnique.mockResolvedValue(mockProducto);
      mockPrismaService.comprobante.update.mockResolvedValue({
        ...mockComprobante,
        estadoEnvioSunat: 'ANULADO',
        estadoPago: 'ANULADO',
        saldo: 0,
      });

      await service.anularComprobante(2);

      // Verificar que se actualizó el stock
      expect(mockPrismaService.producto.update).toHaveBeenCalledWith({
        where: { id: 102 },
        data: { stock: 7 }, // 5 + 2
      });

      // Verificar que se actualizó el comprobante informal con campos adicionales
      expect(mockPrismaService.comprobante.update).toHaveBeenCalledWith({
        where: { id: 2 },
        data: {
          estadoEnvioSunat: 'ANULADO',
          estadoPago: 'ANULADO',
          saldo: 0,
        },
      });
    });

    it('NO debería revertir stock para nota de crédito', async () => {
      const mockComprobante = {
        id: 3,
        tipoDoc: '07', // Nota de crédito
        serie: 'FCA1',
        correlativo: 1,
        detalles: [
          { id: 4, productoId: 103, cantidad: 1, descripcion: 'Producto D' },
        ],
      };

      mockPrismaService.comprobante.findUnique.mockResolvedValue(
        mockComprobante,
      );
      mockPrismaService.comprobante.update.mockResolvedValue({
        ...mockComprobante,
        estadoEnvioSunat: 'ANULADO',
      });

      await service.anularComprobante(3);

      // Verificar que NO se consultó ni actualizó ningún producto
      expect(mockPrismaService.producto.findUnique).not.toHaveBeenCalled();
      expect(mockPrismaService.producto.update).not.toHaveBeenCalled();

      // Solo se actualizó el comprobante
      expect(mockPrismaService.comprobante.update).toHaveBeenCalledWith({
        where: { id: 3 },
        data: {
          estadoEnvioSunat: 'ANULADO',
        },
      });
    });

    it('debería manejar productos inexistentes sin fallar', async () => {
      const mockComprobante = {
        id: 4,
        tipoDoc: '01',
        serie: 'F0A1',
        correlativo: 2,
        detalles: [
          {
            id: 5,
            productoId: 999,
            cantidad: 1,
            descripcion: 'Producto inexistente',
          },
        ],
      };

      mockPrismaService.comprobante.findUnique.mockResolvedValue(
        mockComprobante,
      );
      mockPrismaService.producto.findUnique.mockResolvedValue(null); // Producto no existe
      mockPrismaService.comprobante.update.mockResolvedValue({
        ...mockComprobante,
        estadoEnvioSunat: 'ANULADO',
      });

      await service.anularComprobante(4);

      // Verificar que se consultó el producto
      expect(mockPrismaService.producto.findUnique).toHaveBeenCalledWith({
        where: { id: 999 },
        select: { stock: true },
      });

      // Verificar que NO se intentó actualizar el producto inexistente
      expect(mockPrismaService.producto.update).not.toHaveBeenCalled();

      // Pero sí se actualizó el comprobante
      expect(mockPrismaService.comprobante.update).toHaveBeenCalledWith({
        where: { id: 4 },
        data: {
          estadoEnvioSunat: 'ANULADO',
        },
      });
    });

    it('debería lanzar NotFoundException si el comprobante no existe', async () => {
      mockPrismaService.comprobante.findUnique.mockResolvedValue(null);

      await expect(service.anularComprobante(999)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.anularComprobante(999)).rejects.toThrow(
        'Comprobante no encontrado',
      );
    });
  });
});
