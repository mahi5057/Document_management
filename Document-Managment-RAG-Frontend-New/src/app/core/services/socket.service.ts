import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Socket, SocketIoConfig } from 'ngx-socket-io';
import { WrappedSocket } from 'ngx-socket-io/src/socket-io.service';
import { Observable, of } from 'rxjs';
import { ApiEndpointsService } from './api-endpoints.service';

@Injectable({
    providedIn: 'root'
})
export class SocketService {
    private socket!: WrappedSocket;

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private apiEndpoints: ApiEndpointsService
    ) {
        const url = this.apiEndpoints.getSocketEndpoint('/');
        if (isPlatformBrowser(this.platformId)) {
            const config: SocketIoConfig = { url: url, options: { autoConnect: false } };
            this.socket = new Socket(config);
        }
    }

    private ensureSocketConnection(): void {
        if (this.socket.ioSocket.connected) return;
        this.socket.connect();
    }

    public handleConnectionEvents(data: any) {
        if (!this.socket) {
            return;
        }

        this.socket.ioSocket.io.opts.query = data;
        this.ensureSocketConnection();

        this.socket.on('connect', () => {
            console.log('Connected to Socket.IO server');
        });

        this.socket.on('authenticationSuccess', (data: any) => {
            console.log('Authentication successful:', data.message);
        });

        this.socket.on('error', (err: any) => {
            console.error('Error during Socket.IO connection:', err);
        });

        this.socket.on('disconnect', () => {
            console.log('Disconnected from Socket.IO server');
        });
    }

    askQuestion(question: string): void {
        this.ensureSocketConnection();
        this.socket.emit('askQuestion', question);
    }

    getAnswer(): Observable<any> {
        if (!this.socket) return of(null);
        return this.socket.fromEvent('answer');
    }

    getError(): Observable<any> {
        if (!this.socket) return of(null);
        return this.socket.fromEvent('error');
    }

    initializeDocuments(fileUrl: string): void {
        this.ensureSocketConnection();
        this.socket.emit('initializeDocuments', { fileUrl });
    }

    getIngestionStatus(): Observable<any> {
        if (!this.socket) return of(null);
        return this.socket.fromEvent('ingestionStatus');
    }

    ngOnDestroy() {
        if (this.socket) {
            this.socket.removeAllListeners();
            this.socket.disconnect();
        }
    }
}
