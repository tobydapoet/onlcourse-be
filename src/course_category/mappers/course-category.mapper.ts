import { CourseCategoryResponseDto } from '../dto/course-category-response.dto';
import { CourseCategory } from '../entities/course_category.entity';

export class CourseCategoryMapper {
  static toResponse(entity: CourseCategory): CourseCategoryResponseDto {
    return {
      id: entity.id,
      category_id: entity.category?.id ?? null,
      course_id: entity.course?.id ?? null,
    };
  }
}
