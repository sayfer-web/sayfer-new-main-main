import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums/role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private configService: ConfigService
    ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    // console.log(token)
    
    if (!token) {
        throw new UnauthorizedException('No token found in request');
    }
    try {
      const user = this.jwtService.verify(token, { secret: this.configService.get('JWT_ACCESS')});
      
    //   console.log(decoded);
      // Теперь у вас есть расшифрованные данные токена в "decoded"
      // Вы можете проверить роли и принять решение на основе этой информации
    return requiredRoles.some((role) => user.roles?.includes(role));
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }

    // console.log(context.switchToHttp().getRequest())
    // if (!user) {
    //     throw new UnauthorizedException('No user found in request');
    // }

  }

  private extractTokenFromHeader(request: Request): string | undefined {
    /* @ts-ignore */
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}