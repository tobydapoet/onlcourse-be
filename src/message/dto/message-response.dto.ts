export class MessageResponseDto {
  id!: string;
  sender_id!: string | null;
  receiver_id!: string | null;
  content!: string;
  images!: string[] | null;
  isReading!: boolean;
  created_at!: Date;
}
