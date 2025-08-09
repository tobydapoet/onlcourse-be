import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { TEACHER_KEY } from 'src/auth/decorator/teacher-type.decorator';
import { TeacherRole } from 'src/auth/enums/teacher-role';

@Injectable()
export class TeacherRoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const requiredPositions = this.reflector.getAllAndOverride<TeacherRole[]>(
      TEACHER_KEY,
      [context.getClass(), context.getHandler()],
    );
    if (!requiredPositions) return true;
    const user = context.switchToHttp().getRequest().user;
    const hasPosition = requiredPositions.some(
      (pos) => pos === user.teacher_role,
    );
    return hasPosition;
  }
}
