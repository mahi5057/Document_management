import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { promises as fs } from 'fs';
import { join, resolve } from 'path';

@Injectable()
export class UploadService {
    constructor(private readonly cloudinaryService: CloudinaryService) { }

    async uploadFileToCloudinary(file: Express.Multer.File, folder: string = ''): Promise<UploadApiResponse | UploadApiErrorResponse> {
        const uploadsDir = resolve(__dirname, process.env.STORAGE_PATH || '../../../uploads');
        const filePath = join(uploadsDir, file.filename);

        try {
            const result = await this.cloudinaryService.uploadFile(filePath);
            await fs.unlink(filePath); // Delete the file from local storage
            return result;
        } catch (error) {
            console.error('Error uploading to Cloudinary:', error);
            await fs.unlink(filePath); // Delete the file from local storage
            throw error;
        }
    }
}

