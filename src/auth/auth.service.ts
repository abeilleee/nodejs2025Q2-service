import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ERROR_MESSAGE } from '../constants';
import { RefreshTokenDto } from './dto/refresh-token.dto';

export interface Payload {
  login: string;
  userId: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  public async signUp(signupDto: CreateUserDto) {
    const user = await this.usersService.create({
      login: signupDto.login,
      password: signupDto.password,
    });

    return user;
  }

  public async signIn(signInUserDto: CreateUserDto) {
    const { login, password } = signInUserDto;

    if (!login || typeof login !== 'string') {
      throw new BadRequestException('Login must be a non-empty string');
    }

    if (!password || typeof password !== 'string') {
      throw new BadRequestException('Password must be a non-empty string');
    }

    const existingUser = await this.usersService.getUserBylogin(
      login,
      password,
    );

    if (!existingUser) {
      throw new ForbiddenException('No user with such login');
    }

    const payload = {
      userId: existingUser.id,
      login: existingUser.login,
    };

    const accessToken = await this.jwtService.signAsync(
      payload as any,
      {
        secret: process.env.JWT_SECRET_KEY,
        expiresIn: process.env.TOKEN_EXPIRE_TIME,
      } as JwtSignOptions,
    );

    const refreshToken = await this.jwtService.signAsync(
      payload as any,
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
      } as JwtSignOptions,
    );

    return { accessToken, refreshToken };
  }

  public async refresh(refreshTokenDto: RefreshTokenDto) {
    const { refreshToken } = refreshTokenDto;
    const refreshSecret = process.env.JWT_REFRESH_SECRET;
    let decoded: Payload | null;

    if (!refreshToken) {
      throw new UnauthorizedException('There is no refresh token');
    }

    if (!refreshSecret) {
      throw new Error('JWT_REFRESH_SECRET is not configured');
    }

    try {
      decoded = await this.jwtService.verifyAsync(refreshToken, {
        secret: refreshSecret,
      });
    } catch (error) {
      let errorMsg =
        error.name === 'TokenExpiredError'
          ? ERROR_MESSAGE.TOKEN_EXPIRED
          : ERROR_MESSAGE.INVALID_TOKEN;

      throw new ForbiddenException(errorMsg || ERROR_MESSAGE.VALIDATION_FAILED);
    }

    const userId = decoded.userId;
    const user = await this.usersService.getUserById(userId);

    if (!user) {
      throw new Error();
    }

    const accessPayload = { userId: user.id, login: user.login };
    const refreshPayload = { userId: user.id };

    const newAccessToken = await this.jwtService.signAsync(
      accessPayload as any,
      {
        secret: process.env.JWT_SECRET_KEY,
        expiresIn: process.env.TOKEN_EXPIRE_TIME,
      } as JwtSignOptions,
    );

    const newRefreshToken = await this.jwtService.signAsync(
      refreshPayload as any,
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
      } as JwtSignOptions,
    );

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}
