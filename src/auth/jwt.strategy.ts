import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { Payload } from './auth.service';
import { USER_ERROR_MESSAGE } from '../constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY || 'default-secret-key',
    });
  }

  async validate(payload: Payload) {
    try {
      const user = await this.usersService.getUserById(payload.userId);

      if (!user) {
        throw new UnauthorizedException(USER_ERROR_MESSAGE.NOT_FOUND);
      }

      return { userId: payload.userId, login: payload.login };
    } catch (error) {
      return { userId: payload.userId, login: payload.login };
    }
  }
}
