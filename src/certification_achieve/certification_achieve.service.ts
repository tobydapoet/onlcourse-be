import { Inject, Injectable } from '@nestjs/common';
import { CreateCertificationAchieveDto } from './dto/create-certification_achieve.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CertificationAchieve } from './entities/certification_achieve.entity';
import { Repository } from 'typeorm';
import { RedisClientType } from '@redis/client';
import { NotificationService } from 'src/notification/notification.service';
import { NotifyType } from 'src/notification/types/notifyType';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class CertificationAchieveService {
  constructor(
    @InjectRepository(CertificationAchieve)
    private achieveRepo: Repository<CertificationAchieve>,
    @Inject('REDIS_STORAGE') private cacheStorage: RedisClientType,
    private notificationService: NotificationService,
  ) {}

  private async clearAchieveCache() {
    const keys = await this.cacheStorage.keys('achieve:page:*');
    if (keys.length > 0) {
      await this.cacheStorage.del(keys);
    }
  }

  async create(createCertificationAchieveDto: CreateCertificationAchieveDto) {
    const newAchieve = this.achieveRepo.create({
      certification: { id: createCertificationAchieveDto.student_id },
      student: { id: createCertificationAchieveDto.student_id },
    });
    const savedAchieve = await this.achieveRepo.save(newAchieve);
    if (savedAchieve) {
      await this.clearAchieveCache();
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

  async findAll(
    options: IPaginationOptions,
  ): Promise<Pagination<CertificationAchieve>> {
    const cachedKey = `achieve:page:${options.page}:limit:${options.limit}`;
    const cached = await this.cacheStorage.get(cachedKey);
    if (cached) {
      return JSON.parse(cached);
    }
    const queryBuilder = this.achieveRepo.createQueryBuilder('achieve');
    queryBuilder
      .leftJoinAndSelect('achieve.student', 'student')
      .leftJoinAndSelect('achieve.certification', 'certification')
      .orderBy('achieve.created_at', 'DESC');
    const result = paginate(queryBuilder, options);
    await this.cacheStorage.set(cachedKey, JSON.stringify(result), {
      EX: 60 * 5,
    });
    return result;
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
      await this.clearAchieveCache();
    }
    return removedAchieve;
  }
}
