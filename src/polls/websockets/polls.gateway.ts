import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { VoteCacheService } from 'src/cache/vote-cache.service';
import { SubscribePollDto } from '../dto/subscribe-poll.dto';
import { Public } from 'src/lib/decorators/public.decorator';

@Public()
@WebSocketGateway({
  cors: {
    origin: '*',  // Allow all origins (be cautious with this in production)
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  },})
export class PollsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly voteCacheService: VoteCacheService) {}
  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('subscribeToPoll')
  async handleSubscribeToPoll(
    @MessageBody() subscribePollDto: SubscribePollDto,
    @ConnectedSocket() client: Socket,
  ) {
    // unexistent poll should throw an error
    console.log(`Client ${client.id} subscribed to poll ${subscribePollDto.pollId}`);
    client.join(`poll-${subscribePollDto.pollId}`);

    // Send the initial poll state from cache
    const pollData = await this.voteCacheService.getPollData(subscribePollDto.pollId);
    client.emit('pollUpdated', pollData);
  }

  // Emit updated poll data to all subscribers
  async broadcastPollUpdate(pollId: string) {
    const pollData = await this.voteCacheService.getPollData(pollId);
    this.server.to(`poll-${pollId}`).emit('pollUpdated', pollData);
  }
}
  