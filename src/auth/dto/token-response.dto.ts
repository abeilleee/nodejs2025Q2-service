import { IsNotEmpty, IsString } from 'class-validator';

export class TokenResponseDto {
  @IsNotEmpty()
  @IsString()
  accessToken: string;

  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
