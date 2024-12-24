import { Injectable } from '@nestjs/common';
import { cloudinaryConfig } from '../../configurations/cloudinary.config';
import { promises as fs } from 'fs';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import { extname } from 'path';

@Injectable()
export class CloudinaryService {
    constructor() {
        cloudinary.config(cloudinaryConfig());
    }

    async uploadFile(filePath: string, folder: string = ''): Promise<UploadApiResponse | UploadApiErrorResponse> {
        try {
            const fileBuffer = await fs.readFile(filePath);
            const fileType = extname(filePath).slice(1); // Extract file extension without the dot
            return new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    { folder, resource_type: 'raw',
                    context: `file_type=${fileType}`},
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result);
                    }
                ).end(fileBuffer);
            });
        } catch (error) {
            console.error('Error reading file from local storage:', error);
            throw error;
        }
    }
}
