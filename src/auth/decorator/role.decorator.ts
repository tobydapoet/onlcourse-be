import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums/role.enum';

export const ROLE_KEY = 'role';
export const Roles = (...roles: [Role, ...Role[]]) =>
  SetMetadata(ROLE_KEY, roles);
