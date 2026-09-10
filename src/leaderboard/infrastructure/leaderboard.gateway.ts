import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { domainEventBus, ScoreUpdatedEvent } from '../../games/domain/events/domain-events';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/ws',
})
export class LeaderboardGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(LeaderboardGateway.name);

  afterInit() {
    // Subscribe to ScoreUpdated and emit via WS
    domainEventBus.subscribe('ScoreUpdated', async (event) => {
      if (event instanceof ScoreUpdatedEvent) {
        this.server.emit('scoreUpdated', {
          studentId: event.studentId,
          gameId: event.gameId,
          delta: event.delta,
          newTotal: event.newTotal,
        });
      }
    });
    this.logger.log('WebSocket gateway initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
}
