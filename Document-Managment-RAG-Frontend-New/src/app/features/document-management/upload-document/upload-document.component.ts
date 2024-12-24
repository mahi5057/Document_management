import { Component, OnInit } from '@angular/core';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { FileUploadModule, FileUploadEvent, FileUploadHandlerEvent } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { BadgeModule } from 'primeng/badge';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { DocumentService } from '../../../core/services/document.service';
import { RouterModule } from '@angular/router';
import { ApiEndpointsService } from '../../../core/services/api-endpoints.service';

@Component({
  selector: 'app-upload-document',
  standalone: true,
  imports: [RouterModule, FileUploadModule, ButtonModule, BadgeModule, ProgressBarModule, ToastModule, CommonModule],
  templateUrl: './upload-document.component.html',
  styleUrl: './upload-document.component.css',
  providers: [MessageService, DocumentService]
})
export class UploadDocumentComponent implements OnInit {
  uploadedFiles: any[] = [];
  totalSize: number = 0;
  totalSizePercent: number = 0;
  url!: string;
  constructor(
    private messageService: MessageService,
    private documentService: DocumentService,
    private apiEndpoints: ApiEndpointsService
  ) { }

  ngOnInit(): void {
    this.url = this.apiEndpoints.getEndpoint(this.apiEndpoints.upload.base);
  }

  onUpload(event: any) {
    this.documentService.documents.set([]);
    for (let file of event.files) {
      const documents = event.originalEvent.body?.documents;
      if (documents && documents.length > 0) {
        for (let document of documents) {
          const url = document.contentUrl; 

          if (url) {
            this.uploadedFiles.push({ file, url });
            this.messageService.add({ severity: 'success', summary: 'File Uploaded', detail: "file uploaded" });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Upload Failed', detail: 'Content URL not available for the document' });
          }
        }
      } else {
        this.messageService.add({ severity: 'error', summary: 'Upload Failed', detail: 'No documents returned in the response' });
      }
    }
  }

}
