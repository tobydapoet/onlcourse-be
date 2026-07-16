import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { QuizService } from './quiz.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { Role } from 'src/auth/enums/role.enum';
import { Roles } from 'src/auth/decorator/role.decorator';
import { TeacherPosition } from 'src/auth/decorator/teacher-type.decorator';
import { TeacherRole } from 'src/auth/enums/teacher-role';
import { QuizMapper } from './mappers/quiz.mapper';
@ApiBearerAuth()
@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Roles(Role.TEACHER)
  @TeacherPosition(TeacherRole.ADMIN, TeacherRole.PARTTIME, TeacherRole.ADMIN)
  @Post()
  async create(@Body() createQuizDto: CreateQuizDto) {
    const quiz = await this.quizService.create(createQuizDto);
    return QuizMapper.toResponse(quiz);
  }

  @ApiParam({ name: 'id', type: String })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const quiz = await this.quizService.findOne(id);
    return quiz ? QuizMapper.toResponse(quiz) : null;
  }

  @ApiParam({ name: 'id', type: String })
  @Roles(Role.TEACHER)
  @TeacherPosition(TeacherRole.ADMIN, TeacherRole.PARTTIME, TeacherRole.ADMIN)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateQuizDto: UpdateQuizDto) {
    return this.quizService.update(id, updateQuizDto);
  }

  @ApiParam({ name: 'id', type: String })
  @Roles(Role.TEACHER)
  @TeacherPosition(TeacherRole.ADMIN, TeacherRole.PARTTIME, TeacherRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.quizService.remove(id);
  }
}
