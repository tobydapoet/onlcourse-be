import { Module } from '@nestjs/common';
import { CertificationService } from './certification.service';
import { CertificationController } from './certification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Certification } from './entities/certification.entity';
import { UploadModule } from 'src/upload/upload.module';
import { CacheModule } from 'src/cache/cache.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Certification]),
    UploadModule,
    CacheModule,
  ],
  controllers: [CertificationController],
  providers: [CertificationService],
})
export class CertificationModule {}
