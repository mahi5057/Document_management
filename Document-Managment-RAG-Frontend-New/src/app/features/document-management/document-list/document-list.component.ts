import { Component, effect, Input, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DocumentService } from '../../../core/services/document.service';
import { DOC_CONFIGS } from '../../../metadata/entity-config';
import { NoDataComponent } from '../../../shared/components/no-data/no-data.component';
import { CustomTableComponent } from '../../../shared/components/custom-table/custom-table.component';

@Component({
  selector: 'app-document-list',
  imports: [
    CustomTableComponent,
    NoDataComponent
  ],
  standalone: true,
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css'],
  providers: [DocumentService, MessageService, ConfirmationService],
})
export class DocumentListComponent implements OnInit {
  @Input() config: any = DOC_CONFIGS;
  entityType!: string;
  data: any[] = [];

  constructor(private documentService: DocumentService) {
    effect(() => {
      const docs = this.documentService.documents();
      this.data = docs;
    });
  }

  ngOnInit() {
    if (!this.documentService.documents()?.length)
      this.documentService.getDocuments();
    this.entityType = this.config.type;
  }

  updateItem(item: any) {
    this.documentService.updateItem(item)
  }

  deleteItem(item: any) {
    this.documentService.deleteItem(item.id)
  }

  deleteMultipleItems(selectedItems: any) {
    const itemIds = selectedItems.map((item: any) => item.id);
    this.documentService.deleteMultipleItems(itemIds);
  }
}
