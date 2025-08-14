import { Inject, Injectable } from '@nestjs/common';
import { CreateCertificationAchieveDto } from './dto/create-certification_achieve.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CertificationAchieve } from './entities/certification_achieve.entity';
import { Repository } from 'typeorm';
import { RedisClientType } from '@redis/client';
import { NotificationService } from 'src/notification/notification.service';
import { NotifyType } from 'src/notification/types/notifyType';

@Injectable()
export class CertificationAchieveService {
  constructor(
    @InjectRepository(CertificationAchieve)
    private achieveRepo: Repository<CertificationAchieve>,
    @Inject('REDIS_STORAGE') private cacheStorage: RedisClientType,
    private notificationService: NotificationService,
  ) {}
  async create(createCertificationAchieveDto: CreateCertificationAchieveDto) {
    const newAchieve = this.achieveRepo.create({
      certification: { id: createCertificationAchieveDto.student_id },
      student: { id: createCertificationAchieveDto.student_id },
    });
    const savedAchieve = await this.achieveRepo.save(newAchieve);
    if (savedAchieve) {
      await this.cacheStorage.del('account:all');
      const newNotification = await this.notificationService.create({
        content: `You have just received notifiation!`,
        student_id: savedAchieve.student.id,
        type: NotifyType.CERTIFICATE,
        typeId: savedAchieve.id,
      });
      return { ...savedAchieve, target: newNotification };
    }
    return null;
  }

  async findAll() {
    const cachedKey = 'achieve:all';
    const cached = await this.cacheStorage.get(cachedKey);
    if (cached) {
      return JSON.parse(cached);
    }
    const allAchieve = await this.achieveRepo.find();
    await this.cacheStorage.set(cachedKey, JSON.stringify(allAchieve), {
      EX: 60 * 5,
    });
    return allAchieve;
  }

  async findOne(id: string) {
    const cachedKey = `achieve:${id}`;
    const cached = await this.cacheStorage.get(cachedKey);
    if (cached) {
      return JSON.parse(cached);
    }
    const allAchieve = await this.achieveRepo.findOne({ where: { id } });
    await this.cacheStorage.set(cachedKey, JSON.stringify(allAchieve), {
      EX: 60 * 5,
    });
    return allAchieve;
  }

  async remove(id: string) {
    const existingAchieve = await this.achieveRepo.findOne({ where: { id } });
    if (!existingAchieve) {
      throw new Error("Can't find this achievement");
    }
    const removedAchieve = await this.achieveRepo.delete({ id });
    if (removedAchieve) {
      await this.cacheStorage.del('achieve:all');
    }
    return removedAchieve;
  }
}
