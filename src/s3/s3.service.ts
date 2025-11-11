import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name);
  private s3Client: S3Client;
  private bucketName: string;
  private region: string;

  constructor(private readonly configService: ConfigService) {
    const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY');
    this.region = this.configService.get<string>('AWS_REGION') || 'us-east-1';
    this.bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME') || '';

    if (!accessKeyId || !secretAccessKey || !this.bucketName) {
      this.logger.warn('⚠️  Credenciales de AWS S3 no configuradas. S3 deshabilitado.');
    } else {
      this.s3Client = new S3Client({
        region: this.region,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      });
      this.logger.log(`✅ AWS S3 inicializado correctamente (bucket: ${this.bucketName})`);
    }
  }

  /**
   * Verifica si S3 está habilitado
   */
  isEnabled(): boolean {
    return !!this.s3Client;
  }

  /**
   * Sube un archivo PDF a S3
   * @param buffer Buffer del archivo
   * @param key Ruta/nombre del archivo en S3 (ej: comprobantes/empresa-1/F001-00000123.pdf)
   * @param contentType Tipo de contenido (default: application/pdf)
   * @returns URL pública del archivo
   */
  async uploadPDF(
    buffer: Buffer,
    key: string,
    contentType: string = 'application/pdf',
  ): Promise<string> {
    if (!this.isEnabled()) {
      throw new Error('S3 no está configurado');
    }

    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: buffer,
        ContentType: contentType,
        // No usar ACL cuando el bucket tiene Object Ownership = Bucket owner enforced
      });

      await this.s3Client.send(command);

      // Construir URL pública
      const url = `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`;
      
      this.logger.log(`✅ Archivo subido a S3: ${url}`);
      return url;
    } catch (error) {
      this.logger.error(`❌ Error subiendo archivo a S3: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Sube un archivo XML/ZIP a S3
   */
  async uploadXML(buffer: Buffer, key: string): Promise<string> {
    return this.uploadPDF(buffer, key, 'application/xml');
  }

  /**
   * Sube un archivo ZIP (CDR) a S3
   */
  async uploadZIP(buffer: Buffer, key: string): Promise<string> {
    return this.uploadPDF(buffer, key, 'application/zip');
  }

  /**
   * Genera una URL firmada temporal (si no quieres hacer público el bucket)
   * @param key Ruta del archivo en S3
   * @param expiresIn Tiempo de expiración en segundos (default: 1 hora)
   */
  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    if (!this.isEnabled()) {
      throw new Error('S3 no está configurado');
    }

    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const url = await getSignedUrl(this.s3Client, command, { expiresIn });
      return url;
    } catch (error) {
      this.logger.error(`❌ Error generando URL firmada: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Elimina un archivo de S3
   */
  async deleteFile(key: string): Promise<void> {
    if (!this.isEnabled()) {
      throw new Error('S3 no está configurado');
    }

    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
      this.logger.log(`🗑️  Archivo eliminado de S3: ${key}`);
    } catch (error) {
      this.logger.error(`❌ Error eliminando archivo de S3: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Genera la key (ruta) para un comprobante en S3
   */
  generateComprobanteKey(
    empresaId: number,
    tipoDoc: string,
    serie: string,
    correlativo: number,
    extension: 'pdf' | 'xml' | 'zip',
  ): string {
    const tipo = tipoDoc === '01' ? 'factura' : tipoDoc === '03' ? 'boleta' : 'nota';
    const numero = String(correlativo).padStart(8, '0');
    return `comprobantes/empresa-${empresaId}/${tipo}/${serie}-${numero}.${extension}`;
  }
}
