import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCertificationAchieveDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  student_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  certification_id: string;
}
