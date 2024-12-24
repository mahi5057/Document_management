import { Component, Input, OnInit } from '@angular/core';
import { NgxDocViewerModule } from 'ngx-doc-viewer';

@Component({
  selector: 'app-document-viewer',
  standalone: true,
  imports: [NgxDocViewerModule],
  templateUrl: './document-viewer.component.html',
  styleUrl: './document-viewer.component.css'
})
export class DocumentViewerComponent implements OnInit{
  @Input() fileUrl!: string;
  doc!: string;

  ngOnInit(){
    this.doc = this.fileUrl;
  }
}
