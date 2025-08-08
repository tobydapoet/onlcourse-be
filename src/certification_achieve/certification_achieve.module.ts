import { Module } from '@nestjs/common';
import { CertificationAchieveService } from './certification_achieve.service';
import { CertificationAchieveController } from './certification_achieve.controller';

@Module({
  controllers: [CertificationAchieveController],
  providers: [CertificationAchieveService],
})
export class CertificationAchieveModule {}
