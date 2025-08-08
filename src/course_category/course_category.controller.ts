import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CourseCategoryService } from './course_category.service';
import { CreateCourseCategoryDto } from './dto/create-course_category.dto';
import { UpdateCourseCategoryDto } from './dto/update-course_category.dto';

@Controller('course-category')
export class CourseCategoryController {
  constructor(private readonly courseCategoryService: CourseCategoryService) {}

  @Post()
  create(@Body() createCourseCategoryDto: CreateCourseCategoryDto) {
    return this.courseCategoryService.create(createCourseCategoryDto);
  }

  @Get()
  findAll() {
    return this.courseCategoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.courseCategoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCourseCategoryDto: UpdateCourseCategoryDto) {
    return this.courseCategoryService.update(+id, updateCourseCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.courseCategoryService.remove(+id);
  }
}
