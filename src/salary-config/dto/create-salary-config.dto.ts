import { ApiProperty } from '@nestjs/swagger';
import { IsDecimal, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateSalaryConfigDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  teacher_id: string;

  @ApiProperty()
  @IsInt()
  hours_worked?: number;

  @ApiProperty()
  @IsInt()
  penalty?: number;

  @ApiProperty()
  @IsDecimal()
  bonus_rate: number;
}
