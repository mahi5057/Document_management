import { HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { HttpService } from './http.service';
import { Document } from '../../interfaces/document.interface';
import { DocumentModel } from '../../models/doc.model';
import { MessageService } from 'primeng/api';
import { ApiEndpointsService } from './api-endpoints.service';

@Injectable({
    providedIn: 'root'
})
export class DocumentService {
    public documents = signal<DocumentModel[]>([]);

    constructor(
        private httpService: HttpService,
        private messageService: MessageService,
        private apiEndpoints: ApiEndpointsService
    ) { }

    private handleError(message: string, error: any) {
        console.error(error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: message, life: 3000 });
        return of(null);  
    }

    uploadFile(url: string, file: File): Observable<any> {
        const formData: FormData = new FormData();
        formData.append('file', file, file.name);
        return this.httpService.post(url, formData).pipe(
            catchError(err => this.handleError('Failed to upload file', err))
        );
    }
    createDocument(url: string, documentData: any): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this.httpService.post(url, documentData, headers).pipe(
            catchError(err => this.handleError('Failed to create document', err))
        );
    }

    getDocuments(): void {
        const url = this.apiEndpoints.getEndpoint(this.apiEndpoints.document.base);
        this.httpService.get<DocumentModel[]>(url).pipe(
            catchError(err => {
                console.error(err);
                return of([]);
            })
        ).subscribe({
            next: (res) => {
                const documents = res.map((doc: any) => new DocumentModel(
                    doc.id, doc.fileName, doc.contentUrl, doc.fileType, doc.author, doc.createdAt, doc.userId
                ));
                this.documents.set(documents); 
            },
            error: (err) => {
                this.handleError('Failed to fetch documents', err);
            }
        });
    }
    updateItem(item: DocumentModel): Observable<any> {
        const url = `${this.apiEndpoints.getEndpoint(this.apiEndpoints.document.base)}/${item.id}`;
        console.log("url", url);
        
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this.httpService.put(url, item, headers).pipe(
            catchError(err => this.handleError('Failed to update document', err))
        );
    }
    deleteItem(itemId: string): void {
        const url = `${this.apiEndpoints.getEndpoint(this.apiEndpoints.document.base)}/${itemId}`;
        this.httpService.delete<DocumentModel[]>(url).pipe(
            catchError(err => {
                this.handleError('Failed to delete document', err);
                return of([]); 
            })
        ).subscribe({
            next: () => {
                this.documents.set(this.documents().filter(doc => doc.id !== itemId));
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Document Deleted', life: 3000 });
            }
        });
    }

    deleteMultipleItems(itemIds: string[]): void {
        const url = `${this.apiEndpoints.getEndpoint(this.apiEndpoints.document.delete)}`;
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        this.httpService.post(url, itemIds, headers).pipe(
            catchError(err => {
                this.handleError('Failed to delete documents', err);
                return of([]);  
            })
        ).subscribe({
            next: () => {
                this.documents.set(this.documents().filter((doc: any) => !itemIds.includes(doc.id)));
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Documents Deleted', life: 3000 });
            }
        });
    }
}
