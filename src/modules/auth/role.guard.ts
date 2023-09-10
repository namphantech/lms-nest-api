import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as _ from 'lodash';
import { Roles } from '../common/constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles =
      this.reflector.getAllAndMerge<Roles[]>('roles', [
        context.getClass(),
        context.getHandler(),
      ]) || [];
    console.log(roles);
    if (!roles) {
      return true;
    }

    let isAllowed = false;
    roles.map((role) => {
      const roledata = _.get(context.switchToHttp().getRequest(), [
        'user',
        'role',
      ]);
      const rolecode = _.get(roledata, ['code']);
      if (rolecode === role) {
        isAllowed = true;
      }
    });
    return isAllowed;
  }
}
