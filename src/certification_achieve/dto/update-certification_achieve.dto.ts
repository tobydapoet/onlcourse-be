import { PartialType } from '@nestjs/mapped-types';
import { CreateCertificationAchieveDto } from './create-certification_achieve.dto';

export class UpdateCertificationAchieveDto extends PartialType(CreateCertificationAchieveDto) {}
