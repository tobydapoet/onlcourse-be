import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SalaryConfigService } from './salary-config.service';
import { CreateSalaryConfigDto } from './dto/create-salary-config.dto';
import { UpdateSalaryConfigDto } from './dto/update-salary-config.dto';
import { Roles } from 'src/auth/decorator/role.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { TeacherPosition } from 'src/auth/decorator/teacher-type.decorator';
import { TeacherRole } from 'src/auth/enums/teacher-role';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('salary-config')
export class SalaryConfigController {
  constructor(private readonly salaryConfigService: SalaryConfigService) {}

  @Roles(Role.TEACHER)
  @TeacherPosition(TeacherRole.ADMIN)
  @Post()
  async create(@Body() createSalaryConfigDto: CreateSalaryConfigDto) {
    try {
      const res = await this.salaryConfigService.create(createSalaryConfigDto);
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
    return this.salaryConfigService.findAll();
  }

  @ApiParam({ name: 'id', type: String })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salaryConfigService.findOne(id);
  }

  @ApiParam({ name: 'id', type: String })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSalaryConfigDto: UpdateSalaryConfigDto,
  ) {
    try {
      const res = await this.salaryConfigService.update(
        id,
        updateSalaryConfigDto,
      );
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

  @ApiParam({ name: 'id', type: String })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.salaryConfigService.remove(id);
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
