import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ElementRef, Renderer2 } from '@angular/core';
import { of, Subject } from 'rxjs';
import { QnaInterfaceComponent } from './qna-interface.component';
import { SocketService } from '../../core/services/socket.service';

class MockSocketService {
  private answerSubject = new Subject();
  private errorSubject = new Subject();
  private ingestionStatusSubject = new Subject();

  getAnswer() {
    return this.answerSubject.asObservable();
  }

  getError() {
    return this.errorSubject.asObservable();
  }

  getIngestionStatus() {
    return this.ingestionStatusSubject.asObservable();
  }

  askQuestion(question: string) { }

  initializeDocuments(fileUrl: string) { }

  handleConnectionEvents(data: any) { }
}

describe('QnaInterfaceComponent', () => {
  let component: QnaInterfaceComponent;
  let fixture: ComponentFixture<QnaInterfaceComponent>;
  let mockSocketService: MockSocketService;

  beforeEach(async () => {
    mockSocketService = new MockSocketService();

    await TestBed.configureTestingModule({
      imports: [QnaInterfaceComponent, FormsModule, CommonModule],
      providers: [
        Renderer2,
        { provide: SocketService, useValue: mockSocketService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QnaInterfaceComponent);
    component = fixture.componentInstance;
    component.fileUrl = 'test-file-url';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should scroll to the bottom after the view updates', () => {
    const mockElement = { nativeElement: { scrollTop: 0, scrollHeight: 100 } };
    component.chatBody = mockElement as ElementRef;
    const rendererSpy = spyOn(component['renderer'], 'setProperty');

    component.ngAfterViewChecked();

    expect(rendererSpy).toHaveBeenCalledWith(mockElement.nativeElement, 'scrollTop', 100);
  });

  it('should send a new message', () => {
    const askQuestionSpy = spyOn(mockSocketService, 'askQuestion').and.callThrough();
    component.newMessage = 'Test message';

    component.sendMessage();

    expect(component.messages[component.messages.length - 1].text).toBe('Test message');
    expect(askQuestionSpy).toHaveBeenCalledWith('Test message');
    expect(component.newMessage).toBe('');
    expect(component.isLoading).toBeTrue();
  });

  it('should update the answer and messages when data is received', () => {
    const answer = { msg: { answer: 'Test answer' } };
    mockSocketService.getAnswer().subscribe((data: any) => {
      component.answer = data.msg.answer;
    });
    (mockSocketService as any).answerSubject.next(answer);

    expect(component.answer).toBe('Test answer');
    expect(component.messages[component.messages.length - 1].text).toBe('Test answer');
  });

  it('should set error when an error is received', () => {
    const error = { error: 'Test error' };
    (mockSocketService as any).errorSubject.next(error);

    expect(component.error).toBe('Test error');
  });

  it('should update ingestionStatus when a status is received', () => {
    const status = { message: 'Ingestion completed', status: 'completed' };
    (mockSocketService as any).ingestionStatusSubject.next(status);

    expect(component.ingestionStatus).toBe('Ingestion completed');
    expect(component.isLoading).toBeFalse();
  });
});
