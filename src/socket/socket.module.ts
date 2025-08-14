import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { MessageModule } from 'src/message/message.module';
import { SocketGateWay } from './socket.provider';

@Module({
  imports: [AuthModule, MessageModule],
  providers: [SocketGateWay],
})
export class SocketModule {}
