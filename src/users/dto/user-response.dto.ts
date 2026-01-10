import { Expose, Transform } from 'class-transformer';

export class UsersResponseDto {
  @Expose()
  id: string;

  @Expose()
  login: string;

  @Expose()
  version: number;

  @Expose()
  @Transform(({ value }) => value.getTime())
  createdAt: Date;

  @Expose()
  @Transform(({ value }) => value.getTime())
  updatedAt: Date;
}
