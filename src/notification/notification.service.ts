import { Inject, Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { LessThan, Repository } from 'typeorm';
import { RedisClientType } from 'redis';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepo: Repository<Notification>,
    @Inject('REDIS_STORAGE') private cacheStorage: RedisClientType,
  ) {}
  async create(createNotificationDto: CreateNotificationDto) {
    const { student_id, ...rest } = createNotificationDto;
    const newNotification = this.notificationRepo.create({
      ...rest,
      student: { id: student_id },
    });
    const savedNotification = await this.notificationRepo.save(newNotification);
    return savedNotification;
  }

  async findByStudent(student_id: string) {
    const cachedKey = `notification-student:${student_id}`;
    const cached = await this.cacheStorage.get(cachedKey);
    if (cached) {
      return JSON.parse(cached);
    }
    const notifications = await this.notificationRepo.find({
      where: { student: { id: student_id } },
    });
    await this.cacheStorage.set(cachedKey, JSON.stringify(notifications), {
      EX: 60 * 5,
    });
    return notifications;
  }

  async removeByStudent(student_id: string) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const deletedResult = await this.notificationRepo.delete({
      student: { id: student_id },
      created_at: LessThan(thirtyDaysAgo),
    });

    if (deletedResult.affected && deletedResult.affected > 0) {
      await this.cacheStorage.del(`notification-student:${student_id}`);
    }

    return deletedResult;
  }
}
