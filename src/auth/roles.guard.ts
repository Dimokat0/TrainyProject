import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserService } from 'src/user/user.service';
import { MyJwtPayload } from './auth.repository';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: MyJwtPayload;
    }
  }
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<number[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = await this.userService.getUserById(request.user.userId);

    if (!user) {
      throw new NotFoundException();
    } else {
      const hasRole = () => roles.includes(user.roleId);
      if (!hasRole()) {
        throw new ForbiddenException();
      }
    }

    return true;
  }
}
