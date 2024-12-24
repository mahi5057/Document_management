import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles) {
            return true; // No roles required for this route
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user || !user.roles || !this.hasRequiredRole(user.roles, requiredRoles)) {
            throw new ForbiddenException('You do not have the required role to access this resource');
        }

        return true;
    }

    private hasRequiredRole(userRoles: Role[], requiredRoles: Role[]): boolean {
        return requiredRoles.some((role) => userRoles.includes(role));
    }
}
