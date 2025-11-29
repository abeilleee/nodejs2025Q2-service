import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UsersResponseDto } from './dto/user-response.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { ERROR_MESSAGE, USER_ERROR_MESSAGE } from 'src/constants';

@ApiTags('User')
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Get all users
   *
   * @method GET
   * @endpoint /user
   * @returns {UsersResponseDto[]} array withous passwords
   */
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get all users',
    type: UsersResponseDto,
  })
  getAll() {
    return this.usersService.getAll();
  }

  /**
   * Get user by ID
   *
   * @method GET
   * @endpoint /user/:id
   * @param {string} id user UUID
   * @returns {UsersResponseDto} User without password
   */

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved user',
    type: UsersResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'User ID is not a valid UUID',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User with specified ID was not found',
  })
  getUserById(id: string) {
    if (!this.usersService.validateUUID(id)) {
      throw new BadRequestException(ERROR_MESSAGE.INVALID_UUID);
    }

    const user = this.usersService.getById(id);

    if (!user) throw new NotFoundException(USER_ERROR_MESSAGE.DOES_NOT_EXIST);

    return user;
  }

  /**
   * Create new user
   *
   * @method POST
   * @endpoint /user
   * @param {CreateUserDto} createUserDto
   * @returns {UsersResponseDto} User without password
   */

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new user' })
  @ApiBody({
    type: CreateUserDto,
    description: 'User login and password',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User was successfully created',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Request body does not contain required field',
  })
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  /**
   * Update user password
   *
   * @method PUT
   * @endpoint /user/:id
   * @param {string} id user UUID
   * @returns {UsersResponseDto} User without password
   * @throws {BadRequestException} if user id is invalid (not uuid)
   * @throws {NotFoundException} if record with id === userId doesn't exist
   * @throws {ForbiddenException} if oldPassword is wrong
   */

  @Put(':id')
  @ApiOperation({ summary: 'Update user password' })
  @ApiParam({
    name: 'id',
    description: 'User UUID',
  })
  @ApiBody({
    type: UpdatePasswordDto,
    description: 'Old and new password',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Password successfully updated',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'User ID is not a valid UUID',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User with specified ID was not found',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Old password is incorrect',
  })
  updatePassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    if (!this.usersService.validateUUID(id)) {
      throw new BadRequestException(ERROR_MESSAGE.INVALID_UUID);
    }

    try {
      return this.usersService.updatePassword(id, updatePasswordDto);
    } catch (error) {
      if (error.message === USER_ERROR_MESSAGE.NOT_FOUND) {
        throw new NotFoundException(USER_ERROR_MESSAGE.DOES_NOT_EXIST);
      } else if (error.message === USER_ERROR_MESSAGE.OLD_PASSWORD_INCORRECT) {
        throw new ForbiddenException(USER_ERROR_MESSAGE.OLD_PASSWORD_INCORRECT);
      }
    }
  }

  /**
   * Delete user
   *
   * @method DELETE
   * @endpoint /user/:id
   * @param {string} id user UUID
   * @returns {void} 204 if the record is found and deleted
   * @throws {BadRequestException} if userId is invalid (not uuid)
   * @throws {NotFoundException} if record with id === userId doesn't exist
   */

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete user' })
  @ApiParam({
    name: 'id',
    description: 'User UUID',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'User successfully deleted',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'User ID is not a valid UUID',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User with specified ID was not found',
  })
  deleteUser(@Param('id') id: string) {
    if (!this.usersService.validateUUID(id)) {
      throw new BadRequestException(ERROR_MESSAGE.INVALID_UUID);
    }

    try {
      this.usersService.deleteUser(id);
    } catch (error) {
      if (error.message === USER_ERROR_MESSAGE.NOT_FOUND)
        throw new NotFoundException(USER_ERROR_MESSAGE.DOES_NOT_EXIST);
    }
  }
}
