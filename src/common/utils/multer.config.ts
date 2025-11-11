import { BadRequestException } from '@nestjs/common';
import multer from 'multer';

const storage = multer.memoryStorage();

const fileFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(
      new BadRequestException('Solo se permiten archivos Excel (.xls, .xlsx)'),
    );
  }
  cb(null, true);
};

export const excelUploadOptions = {
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
} as const;

export const uploadExcel: any = multer(excelUploadOptions).single('excel');
