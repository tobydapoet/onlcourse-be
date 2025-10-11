import { Controller, Get, Post, Body, Param, Put, Query } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { ApiParam } from '@nestjs/swagger';

@Controller('teacher')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Get()
  findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    limit = limit > 50 ? 50 : limit;
    return this.teacherService.findAll({ page, limit });
  }

  @ApiParam({ name: 'id', type: String })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teacherService.findOne(id);
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
    } catch (err) {
      return {
        message: err.message,
      };
    }
  }
}
