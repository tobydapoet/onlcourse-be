import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { CreateMessageDto } from 'src/message/dto/create-message.dto';
import { MessageService } from 'src/message/message.service';

export class SocketGateWay implements OnGatewayConnection {
  constructor(
    private readonly messageService: MessageService,
    private readonly jwtService: JwtService,
  ) {}

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    let token =
      client.handshake.headers.authorization || client.handshake.query['token'];
    if (Array.isArray(token)) token = token[0];
    if (!token) {
      client.disconnect();
      return;
    }
    token = token.replace('Bearer', '');
    try {
      const payload = this.jwtService.verify(token);
      client.data.user = payload;
    } catch (err) {
      client.disconnect();
      return;
    }
    const userId = client.handshake.query.userId;
    if (!userId) {
      client.disconnect(true);
      return;
    }
    client.join(userId);
  }

  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody() message: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const saved = await this.messageService.create(message);
      this.server.to(message.sender).emit(`sender_message`, saved);
      this.server.to(message.receiver).emit(`receiver_message`, saved);
    } catch (err) {
      client.emit('error_message: ', { error: err.message });
    }
  }
}
