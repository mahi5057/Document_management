import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentController } from 'src/controllers/document/document.controller';
import { Document } from 'src/entities/document.entity';
import { DocumentService } from 'src/services/document/document.service';

@Module({
    imports: [TypeOrmModule.forFeature([Document])],
    providers: [DocumentService],
    controllers: [DocumentController],
})
export class DocumentModule { }
