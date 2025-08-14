import { Controller, Get, Post, Param, Delete } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
@ApiBearerAuth()
@Controller('notification')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Get('student/:id')
  @ApiParam({ name: 'id', type: String })
  async findByStudent(@Param('id') student_id: string) {
    return this.notificationService.findByStudent(student_id);
  }

  @Delete('student/:id')
  @ApiParam({ name: 'id', type: String })
  async removeByStudent(@Param('id') student_id: string) {
    return this.notificationService.removeByStudent(student_id);
  }
}
