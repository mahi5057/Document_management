import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { HuggingFaceInferenceEmbeddings } from '@langchain/community/embeddings/hf';
import { ragConfig } from '../../configurations/rag.config';

export interface RetrieverStrategy {
    createRetriever(splits: any): Promise<any>;
}

export class HuggingFaceRetriever implements RetrieverStrategy {
    private readonly apiKey: string;

    constructor() {
        this.apiKey = ragConfig()['huggingFaceApiKey'];
    }

    async createRetriever(splits: any) {
        const embeddings = new HuggingFaceInferenceEmbeddings({
            apiKey: this.apiKey,
        });

        const vectorstore = await MemoryVectorStore.fromDocuments(splits, embeddings);
        return vectorstore.asRetriever();
    }
}
