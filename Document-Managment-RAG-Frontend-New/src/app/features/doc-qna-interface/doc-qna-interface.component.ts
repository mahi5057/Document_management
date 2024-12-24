import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DocumentService } from '../../core/services/document.service';
import { DocumentSidebarComponent } from '../document-management/document-sidebar/document-sidebar.component';
import { DocumentViewerComponent } from '../document-management/document-viewer/document-viewer.component';
import { QnaInterfaceComponent } from '../qna-interface/qna-interface.component';

@Component({
  selector: 'app-doc-qna-interface',
  standalone: true,
  imports: [DocumentViewerComponent, QnaInterfaceComponent, DocumentSidebarComponent],
  templateUrl: './doc-qna-interface.component.html',
  styleUrl: './doc-qna-interface.component.css',
  providers: [DocumentService, MessageService]
})
export class DocQnaInterfaceComponent implements OnInit  {
  fileUrl: string | null = null;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.fileUrl = 'http://127.0.0.1:5000/ask';
      console.log('File URL:', this.fileUrl);
    });
  }
}
