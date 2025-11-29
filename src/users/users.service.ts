import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/base.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { User } from './entities/user.entity';
import { USER_ERROR_MESSAGE } from 'src/constants';

@Injectable()
export class UsersService extends BaseService<User> {
  constructor() {
    super();
  }

  public create(createUserDto: CreateUserDto) {
    const id = this.generateId();

    const user: User = {
      id,
      ...createUserDto,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.items.set(id, user);
    const userWithoutPassword = this.excludeUserPassword(user);

    return userWithoutPassword;
  }

  public getAllUsers() {
    const allUsers = this.getAll();

    return allUsers.map((user) => this.excludeUserPassword(user));
  }

  public updatePassword(id: string, updatePasswordDto: UpdatePasswordDto) {
    const user = this.items.get(id);

    if (!user) throw new Error(USER_ERROR_MESSAGE.NOT_FOUND);

    if (user.password !== updatePasswordDto.oldPassword)
      throw new Error(USER_ERROR_MESSAGE.OLD_PASSWORD_INCORRECT);

    user.password = updatePasswordDto.newPassword;
    user.version += 1;
    user.updatedAt = Date.now();
    this.items.set(id, user);

    return this.excludeUserPassword(user);
  }

  public deleteUser(id: string) {
    const user = this.items.get(id);

    if (!user) throw new Error(USER_ERROR_MESSAGE.NOT_FOUND);

    this.items.delete(id);
  }

  private excludeUserPassword(user: User) {
    const { password, ...restData } = user;

    return restData;
  }
}
