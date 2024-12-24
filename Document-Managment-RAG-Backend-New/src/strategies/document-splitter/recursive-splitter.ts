import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { ragConfig } from '../../configurations/rag.config';

export interface DocumentSplitterStrategy {
    splitDocuments(docs: any): Promise<any>;
}

export class RecursiveSplitter implements DocumentSplitterStrategy {
    private readonly chunkSize: number;
    private readonly chunkOverlap: number;

    constructor() {
        this.chunkSize = ragConfig()['chunkSize'];
        this.chunkOverlap = ragConfig()['chunkOverlap'];
    }

    async splitDocuments(docs: any) {
        const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: this.chunkSize,
            chunkOverlap: this.chunkOverlap,
        });
        return await textSplitter.splitDocuments(docs);
    }
}