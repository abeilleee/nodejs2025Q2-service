import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/base.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class UsersService extends BaseService<User> {
  constructor() {
    super();

    // TODO: удалить (для теста)
    const testUserId = this.generateId();
    this.items.set(testUserId, {
      id: testUserId,
      login: 'admin',
      password: 'admin123',
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
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

    if (!user) throw new Error(`User with id: ${id} does not exist`);

    if (user.password !== updatePasswordDto.oldPassword)
      throw new Error('Old password is incorrect');

    user.password = updatePasswordDto.newPassword;
    user.version += 1;
    user.updatedAt = Date.now();
    this.items.set(id, user);

    return this.excludeUserPassword(user);
  }

  public deleteUser(id: string) {
    const user = this.items.get(id);

    if (!user) throw new Error(`User with id: ${id} does not exist`);

    this.items.delete(id);
  }

  private excludeUserPassword(user: User) {
    const { password, ...restData } = user;

    return restData;
  }
}
