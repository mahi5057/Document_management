import { NotFoundException } from '@nestjs/common';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';

export interface DocumentLoaderStrategy {
    loadDocuments(path: string): Promise<any>;
}

export class PDFDocumentLoader implements DocumentLoaderStrategy {
    async loadDocuments(path: string) {
        const loader = new PDFLoader(path);
        const docs = await loader.load();
        if (!docs || docs.length === 0) {
            throw new NotFoundException('No documents found to process.');
        }
        return docs;
    }
}
