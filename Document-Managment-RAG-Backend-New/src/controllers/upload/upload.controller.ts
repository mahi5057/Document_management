import { BadRequestException, Controller, InternalServerErrorException, Post, UploadedFiles, UseInterceptors, Request, UseGuards } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from 'src/services/upload/upload.service';
import { DocumentService } from 'src/services/document/document.service';
import { UserService } from 'src/services/user/user.service';
import { storageConfig } from '../../configurations/storage.config';
import { CreateDocumentDto } from 'src/dto/create-document.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('upload')
@UseGuards(AuthGuard('jwt'))
export class UploadController {
    constructor(
        private readonly uploadService: UploadService,
        private readonly documentService: DocumentService
    ) { }

    @Post()
    @UseInterceptors(FilesInterceptor('files', 10, { storage: storageConfig() })) 
    async uploadFiles(@UploadedFiles() files: Express.Multer.File[], @Request() req) {
        if (!files || files.length === 0) {
            throw new BadRequestException('No files provided');
        }
        try {
            const documents = [];
            for (const file of files) {
                const result = await this.uploadService.uploadFileToCloudinary(file);
                const fileUrl: string = result.secure_url;
                const fileType = result.context.custom.file_type;
                const fileName = file.filename;
                const createDocumentDto: CreateDocumentDto = {
                    fileType: fileType,
                    contentUrl: fileUrl,
                    fileName: fileName,
                    author: req.user.name,
                    userId: req.user.userId,
                    originalName: file.originalname
                };

                const document = await this.documentService.create(createDocumentDto);
                documents.push(document);
            }

            return {
                message: 'Files uploaded and documents created successfully',
                documents,
            };
        } catch (error) {
            console.error('Error uploading files or creating documents:', error);
            throw new InternalServerErrorException('Failed to upload files or create documents');
        }
    }
}
