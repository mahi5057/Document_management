import { ChatPromptTemplate } from '@langchain/core/prompts';
import { ragConfig } from '../../configurations/rag.config';

export interface PromptTemplateStrategy {
    createPromptTemplate(): any;
}

export class DefaultPromptTemplate implements PromptTemplateStrategy {
    private readonly systemTemplate: string;

  constructor() {
    this.systemTemplate = ragConfig()['systemTemplate'];
  }

  createPromptTemplate() {
    return ChatPromptTemplate.fromMessages([
      ['system', this.systemTemplate],
      ['human', '{input}'],
    ]);
  }
}
