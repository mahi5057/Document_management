import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { DocumentLoaderStrategy } from './pdf-document-loader'; // Use the appropriate strategy path
import { Document } from 'src/entities/document.entity';
import * as pdfParse from 'pdf-parse';
import * as docxParser from 'docx-parser';

export class CustomDocumentLoaderStrategy implements DocumentLoaderStrategy {
    private cloudinaryUrl: string;

    constructor(cloudinaryUrl: string) {
        this.cloudinaryUrl = cloudinaryUrl;
    }

    async loadDocuments(url: string): Promise<any[]> {
        try {
            const rawData: Buffer = await this.fetchRawData(url);
            const fileType: string = 'pdf';

            let parsedDocument;
            switch (fileType) {
                case 'pdf':
                    parsedDocument = await this.parsePdf(rawData);
                    break;
                case 'docx':
                    parsedDocument = await this.parseDocx(rawData);
                    break;
                default:
                    throw new Error('Unsupported document type');
            }

            return parsedDocument;
        } catch (error) {
            throw new Error('Error loading data from Cloudinary: ' + error.message);
        }
    }

    // Fetch the raw data from url
    private async fetchRawData(url: string): Promise<Buffer> {
        try {
            const response = await axios.get(url, { responseType: 'arraybuffer' });
            return response.data;
        } catch (error) {
            throw new Error('Error fetching data from Cloudinary: ' + error.message);
        }
    }

    // Parse pdf document
    private async parsePdf(rawData: Buffer): Promise<any[]> {
        const parsedPdf = await pdfParse(rawData);
        const doc = {
            pageContent: parsedPdf.text,
            metadata: { info: parsedPdf.info },
        };
        return [doc];
    }

    // Parse DOCX document
    private async parseDocx(rawData: Buffer): Promise<any[]> {
        return new Promise<any[]>((resolve, reject) => {
            docxParser.parseBuffer(rawData, (err: any, result: any) => {
                if (err) {
                    reject('Error parsing DOCX: ' + err);
                } else {
                    const doc = {
                        pageContent: result.text,
                        metadata: { info: result.metadata },
                    };
                    resolve([doc]);
                }
            });
        });
    }
}
