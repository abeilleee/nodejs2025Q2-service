import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoggingService } from '../logging/logging.service';

@Injectable()
export class JwtAuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly logger: LoggingService,
  ) {
    this.logger.setContext('JwtAuthService');
  }

  validateAuthorizationHeader(authHeader?: string): {
    token?: string;
    error?: string;
  } {
    if (!authHeader) {
      return { error: 'Authorization header is required' };
    }

    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer') {
      return { error: 'Invalid Authorization scheme. Use "Bearer <token>"' };
    }

    if (!token) {
      return { error: 'Token is required' };
    }

    return { token };
  }

  async validateAccessToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET_KEY,
      });

      if (!payload.userId || !payload.login) {
        return null;
      }

      const user = await this.usersService.getUserById(payload.userId);
      if (!user || user.login !== payload.login) {
        return null;
      }

      return {
        id: user.id,
        login: user.login,
        tokenPayload: payload,
      };
    } catch (error) {
      return null;
    }
  }

  isPublicPath(path: string): boolean {
    const publicPaths = [
      '/',
      '/auth/signup',
      '/auth/login',
      '/auth/refresh',
      '/doc',
    ];

    return publicPaths.some((publicPath) => {
      if (path === publicPath) return true;
      if (publicPath === '/doc' && path.startsWith('/doc')) return true;
      if (publicPath === '/' && path === '') return true;
      return false;
    });
  }
}
