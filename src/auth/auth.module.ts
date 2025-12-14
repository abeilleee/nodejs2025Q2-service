import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/user.module';
import { JwtAuthModule } from './jwt-auth.module';

@Module({
  imports: [UsersModule, JwtAuthModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
