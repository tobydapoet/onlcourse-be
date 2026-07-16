import { Controller, Get, Post, Body, Param, Put, Query } from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { ApiParam } from '@nestjs/swagger';
import { StudentMapper } from './mappers/student.mapper';
import { mapPagination } from 'src/common/dto/pagination-response.dto';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  async create(@Body() createStudentDto: CreateStudentDto) {
    const student = await this.studentService.create(createStudentDto);
    return StudentMapper.toResponse(student);
  }

  @Get()
  async findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    limit = limit > 50 ? 50 : limit;
    const students = await this.studentService.findAll({ page, limit });
    return mapPagination(students, StudentMapper.toResponse);
  }

  @ApiParam({ name: 'id', type: String })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const student = await this.studentService.findOne(id);
    return student ? StudentMapper.toResponse(student) : null;
  }

  @ApiParam({ name: 'id', type: String })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    return this.studentService.update(id, updateStudentDto);
  }
}
