import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from '../shared/prisma.service';
import { USER_ERROR_MESSAGE } from '../constants';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UsersResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  public async create(createUserDto: CreateUserDto) {
    const { login, password } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        login,
        password: hashedPassword,
      },
    });

    return plainToInstance(UsersResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  public async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    return this.excludeUserPassword(user);
  }

  public async getUserBylogin(login: string) {
    const user = await this.prisma.user.findUnique({
      where: { login },
    });

    if (!user) {
      return null;
    }

    return this.excludeUserPassword(user);
  }

  public async getAllUsers() {
    const allUsers = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return allUsers.map((user) => this.excludeUserPassword(user));
  }

  public async updatePassword(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) throw new Error(USER_ERROR_MESSAGE.NOT_FOUND);

    const isOldPasswordValid = await bcrypt.compare(
      updatePasswordDto.oldPassword,
      user.password,
    );

    if (!isOldPasswordValid)
      throw new Error(USER_ERROR_MESSAGE.OLD_PASSWORD_INCORRECT);

    const hashedNewPassword = await bcrypt.hash(
      updatePasswordDto.newPassword,
      10,
    );

    try {
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: {
          version: { increment: 1 },
          password: hashedNewPassword,
        },
      });

      return this.excludeUserPassword(updatedUser);
    } catch {
      throw new Error(USER_ERROR_MESSAGE.NOT_FOUND);
    }
  }

  public async deleteUser(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) throw new Error(USER_ERROR_MESSAGE.NOT_FOUND);

    await this.prisma.user.delete({
      where: { id },
    });
  }

  private excludeUserPassword(user: UsersResponseDto): UsersResponseDto {
    return plainToInstance(UsersResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }
}
