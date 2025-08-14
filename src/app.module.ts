import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { TeacherModule } from './teacher/teacher.module';
import { StudentModule } from './student/student.module';
import { AuthModule } from './auth/auth.module';
import { LessonModule } from './lesson/lesson.module';
import { QuizModule } from './quiz/quiz.module';
import { MessageModule } from './message/message.module';
import { NotificationModule } from './notification/notification.module';
import { EnrollmentModule } from './enrollment/enrollment.module';
import { CertificationModule } from './certification/certification.module';
import { ScoreModule } from './score/score.module';
import { CourseModule } from './course/course.module';
import { SalaryConfigModule } from './salary-config/salary-config.module';
import { CategoryModule } from './category/category.module';
import { CourseCategoryModule } from './course_category/course_category.module';
import { QuizQuestionModule } from './quiz_question/quiz_question.module';
import { QuizOptionModule } from './quiz_option/quiz_option.module';
import { CertificationAchieveModule } from './certification_achieve/certification_achieve.module';
import { CacheModule } from './cache/cache.module';
import { UploadModule } from './upload/upload.module';
import { QuizResponseModule } from './quiz_response/quiz_response.module';
import { SocketModule } from './socket/socket.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      username: process.env.DB_USER,
      port: Number(process.env.DB_PORT),
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    UserModule,
    TeacherModule,
    StudentModule,
    AuthModule,
    LessonModule,
    QuizModule,
    MessageModule,
    NotificationModule,
    EnrollmentModule,
    CertificationModule,
    ScoreModule,
    CourseModule,
    SalaryConfigModule,
    CategoryModule,
    CourseCategoryModule,
    QuizQuestionModule,
    QuizOptionModule,
    CertificationAchieveModule,
    CacheModule,
    UploadModule,
    QuizResponseModule,
    SocketModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
