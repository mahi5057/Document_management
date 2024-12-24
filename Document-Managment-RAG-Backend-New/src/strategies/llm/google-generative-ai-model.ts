import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { ragConfig } from '../../configurations/rag.config';


export interface ModelStrategy {
    createModel(): any;
}

export class GoogleGenerativeAIModel implements ModelStrategy {
    private readonly apiKey: string;
    private readonly modelName: string;

    constructor() {
        this.apiKey = ragConfig()['googleApiKey'];
        this.modelName = ragConfig()['googleModelName'];
    }

    createModel() {
        return new ChatGoogleGenerativeAI({
            apiKey: this.apiKey,
            modelName: this.modelName,
        });
    }
}
