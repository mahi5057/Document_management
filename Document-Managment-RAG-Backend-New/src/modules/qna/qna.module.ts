import { Module } from '@nestjs/common';
import { QnaService } from 'src/services/qna/qna.service';
import { PDFDocumentLoader } from 'src/strategies/document-loader/pdf-document-loader';
import { RecursiveSplitter } from 'src/strategies/document-splitter/recursive-splitter';
import { HuggingFaceRetriever } from 'src/strategies/retriever/huggingface-retriever';
import { DefaultPromptTemplate } from 'src/strategies/prompt-template/default-prompt-template';
import { GoogleGenerativeAIModel } from 'src/strategies/llm/google-generative-ai-model';
import { QnaGateway } from 'src/gateways/qna.gateway';
import { CustomDocumentLoaderStrategy } from 'src/strategies/document-loader/custom-document-loader';

@Module({
  controllers: [],
  providers: [
    {
      provide: 'DocumentLoaderStrategy',
      useClass: CustomDocumentLoaderStrategy,
    },
    {
      provide: 'DocumentSplitterStrategy',
      useClass: RecursiveSplitter,
    },
    {
      provide: 'RetrieverStrategy',
      useClass: HuggingFaceRetriever,
    },
    {
      provide: 'PromptTemplateStrategy',
      useClass: DefaultPromptTemplate,
    },
    {
      provide: 'ModelStrategy',
      useClass: GoogleGenerativeAIModel,
    },
    QnaService,
    QnaGateway
  ],
})
export class QnaModule { }
