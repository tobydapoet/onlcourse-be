import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { NotifyType } from '../types/notifyType';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNotificationDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  student_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(NotifyType)
  type: NotifyType;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  typeId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  content: string;
}
