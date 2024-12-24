import { TestBed } from '@angular/core/testing';
import { HttpService } from './http.service';
import { DocumentService } from './document.service';
import { ApiEndpointsService } from './api-endpoints.service';
import { MessageService } from 'primeng/api';
import { of, throwError } from 'rxjs';
import { DocumentModel } from '../../models/doc.model';
import { HttpHeaders } from '@angular/common/http';

describe('DocumentService', () => {
    let service: DocumentService;
    let httpServiceSpy: jasmine.SpyObj<HttpService>;
    let apiEndpointsSpy: jasmine.SpyObj<ApiEndpointsService>;
    let messageServiceSpy: jasmine.SpyObj<MessageService>;

    const mockDocument = new DocumentModel(
        '1', 'Test File', 'http://example.com/file', 'pdf', 'Author', new Date(), 'user123'
    );
    const mockDocuments = [mockDocument];
    const mockError = 'Error occurred';
    const mockFile = new File(['test'], 'test.txt', { type: 'text/plain' });

    beforeEach(() => {
        const httpServiceMock = jasmine.createSpyObj('HttpService', ['post', 'get', 'put', 'delete']);
        const apiEndpointsMock = jasmine.createSpyObj('ApiEndpointsService', ['getEndpoint']);
        const messageServiceMock = jasmine.createSpyObj('MessageService', ['add']);

        TestBed.configureTestingModule({
            providers: [
                DocumentService,
                { provide: HttpService, useValue: httpServiceMock },
                { provide: ApiEndpointsService, useValue: apiEndpointsMock },
                { provide: MessageService, useValue: messageServiceMock }
            ]
        });

        service = TestBed.inject(DocumentService);
        httpServiceSpy = TestBed.inject(HttpService) as jasmine.SpyObj<HttpService>;
        apiEndpointsSpy = TestBed.inject(ApiEndpointsService) as jasmine.SpyObj<ApiEndpointsService>;
        messageServiceSpy = TestBed.inject(MessageService) as jasmine.SpyObj<MessageService>;

        apiEndpointsSpy.getEndpoint.and.returnValue('https://api.example.com');
    });

    describe('uploadFile', () => {
        it('should upload a file successfully', () => {
            httpServiceSpy.post.and.returnValue(of({}));

            service.uploadFile('https://api.example.com/upload', mockFile).subscribe(response => {
                expect(response).toBeTruthy();
            });

            expect(httpServiceSpy.post).toHaveBeenCalledWith('https://api.example.com/upload', jasmine.any(FormData));
        });

        it('should handle error during file upload', () => {
            httpServiceSpy.post.and.returnValue(throwError(() => new Error('Upload failed')));

            service.uploadFile('https://api.example.com/upload', mockFile).subscribe(response => {
                expect(response).toBeNull();
                expect(messageServiceSpy.add).toHaveBeenCalledWith({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to upload file',
                    life: 3000
                });
            });
        });
    });

    describe('createDocument', () => {
        it('should create a document successfully', () => {
            httpServiceSpy.post.and.returnValue(of({}));

            service.createDocument('https://api.example.com/documents', { name: 'New Document' }).subscribe(response => {
                expect(response).toBeTruthy();
            });

            expect(httpServiceSpy.post).toHaveBeenCalledWith(
                'https://api.example.com/documents', { name: 'New Document' }, jasmine.any(HttpHeaders)
            );
        });

        it('should handle error during document creation', () => {
            httpServiceSpy.post.and.returnValue(throwError(() => new Error('Create document failed')));

            service.createDocument('https://api.example.com/documents', { name: 'New Document' }).subscribe(response => {
                expect(response).toBeNull();
                expect(messageServiceSpy.add).toHaveBeenCalledWith({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to create document',
                    life: 3000
                });
            });
        });
    });

    describe('getDocuments', () => {
        it('should fetch documents successfully and update the signal state', () => {
            httpServiceSpy.get.and.returnValue(of(mockDocuments));

            service.getDocuments();

            expect(httpServiceSpy.get).toHaveBeenCalledWith('https://api.example.com');
            expect(service.documents().length).toBe(1);
        });

        it('should handle error during document fetch and return empty array', () => {
            httpServiceSpy.get.and.returnValue(throwError(() => new Error('Fetch failed')));

            service.getDocuments();

            expect(httpServiceSpy.get).toHaveBeenCalledWith('https://api.example.com');
            expect(service.documents().length).toBe(0);
            expect(messageServiceSpy.add).toHaveBeenCalledWith({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to fetch documents',
                life: 3000
            });
        });
    });

    describe('updateItem', () => {
        it('should update a document successfully', () => {
            httpServiceSpy.put.and.returnValue(of({}));

            service.updateItem(mockDocument).subscribe(response => {
                expect(response).toBeTruthy();
            });

            expect(httpServiceSpy.put).toHaveBeenCalledWith(
                'https://api.example.com/1', mockDocument, jasmine.any(HttpHeaders)
            );
        });

        it('should handle error during document update', () => {
            httpServiceSpy.put.and.returnValue(throwError(() => new Error('Update failed')));

            service.updateItem(mockDocument).subscribe(response => {
                expect(response).toBeNull();
                expect(messageServiceSpy.add).toHaveBeenCalledWith({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to update document',
                    life: 3000
                });
            });
        });
    });

    describe('deleteItem', () => {
        it('should delete a document successfully', () => {
            httpServiceSpy.delete.and.returnValue(of([mockDocument]));

            if(mockDocument.id)
            service.deleteItem(mockDocument.id);

            expect(httpServiceSpy.delete).toHaveBeenCalledWith('https://api.example.com/1');
            expect(service.documents().length).toBe(0);
            expect(messageServiceSpy.add).toHaveBeenCalledWith({
                severity: 'success',
                summary: 'Successful',
                detail: 'Document Deleted',
                life: 3000
            });
        });

        it('should handle error during document deletion', () => {
            httpServiceSpy.delete.and.returnValue(throwError(() => new Error('Delete failed')));
            
            if(mockDocument.id)
            service.deleteItem(mockDocument.id);

            expect(service.documents().length).toBe(1);
            expect(messageServiceSpy.add).toHaveBeenCalledWith({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to delete document',
                life: 3000
            });
        });
    });

    describe('deleteMultipleItems', () => {
        it('should delete multiple documents successfully', () => {
            const mockIds = ['1', '2'];
            httpServiceSpy.post.and.returnValue(of([mockDocument]));

            service.deleteMultipleItems(mockIds);

            expect(httpServiceSpy.post).toHaveBeenCalledWith('https://api.example.com', mockIds, jasmine.any(HttpHeaders));
            expect(service.documents().length).toBe(0);
            expect(messageServiceSpy.add).toHaveBeenCalledWith({
                severity: 'success',
                summary: 'Successful',
                detail: 'Documents Deleted',
                life: 3000
            });
        });

        it('should handle error during multiple document deletion', () => {
            const mockIds = ['1', '2'];
            httpServiceSpy.post.and.returnValue(throwError(() => new Error('Delete failed')));

            service.deleteMultipleItems(mockIds);

            expect(service.documents().length).toBe(1);
            expect(messageServiceSpy.add).toHaveBeenCalledWith({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to delete documents',
                life: 3000
            });
        });
    });
});
