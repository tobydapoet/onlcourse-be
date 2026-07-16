import { CourseResponseDto } from '../dto/course-response.dto';
import { Course } from '../entities/course.entity';

export class CourseMapper {
  static toResponse(course: Course): CourseResponseDto {
    return {
      id: course.id,
      title: course.title,
      des: course.des,
      thumbnail_url: course.thumbnail_url,
      cost: course.cost,
      isDeleted: course.isDeleted,
      created_at: course.created_at,
    };
  }
}
