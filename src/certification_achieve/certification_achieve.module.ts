import { Module } from '@nestjs/common';
import { CertificationAchieveService } from './certification_achieve.service';
import { CertificationAchieveController } from './certification_achieve.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CertificationAchieve } from './entities/certification_achieve.entity';
import { CacheModule } from 'src/cache/cache.module';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CertificationAchieve]),
    CacheModule,
    NotificationModule,
  ],
  controllers: [CertificationAchieveController],
  providers: [CertificationAchieveService],
})
export class CertificationAchieveModule {}
