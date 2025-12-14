import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { Public } from './decorators/public.decorators';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() signupDto: CreateUserDto) {
    const user = await this.authService.signUp(signupDto);

    return {
      id: user.id,
      message: 'User created successfully',
    };
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: CreateUserDto) {
    const { accessToken, refreshToken } =
      await this.authService.signIn(loginDto);

    return {
      accessToken,
      refreshToken,
    };
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    const { accessToken, refreshToken } =
      await this.authService.refresh(refreshTokenDto);

    return {
      accessToken,
      refreshToken,
    };
  }
}
