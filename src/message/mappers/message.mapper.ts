import { MessageResponseDto } from '../dto/message-response.dto';
import { Message } from '../entities/message.entity';

export class MessageMapper {
  static toResponse(entity: Message): MessageResponseDto {
    return {
      id: entity.id,
      sender_id: entity.sender?.id ?? null,
      receiver_id: entity.receiver?.id ?? null,
      content: entity.content,
      images: entity.images ?? null,
      isReading: entity.isReading,
      created_at: entity.created_at,
    };
  }
}
