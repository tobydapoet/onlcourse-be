import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCourseDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  des: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  thumbnail_url: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  cost: number;
}
