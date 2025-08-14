import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum } from 'class-validator';

export class UpdateStudentDto {
  @ApiProperty()
  @IsDate()
  dob?: Date;

  @ApiProperty()
  @IsEnum(['Nam', 'Nữ'])
  gender?: ['Name', 'Nữ'];
}
