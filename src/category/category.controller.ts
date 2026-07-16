import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { Roles } from 'src/auth/decorator/role.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import { CategoryResponseDto } from './dto/category-response.dto';
import { CategoryMapper } from './mappers/category.mapper';
import { mapPagination } from 'src/common/dto/pagination-response.dto';

@ApiBearerAuth()
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Roles(Role.TEACHER)
  @Post()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
      },
      required: ['name'],
    },
  })
  async create(@Body() name: string) {
    try {
      const res = await this.categoryService.create(name);
      return {
        id: res.id,
      };
    } catch (err: any) {
      return {
        messsage: err.message,
      };
    }
  }

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<Pagination<CategoryResponseDto>> {
    limit = limit > 50 ? 50 : limit;
    const categories = await this.categoryService.findAll({ page, limit });
    return mapPagination(categories, CategoryMapper.toResponse);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const category = await this.categoryService.findOne(+id);
    return category ? CategoryMapper.toResponse(category) : null;
  }

  @Roles(Role.TEACHER)
  @Put(':id')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
      },
      required: ['name'],
    },
  })
  async update(@Param('id') id: number, @Body() name: string) {
    try {
      await this.categoryService.update(id, name);
      return {
        message: 'Update category success!',
      };
    } catch (err: any) {
      return {
        message: err.message,
      };
    }
  }

  @Roles(Role.TEACHER)
  @ApiParam({ name: 'id', type: Number })
  @Delete(':id')
  async remove(@Param('id') id: number) {
    try {
      await this.categoryService.remove(id);
      return {
        message: 'Delete category success!',
      };
    } catch (err: any) {
      return {
        message: err.message,
      };
    }
  }
}
