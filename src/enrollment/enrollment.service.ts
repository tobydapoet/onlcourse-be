import { Inject, Injectable } from '@nestjs/common';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Enrollment } from './entities/enrollment.entity';
import { Repository } from 'typeorm';
import { RedisClientType } from 'redis';
import { NotificationService } from 'src/notification/notification.service';
import { CourseService } from 'src/course/course.service';
import { NotifyType } from 'src/notification/types/notifyType';
import { Course } from 'src/course/entities/course.entity';

@Injectable()
export class EnrollmentService {
  constructor(
    @InjectRepository(Enrollment)
    private enrollmentRepo: Repository<Enrollment>,
    private notificationService: NotificationService,
    private courseService: CourseService,
    @Inject('REDIS_STORAGE') private cacheStorage: RedisClientType,
  ) {}
  async create(createEnrollmentDto: CreateEnrollmentDto) {
    const newEnrollment = this.enrollmentRepo.create({
      course: { id: createEnrollmentDto.course_id },
      student: { id: createEnrollmentDto.student_id },
    });
    const savedEnrollment = await this.enrollmentRepo.save(newEnrollment);
    if (savedEnrollment) {
      await this.cacheStorage.del(`enrollment:all`);
      const newNotification = await this.notificationService.create({
        student_id: createEnrollmentDto.student_id,
        type: NotifyType.SUCCESS_ENROLL,
        typeId: savedEnrollment.id,
        content: `Enroll course ${savedEnrollment.course.title} success!`,
      });
      return { ...savedEnrollment, target: newNotification };
    }
    return null;
  }

  async findAll() {
    const cachedKey = `enrollment:all`;
    const cached = await this.cacheStorage.get(cachedKey);
    if (cached) {
      return JSON.parse(cached);
    }
    const allEnrollments = await this.enrollmentRepo.find();
    await this.cacheStorage.set(cachedKey, JSON.stringify(allEnrollments), {
      EX: 60 * 5,
    });
    return allEnrollments;
  }

  async findOne(id: string) {
    const cachedKey = `enrollment:${id}`;
    const cached = await this.cacheStorage.get(cachedKey);
    if (cached) {
      return JSON.parse(cached);
    }
    const enrollment = await this.enrollmentRepo.find();
    await this.cacheStorage.set(cachedKey, JSON.stringify(enrollment), {
      EX: 60 * 5,
    });
    return enrollment;
  }

  async updateOrder(id: string) {
    const enrollment = await this.enrollmentRepo.findOne({
      where: { id },
    });
    if (!enrollment) throw new Error("Can't find this enrollment");

    const newOrder = enrollment.last_order + 1;
    const totalItems = await this.courseService.totalLessonAndQuiz(
      enrollment.course.id,
    );

    let isCompleted = false;
    let notification;

    if (newOrder === totalItems - 1) {
      notification = await this.notificationService.create({
        content: `You almost finish your course: ${enrollment.course.title}`,
        student_id: enrollment.student.id,
        type: NotifyType.ALMOST_FINISH,
        typeId: enrollment.id,
      });
    } else if (newOrder >= totalItems) {
      isCompleted = true;
      notification = await this.notificationService.create({
        content: `You have just finished ${enrollment.course.title}`,
        student_id: enrollment.student.id,
        type: NotifyType.FINISH,
        typeId: id,
      });
    }

    await this.enrollmentRepo.update(
      { id },
      { last_order: newOrder, isCompleted },
    );
    await Promise.all([
      this.cacheStorage.del(`enrollment:all`),
      this.cacheStorage.del(`enrollment:${id}`),
    ]);

    return { last_order: newOrder, isCompleted, notification };
  }

  async remove(id: string) {
    const deletedEnrollment = await this.enrollmentRepo.delete({ id });
    if (deletedEnrollment) {
      await this.cacheStorage.del(`enrollment:all`);
      await this.cacheStorage.del(`enrollment:${id}`);
    }
    return deletedEnrollment;
  }
}
