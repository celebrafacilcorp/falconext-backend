import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class VerificarPendientesSunatService {
  private readonly logger = new Logger(VerificarPendientesSunatService.name);
  private readonly documentUrl = 'https://back.apisunat.com/documents';

  constructor(private readonly prisma: PrismaService) {}

  async execute(): Promise<void> {
    try {
      const pendientes = await this.prisma.comprobante.findMany({
        where: {
          estadoEnvioSunat: 'PENDIENTE',
          documentoId: { not: null },
        },
        include: {
          empresa: { select: { providerToken: true } },
        },
      });

      this.logger.log(
        `Encontrados ${pendientes.length} comprobantes pendientes`,
      );

      for (const comprobante of pendientes) {
        try {
          const statusResponse = await axios.get(
            `${this.documentUrl}/${comprobante.documentoId}/getById?data=true`,
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${comprobante.empresa?.providerToken}`,
              },
            },
          );

          const finalResponse = statusResponse.data;
          const status = finalResponse.status;

          await this.prisma.comprobante.update({
            where: { id: comprobante.id },
            data: {
              estadoEnvioSunat:
                status === 'ACEPTADO'
                  ? 'EMITIDO'
                  : status === 'EXCEPCION'
                    ? 'RECHAZADO'
                    : 'PENDIENTE',
              sunatXml: finalResponse.xml || null,
              sunatCdrZip: finalResponse.cdr || null,
              sunatCdrResponse: JSON.stringify(finalResponse),
              sunatErrorMsg:
                status !== 'ACEPTADO'
                  ? finalResponse.error?.message || 'Error desconocido'
                  : null,
            },
          });

          if (status === 'ACEPTADO' || status === 'RECHAZADO') {
            this.logger.log(
              `Comprobante ${comprobante.id} actualizado a ${status}`,
            );
          }
        } catch (err: any) {
          this.logger.error(
            `Error verificando documento ${comprobante.documentoId}: ${err.message}`,
          );
        }
      }
    } catch (err: any) {
      this.logger.error(`Error en verificación de SUNAT: ${err.message}`);
    }
  }
}
