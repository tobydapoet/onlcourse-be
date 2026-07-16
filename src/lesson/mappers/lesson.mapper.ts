import { LessonResponseDto } from '../dto/lesson-response.dto';
import { Lesson } from '../entities/lesson.entity';

export class LessonMapper {
  static toResponse(entity: Lesson): LessonResponseDto {
    return {
      id: entity.id,
      title: entity.title,
      course_id: entity.course?.id ?? null,
      order: entity.order,
      video: entity.video,
      main_teacher_id: entity.main?.id ?? null,
      assistant_teacher_id: entity.assistant?.id ?? null,
      created_at: entity.created_at,
    };
  }
}
