import { PartialType } from '@nestjs/mapped-types';
import { CreateSalaryConfigDto } from './create-salary-config.dto';

export class UpdateSalaryConfigDto extends PartialType(CreateSalaryConfigDto) {}
