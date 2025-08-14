import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorator/role.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { TeacherPosition } from 'src/auth/decorator/teacher-type.decorator';
import { TeacherRole } from 'src/auth/enums/teacher-role';

@ApiBearerAuth()
@Controller('enrollment')
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Roles(Role.TEACHER)
  @TeacherPosition(TeacherRole.FULLTIME, TeacherRole.ADMIN)
  @Post()
  async create(@Body() createEnrollmentDto: CreateEnrollmentDto) {
    try {
      const res = await this.enrollmentService.create(createEnrollmentDto);
      return {
        success: true,
        data: res,
      };
    } catch (err) {
      return {
        success: false,
        error: err.message,
      };
    }
  }

  @Get()
  findAll() {
    return this.enrollmentService.findAll();
  }

  @ApiParam({ name: 'id', type: String })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.enrollmentService.findOne(id);
  }

  @ApiParam({ name: 'id', type: String })
  @Roles(Role.TEACHER)
  @TeacherPosition(TeacherRole.FULLTIME, TeacherRole.ADMIN)
  @Put(':id')
  async updateOrder(@Param('id') id: string) {
    try {
      const res = await this.enrollmentService.updateOrder(id);
      return {
        success: true,
        data: res,
      };
    } catch (err) {
      return {
        success: false,
        error: err.message,
      };
    }
  }

  @Roles(Role.TEACHER)
  @TeacherPosition(TeacherRole.FULLTIME, TeacherRole.ADMIN)
  @ApiParam({ name: 'id', type: String })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.enrollmentService.remove(id);
      return {
        success: true,
      };
    } catch (err) {
      return {
        success: false,
        error: err.message,
      };
    }
  }
}
