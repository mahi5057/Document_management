import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { DocQnaInterfaceComponent } from './doc-qna-interface.component';
import { DocumentViewerComponent } from '../document-management/document-viewer/document-viewer.component';
import { QnaInterfaceComponent } from '../qna-interface/qna-interface.component';
import { DocumentSidebarComponent } from '../document-management/document-sidebar/document-sidebar.component';

describe('DocQnaInterfaceComponent', () => {
    let component: DocQnaInterfaceComponent;
    let fixture: ComponentFixture<DocQnaInterfaceComponent>;
    let activatedRouteStub: Partial<ActivatedRoute>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DocQnaInterfaceComponent, DocumentViewerComponent, QnaInterfaceComponent, DocumentSidebarComponent],
            providers: [
                { provide: ActivatedRoute, useValue: activatedRouteStub }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(DocQnaInterfaceComponent);
        component = fixture.componentInstance;
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });
});
