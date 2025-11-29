import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { ERROR_MESSAGE } from 'src/constants';

@Controller('album')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  /**
   * Get all albums
   *
   * @method GET
   * @endpoint /album
   */

  @Get()
  getAll() {
    return this.albumsService.getAll();
  }

  /**
   * Get single album by id
   *
   * @method GET
   * @endpoint /album/:id
   * @throws {BadRequestException} if albumId is invalid (not uuid)
   * @throws {NotFoundException} if record with id === albumId doesn't exist
   */

  @Get(':id')
  getSingleAlbum(@Param('id') id: string) {
    if (!this.albumsService.validateUUID(id)) {
      throw new BadRequestException(ERROR_MESSAGE.INVALID_UUID);
    }

    const album = this.albumsService.getById(id);

    if (!album) {
      throw new NotFoundException(
        `Album with provided id ${ERROR_MESSAGE.DOES_NOT_EXIST}`,
      );
    }

    return album;
  }

  /**
   * Create new album
   *
   * @method POST
   * @endpoint /album
   * @throws {BadRequestException} if request body does not contain required fields
   */

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createAlbumDto: CreateAlbumDto) {
    return this.albumsService.create(createAlbumDto);
  }

  /**
   * Update album info
   *
   * @method PUT
   * @endpoint /album/:id
   * @throws {BadRequestException} if albumId is invalid (not uuid)
   * @throws {NotFoundException} if record with id === albumId doesn't exist
   */

  @Put(':id')
  update(@Param('id') id: string, @Body() updateAlbumDto: UpdateAlbumDto) {
    if (!this.albumsService.validateUUID(id)) {
      throw new BadRequestException(ERROR_MESSAGE.INVALID_UUID);
    }

    try {
      const album = this.albumsService.update(id, updateAlbumDto);
      return album;
    } catch (error) {
      if (error.message === ERROR_MESSAGE.NOT_FOUND)
        throw new NotFoundException(
          `Album with provided id ${ERROR_MESSAGE.DOES_NOT_EXIST}`,
        );
    }
  }

  /**
   * Delete album
   *
   * @method DELETE
   * @endpoint /album/:id
   * @returns {void} 204 if the record is found and deleted
   * @throws {BadRequestException} if albumId is invalid (not uuid)
   * @throws {NotFoundException} if record with id === albumId doesn't exist
   */

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    if (!this.albumsService.validateUUID(id)) {
      throw new BadRequestException(ERROR_MESSAGE.INVALID_UUID);
    }

    try {
      this.albumsService.delete(id);
    } catch (error) {
      if (error.message === ERROR_MESSAGE.NOT_FOUND)
        throw new NotFoundException(
          `Album with provided id ${ERROR_MESSAGE.DOES_NOT_EXIST}`,
        );

      throw new BadRequestException(error.message);
    }
  }
}
