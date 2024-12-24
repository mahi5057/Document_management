import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { QnaService } from 'src/services/qna/qna.service';

@WebSocketGateway(Number(process.env.SOCKET_PORT) || 8080, { cors: true })
export class QnaGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;

    constructor(private readonly qnaService: QnaService) {
    }

    afterInit(server: Server) {
        this.qnaService.setServer(server);
        console.log('WebSocket server initialized');
    }

    handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('askQuestion')
    async handleAskQuestion(@MessageBody() data: any): Promise<void> {
        try {
            const msg = await this.qnaService.askQuestion(data);
            this.server.emit('answer', { msg });
        } catch (error) {
            this.server.emit('error', { error: error.message });
        }
    }

    @SubscribeMessage('initializeDocuments')
    async handleInitializeDocuments(@MessageBody() data: { fileUrl: string }): Promise<void> {
        try {
            await this.qnaService.initializeDocuments(data.fileUrl);
            this.server.emit('ingestionStatus', { message: 'Documents initialized successfully.', status: 'completed'});
        } catch (error) {
            this.server.emit('error', { error: error.message });
        }
    }
}
