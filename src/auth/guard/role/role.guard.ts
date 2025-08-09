import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLE_KEY } from 'src/auth/decorator/role.decorator';
import { Role } from 'src/auth/enums/role.enum';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const requiRoles = this.reflector.getAllAndOverride<Role[]>(ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiRoles) return true;
    const user = context.switchToHttp().getRequest().user;
    const hasRequireRole = requiRoles.some((role) => user.role === role);
    return hasRequireRole;
  }
}
