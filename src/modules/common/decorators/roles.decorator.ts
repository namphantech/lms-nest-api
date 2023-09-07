import { Roles } from '../constants';
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const RolesAllowed = (...roles: Roles[]) =>
  SetMetadata(ROLES_KEY, roles);
