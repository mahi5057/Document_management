import { Inject, Injectable } from '@nestjs/common';
import { createRetrievalChain } from 'langchain/chains/retrieval';
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents';
import { DocumentLoaderStrategy } from '../../strategies/document-loader/pdf-document-loader';
import { DocumentSplitterStrategy } from '../../strategies/document-splitter/recursive-splitter';
import { RetrieverStrategy } from '../../strategies/retriever/huggingface-retriever';
import { PromptTemplateStrategy } from '../../strategies/prompt-template/default-prompt-template';
import { ModelStrategy } from 'src/strategies/llm/google-generative-ai-model';
import { Server } from 'socket.io';

@Injectable()
export class QnaService {
    private documents: any[] | null = null;
    private retriever: any | null = null;
    private server: Server | null = null;

    constructor(
        @Inject('DocumentLoaderStrategy') private readonly documentLoader: DocumentLoaderStrategy,
        @Inject('DocumentSplitterStrategy') private readonly documentSplitter: DocumentSplitterStrategy,
        @Inject('RetrieverStrategy') private readonly retrieverStrategy: RetrieverStrategy,
        @Inject('PromptTemplateStrategy') private readonly promptTemplateStrategy: PromptTemplateStrategy,
        @Inject('ModelStrategy') private readonly modelStrategy: ModelStrategy
    ) { }

    setServer(server: Server) {
        this.server = server;
    }

    async initializeDocuments(fileUrl: string) {
        this.emitStatus('Loading documents...');
        const docs = await this.documentLoader.loadDocuments(fileUrl);
        this.emitStatus('Splitting documents...');
        this.documents = await this.documentSplitter.splitDocuments(docs);
        this.emitStatus('Creating retriever...');
        this.retriever = await this.retrieverStrategy.createRetriever(this.documents);
        this.emitStatus('Documents initialized.');
    }

    private emitStatus(message: string) {
        if (this.server) {
            this.server.emit('ingestionStatus', { message });
        }
    }

    async askQuestion(question: string) {
        const prompt = this.promptTemplateStrategy.createPromptTemplate();
        const model = this.modelStrategy.createModel();

        const questionAnswerChain = await createStuffDocumentsChain({
            llm: model,
            prompt,
        });

        const ragChain = await createRetrievalChain({
            retriever: this.retriever,
            combineDocsChain: questionAnswerChain,
        });

        const results = await ragChain.invoke({
            input: question,
        });

        return results;
    }
}
