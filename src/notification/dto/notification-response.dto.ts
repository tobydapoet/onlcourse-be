import { NotifyType } from '../types/notifyType';

export class NotificationResponseDto {
  id!: string;
  student_id!: string | null;
  type!: NotifyType;
  typeId!: string;
  content!: string;
  created_at!: Date;
}
