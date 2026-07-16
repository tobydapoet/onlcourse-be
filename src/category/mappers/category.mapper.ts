import { CategoryResponseDto } from '../dto/category-response.dto';
import { Category } from '../entities/category.entity';

export class CategoryMapper {
  static toResponse(entity: Category): CategoryResponseDto {
    return { id: entity.id, name: entity.name };
  }
}
