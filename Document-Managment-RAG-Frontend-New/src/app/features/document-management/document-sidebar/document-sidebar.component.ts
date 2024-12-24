import { CommonModule } from '@angular/common';
import { Component, effect, Input } from '@angular/core';
import { DocumentService } from '../../../core/services/document.service';
import { SocketService } from '../../../core/services/socket.service';
import { Document } from '../../../interfaces/document.interface';

@Component({
  selector: 'app-document-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './document-sidebar.component.html',
  styleUrls: ['./document-sidebar.component.css'] 
})
export class DocumentSidebarComponent {
  documents: Document[] = [];
  selectedDocument: Document | null = null;

  constructor(private documentService: DocumentService, private socketService: SocketService) { 
    effect(() => {
      const docs = this.documentService.documents();
      this.documents  = docs.reverse();
    });
  }

  ngOnInit() {
    if(!this.documentService.documents()?.length)
      this.documentService.getDocuments();
  }
  
  selectDocument(document: Document) {
    this.selectedDocument = document;
    console.log('Selected document:', document);
    if(document.contentUrl){
      this.socketService.initializeDocuments(document.contentUrl);
    }
  }
}
