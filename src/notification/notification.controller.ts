import { Controller, Get, Post, Param, Delete } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { NotificationMapper } from './mappers/notification.mapper';
@ApiBearerAuth()
@Controller('notification')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Get('student/:id')
  @ApiParam({ name: 'id', type: String })
  async findByStudent(@Param('id') student_id: string) {
    const notifications =
      await this.notificationService.findByStudent(student_id);
    return notifications.map(NotificationMapper.toResponse);
  }

  @Delete('student/:id')
  @ApiParam({ name: 'id', type: String })
  async removeByStudent(@Param('id') student_id: string) {
    return this.notificationService.removeByStudent(student_id);
  }
}
