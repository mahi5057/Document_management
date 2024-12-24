import { Component, ViewChild, ElementRef, AfterViewChecked, OnInit, Renderer2, Input } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { SocketService } from '../../core/services/socket.service';

@Component({
  selector: 'app-qna-interface',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './qna-interface.component.html',
  styleUrl: './qna-interface.component.css'
})
export class QnaInterfaceComponent implements AfterViewChecked, OnInit {
  @ViewChild('chatBody') chatBody: ElementRef | undefined;
  @Input() fileUrl!: string;

  messages = [
    { text: 'Hello!', sent: true },
    { text: 'Hi there!', sent: false }
  ];
  newMessage = '';
  answer!: string;
  error: string | null = null;
  ingestionStatus: string | null = null;
  isLoading = false;

  constructor(private renderer: Renderer2, private socketService: SocketService) { }

  ngAfterViewChecked() {
    if (this.chatBody) {
      this.renderer.setProperty(
        this.chatBody.nativeElement,
        'scrollTop',
        this.chatBody.nativeElement.scrollHeight
      );
    }
  }

  ngOnInit() {
    this.connectServer()
    this.socketService.getAnswer().subscribe((data: any) => {
      if (data) {
        this.answer = data?.msg?.answer;
        this.isLoading = false;
        if (this.answer)
          this.messages.push({ text: this.answer, sent: false });
      }
    });

    this.socketService.getError().subscribe((err: any) => {
      if (err) this.error = err.error;
    });

    this.socketService.getIngestionStatus().subscribe((status: any) => {
      this.ingestionStatus = status.message;
      if(status.status == 'completed') {
        this.isLoading = false
      }
    });

    this.initializeDocuments();
    this.isLoading = true
  }
  private connectServer(): void {
    const data: any = {}
    this.socketService.handleConnectionEvents(data);
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      this.messages.push({ text: this.newMessage, sent: true });
      this.socketService.askQuestion(this.newMessage);
      this.newMessage = '';
      this.isLoading = true;
    }
  }

  private initializeDocuments() {
    this.socketService.initializeDocuments(this.fileUrl);
  }
}
