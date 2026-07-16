import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { CourseCategoryService } from './course_category.service';
import { CreateCourseCategoryDto } from './dto/create-course_category.dto';
import { Roles } from 'src/auth/decorator/role.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { TeacherPosition } from 'src/auth/decorator/teacher-type.decorator';
import { TeacherRole } from 'src/auth/enums/teacher-role';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { CourseCategoryMapper } from './mappers/course-category.mapper';

@Controller('course-category')
export class CourseCategoryController {
  constructor(private readonly courseCategoryService: CourseCategoryService) {}

  @Post()
  @ApiBearerAuth()
  @Roles(Role.TEACHER)
  @TeacherPosition(TeacherRole.FULLTIME)
  async create(@Body() createCourseCategoryDto: CreateCourseCategoryDto) {
    const relation = await this.courseCategoryService.create(
      createCourseCategoryDto,
    );
    return CourseCategoryMapper.toResponse(relation);
  }

  @Get('course/:id')
  async findByCourse(@Param('id') id: string) {
    const relations = await this.courseCategoryService.findByCourse(id);
    return relations.map(CourseCategoryMapper.toResponse);
  }

  @Get('category/:id')
  async findByCategory(@Param('id') id: number) {
    const relations = await this.courseCategoryService.findByCategory(id);
    return relations.map(CourseCategoryMapper.toResponse);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @Roles(Role.TEACHER)
  @TeacherPosition(TeacherRole.FULLTIME)
  @ApiParam({ name: 'id', type: String })
  remove(@Param('id') id: string) {
    return this.courseCategoryService.remove(+id);
  }
}
