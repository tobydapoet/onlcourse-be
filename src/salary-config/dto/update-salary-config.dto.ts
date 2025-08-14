import { ApiProperty } from '@nestjs/swagger';
import { IsDecimal, IsInt } from 'class-validator';

export class UpdateSalaryConfigDto {
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
