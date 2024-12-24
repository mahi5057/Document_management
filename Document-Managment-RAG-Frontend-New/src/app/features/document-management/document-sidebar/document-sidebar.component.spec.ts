import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { DocumentSidebarComponent } from './document-sidebar.component';
import { DocumentService } from '../../../core/services/document.service';
import { SocketService } from '../../../core/services/socket.service';
import { Document } from '../../../interfaces/document.interface';

describe('DocumentSidebarComponent', () => {
    let component: DocumentSidebarComponent;
    let fixture: ComponentFixture<DocumentSidebarComponent>;
    let mockDocumentService: jasmine.SpyObj<DocumentService>;
    let mockSocketService: jasmine.SpyObj<SocketService>;

    beforeEach(async () => {
        mockDocumentService = jasmine.createSpyObj('DocumentService', ['documents', 'getDocuments']);
        mockSocketService = jasmine.createSpyObj('SocketService', ['initializeDocuments']);

        await TestBed.configureTestingModule({
            imports: [DocumentSidebarComponent, CommonModule],
            providers: [
                { provide: DocumentService, useValue: mockDocumentService },
                { provide: SocketService, useValue: mockSocketService }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(DocumentSidebarComponent);
        component = fixture.componentInstance;

        const mockDocuments: Document[] = [
            { id: "1", contentUrl: 'url1' },
            { id: "2", contentUrl: 'url2' },
        ];
        mockDocumentService.documents.and.returnValue(mockDocuments);
        mockDocumentService.getDocuments.and.callFake(() => { });
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call getDocuments if no documents are available on init', () => {
        mockDocumentService.documents.and.returnValue([]);
        component.ngOnInit();
        expect(mockDocumentService.getDocuments).toHaveBeenCalled();
    });

    it('should not call getDocuments if documents are already available on init', () => {
        mockDocumentService.documents.and.returnValue([{ id: "1", contentUrl: 'url1' }]);
        component.ngOnInit();
        expect(mockDocumentService.getDocuments).not.toHaveBeenCalled();
    });

    it('should select a document and call socket service to initialize documents', () => {
        const mockDocument: Document = { id: "1", contentUrl: 'url1' };
        component.selectDocument(mockDocument);
        expect(component.selectedDocument).toEqual(mockDocument);
        expect(mockSocketService.initializeDocuments).toHaveBeenCalledWith('url1');
    });

    it('should log the selected document in the console', () => {
        spyOn(console, 'log');
        const mockDocument: Document = { id: "1", contentUrl: 'url1' };
        component.selectDocument(mockDocument);
        expect(console.log).toHaveBeenCalledWith('Selected document:', mockDocument);
    });

    it('should not call initializeDocuments if contentUrl is undefined', () => {
        const mockDocument: Document = { id: "1", contentUrl: undefined };
        component.selectDocument(mockDocument);
        expect(mockSocketService.initializeDocuments).not.toHaveBeenCalled();
    });
});
