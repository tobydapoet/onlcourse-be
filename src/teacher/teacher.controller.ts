import { Controller, Get, Post, Body, Param, Put, Query } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { ApiParam } from '@nestjs/swagger';
import { TeacherMapper } from './mappers/teacher.mapper';
import { mapPagination } from 'src/common/dto/pagination-response.dto';

@Controller('teacher')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Get()
  async findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    limit = limit > 50 ? 50 : limit;
    const teachers = await this.teacherService.findAll({ page, limit });
    return mapPagination(teachers, TeacherMapper.toResponse);
  }

  @ApiParam({ name: 'id', type: String })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const teacher = await this.teacherService.findOne(id);
    return teacher ? TeacherMapper.toResponse(teacher) : null;
  }

  @ApiParam({ name: 'id', type: String })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTeacherDto: UpdateTeacherDto,
  ) {
    try {
      const res = await this.teacherService.update(id, updateTeacherDto);
      return {
        message: 'Update teacher success!',
      };
    } catch (err: any) {
      return {
        message: err.message,
      };
    }
  }
}
