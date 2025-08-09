import { SetMetadata } from '@nestjs/common';
import { TeacherRole } from '../enums/teacher-role';

export const TEACHER_KEY = 'teacher_position';
export const TeacherPosition = (...position: [TeacherRole, ...TeacherRole[]]) =>
  SetMetadata(TEACHER_KEY, position);
