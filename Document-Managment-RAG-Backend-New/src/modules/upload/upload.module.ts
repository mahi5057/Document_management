import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadController } from 'src/controllers/upload/upload.controller';
import { CloudinaryService } from 'src/services/cloudinary/cloudinary.service';
import { DocumentService } from 'src/services/document/document.service';
import { UploadService } from 'src/services/upload/upload.service';
import { Document } from 'src/entities/document.entity';
import { UserService } from 'src/services/user/user.service';
import { User } from 'src/entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Document, User])],
    controllers: [UploadController],
    providers: [UploadService, CloudinaryService, DocumentService, UserService]
})
export class UploadModule { }
