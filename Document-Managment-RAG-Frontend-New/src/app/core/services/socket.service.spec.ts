import { TestBed } from '@angular/core/testing';
import { SocketService } from './socket.service';
import { ApiEndpointsService } from './api-endpoints.service';
import { WrappedSocket } from 'ngx-socket-io/src/socket-io.service';
import { of } from 'rxjs';
import { PLATFORM_ID } from '@angular/core';

describe('SocketService', () => {
    let service: SocketService;
    let apiEndpointsServiceSpy: jasmine.SpyObj<ApiEndpointsService>;
    let socketSpy: jasmine.SpyObj<WrappedSocket>;
    let mockSocketUrl: string;

    beforeEach(() => {
        mockSocketUrl = 'https://mock-socket-url.com';

        apiEndpointsServiceSpy = jasmine.createSpyObj('ApiEndpointsService', ['getSocketEndpoint']);
        apiEndpointsServiceSpy.getSocketEndpoint.and.returnValue(mockSocketUrl);

        socketSpy = jasmine.createSpyObj('WrappedSocket', ['connect', 'disconnect', 'on', 'emit', 'fromEvent', 'removeAllListeners']);

        TestBed.configureTestingModule({
            providers: [
                SocketService,
                { provide: ApiEndpointsService, useValue: apiEndpointsServiceSpy },
                { provide: WrappedSocket, useValue: socketSpy },
                { provide: PLATFORM_ID, useValue: 'browser' }
            ]
        });

        service = TestBed.inject(SocketService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('handleConnectionEvents', () => {
        it('should establish connection and listen to events', () => {
            const mockData = { userId: '123' };

            service.handleConnectionEvents(mockData);

            expect(socketSpy.connect).toHaveBeenCalled();
            expect(socketSpy.on).toHaveBeenCalledWith('connect', jasmine.any(Function));
            expect(socketSpy.on).toHaveBeenCalledWith('authenticationSuccess', jasmine.any(Function));
            expect(socketSpy.on).toHaveBeenCalledWith('error', jasmine.any(Function));
            expect(socketSpy.on).toHaveBeenCalledWith('disconnect', jasmine.any(Function));

            const connectCallback = socketSpy.on.calls.argsFor(0)[1];
            connectCallback();
            expect(console.log).toHaveBeenCalledWith('Connected to Socket.IO server');
        });

        it('should handle socket error event', () => {
            const mockError = new Error('Socket error');
            service.handleConnectionEvents({});
            const errorCallback = socketSpy.on.calls.argsFor(2)[1];
            errorCallback(mockError);
            expect(console.error).toHaveBeenCalledWith('Error during Socket.IO connection:', mockError);
        });
    });

    describe('askQuestion', () => {
        it('should emit the question to the socket server', () => {
            const question = 'What is the capital of France?';
            service.askQuestion(question);
            expect(socketSpy.emit).toHaveBeenCalledWith('askQuestion', question);
        });
    });

    describe('getAnswer', () => {
        it('should return an observable from socket "answer" event', () => {
            const mockAnswer = { answer: 'Paris' };
            socketSpy.fromEvent.and.returnValue(of(mockAnswer));

            service.getAnswer().subscribe(answer => {
                expect(answer).toEqual(mockAnswer);
            });

            expect(socketSpy.fromEvent).toHaveBeenCalledWith('answer');
        });

        it('should return null observable if socket is not initialized', () => {
            service = new SocketService('browser', apiEndpointsServiceSpy);
            service.getAnswer().subscribe(answer => {
                expect(answer).toBeNull();
            });
        });
    });

    describe('initializeDocuments', () => {
        it('should emit the "initializeDocuments" event with the fileUrl', () => {
            const fileUrl = 'https://mock-file-url.com';
            service.initializeDocuments(fileUrl);
            expect(socketSpy.emit).toHaveBeenCalledWith('initializeDocuments', { fileUrl });
        });
    });

    describe('getIngestionStatus', () => {
        it('should return an observable from socket "ingestionStatus" event', () => {
            const mockStatus = { status: 'completed' };
            socketSpy.fromEvent.and.returnValue(of(mockStatus));

            service.getIngestionStatus().subscribe(status => {
                expect(status).toEqual(mockStatus);
            });

            expect(socketSpy.fromEvent).toHaveBeenCalledWith('ingestionStatus');
        });

        it('should return null observable if socket is not initialized', () => {
            service = new SocketService('browser', apiEndpointsServiceSpy);
            service.getIngestionStatus().subscribe(status => {
                expect(status).toBeNull();
            });
        });
    });

    describe('ngOnDestroy', () => {
        it('should remove all listeners and disconnect the socket', () => {
            service.ngOnDestroy();
            expect(socketSpy.removeAllListeners).toHaveBeenCalled();
            expect(socketSpy.disconnect).toHaveBeenCalled();
        });
    });
});
