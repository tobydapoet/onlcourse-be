import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { CourseCategoryService } from './course_category.service';
import { CreateCourseCategoryDto } from './dto/create-course_category.dto';
import { Roles } from 'src/auth/decorator/role.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { TeacherPosition } from 'src/auth/decorator/teacher-type.decorator';
import { TeacherRole } from 'src/auth/enums/teacher-role';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';

@Controller('course-category')
export class CourseCategoryController {
  constructor(private readonly courseCategoryService: CourseCategoryService) {}

  @Post()
  @ApiBearerAuth()
  @Roles(Role.TEACHER)
  @TeacherPosition(TeacherRole.FULLTIME)
  create(@Body() createCourseCategoryDto: CreateCourseCategoryDto) {
    return this.courseCategoryService.create(createCourseCategoryDto);
  }

  @Get('course/:id')
  findByCourse(@Param('id') id: string) {
    return this.courseCategoryService.findByCourse(id);
  }

  @Get('category/:id')
  findByCategory(@Param('id') id: number) {
    return this.courseCategoryService.findByCategory(id);
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
