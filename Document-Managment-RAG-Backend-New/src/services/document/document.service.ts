import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectId } from 'mongodb';
import { CreateDocumentDto } from 'src/dto/create-document.dto';
import { UpdateDocumentDto } from 'src/dto/update-document.dto';
import { Document } from 'src/entities/document.entity';
import { MongoRepository } from 'typeorm';

@Injectable()
export class DocumentService {
    constructor(
        @InjectRepository(Document)
        private documentRepository: MongoRepository<Document>,
    ) { }

    async create(createDocumentDto: CreateDocumentDto): Promise<Document> {
        const document = this.documentRepository.create({
            ...createDocumentDto,
            createdAt: new Date()
        });
        return this.documentRepository.save(document);
    }

    async findAll(userId: ObjectId): Promise<Document[]> {
        return this.documentRepository.find({ where: { userId } });
    }

    // findOne(id: string): Promise<Document> {
    //     return this.documentsRepository.findOneBy({ id: new ObjectId(id) });
    // }

    async update(_id: string, updateData: Partial<UpdateDocumentDto>): Promise<boolean> {
        const result = await this.documentRepository.update(new ObjectId(_id), updateData);
        console.log(result);
        return true;
    }

    async remove(id: string, userId: ObjectId): Promise<void> {
        const objectId = new ObjectId(id);
        await this.documentRepository.delete({ id: objectId, userId });
    }

    async removeMultiple(ids: string[], userId: ObjectId): Promise<void> {
        const objectIds = ids.map(id => new ObjectId(id));
        await this.documentRepository.deleteMany({ _id: { $in: objectIds }, userId });
    }
}
