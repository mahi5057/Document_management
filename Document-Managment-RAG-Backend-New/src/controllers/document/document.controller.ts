import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ObjectId } from 'mongodb';
import { CreateDocumentDto } from 'src/dto/create-document.dto';
import { UpdateDocumentDto } from 'src/dto/update-document.dto';
import { DocumentService } from 'src/services/document/document.service';

@Controller('document')
@UseGuards(AuthGuard('jwt'))
export class DocumentController {
    constructor(private readonly documentsService: DocumentService) { }

    @Post()
    create(@Body() createDocumentDto: CreateDocumentDto, @Request() req) {
        const userId = req.user.userId;
        if (!userId) {
            throw new BadRequestException('User ID is required');
        }
        createDocumentDto.userId = userId;
        return this.documentsService.create(createDocumentDto);
    }

    @Get()
    findAll(@Request() req) {
        const userId = req.user.userId;
        if (!userId) {
            throw new BadRequestException('User ID is required');
        }
        return this.documentsService.findAll(userId);
    }

    // @Get(':id')
    // findOne(@Param('id') id: string) {
    //     return this.documentsService.findOne(id);
    // }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateDocumentDto: UpdateDocumentDto) {
        const updateResult = await this.documentsService.update(id, { fileName: updateDocumentDto.fileName, author: updateDocumentDto.author });

        if (!updateResult) {
            throw new NotFoundException('Document not found');
        }

        return { message: 'Document updated successfully' };
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Request() req) {
        const userId = req.user.userId;
        if (!userId) {
            throw new BadRequestException('User ID is required');
        }

        // Validate the document ID
        if (!id || !ObjectId.isValid(id)) {
            throw new BadRequestException('Invalid document ID');
        }

        return this.documentsService.remove(id, userId);
    }

    @Post('delete')
    async removeMultiple(@Body() ids: string[], @Request() req) {
        const userId = req.user.userId;
        if (!userId) {
            throw new BadRequestException('User ID is required');
        }

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            throw new BadRequestException('Document IDs are required');
        }

        // Validate each document ID
        for (const id of ids) {
            if (!ObjectId.isValid(id)) {
                throw new BadRequestException(`Invalid document ID: ${id}`);
            }
        }

        return this.documentsService.removeMultiple(ids, userId);
    }
}
