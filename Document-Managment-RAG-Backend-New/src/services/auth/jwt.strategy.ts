import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ObjectId } from 'mongodb';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY
    });
  }

  async validate(payload: any) {
    // Extract the username and roles from the JWT payload
    const id = new ObjectId(payload.sub)
    const user = await this.userService.findById(id);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return { userId: user.id, username: user.username, roles: user.roles, name: user.name }; // Attach user roles to request object
  }
}
