import { NotificationResponseDto } from '../dto/notification-response.dto';
import { Notification } from '../entities/notification.entity';

export class NotificationMapper {
  static toResponse(entity: Notification): NotificationResponseDto {
    return {
      id: entity.id,
      student_id: entity.student?.id ?? null,
      type: entity.type,
      typeId: entity.typeId,
      content: entity.content,
      created_at: entity.created_at,
    };
  }
}
