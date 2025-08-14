import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateMessageDto {
  @ApiProperty()
  @IsBoolean()
  isReading?: boolean;

  @ApiProperty()
  @IsString()
  content: string;
}
