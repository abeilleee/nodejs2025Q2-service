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
import { ArtistsService } from './artists.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { ERROR_MESSAGE } from 'src/constants';
import { UpdateArtistInfoDto } from './dto/update-artist-info.dto';

@Controller('artists')
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  /**
   * Get all artists
   *
   * @method GET
   * @endpoint /artist
   */

  @Get()
  getAll() {
    return this.artistsService.getAll();
  }

  /**
   * Get single artist by id
   *
   * @method GET
   * @endpoint /artist/:id
   * @throws {BadRequestException} if artistId is invalid (not uuid)
   * @throws {NotFoundException} if record with id === artistId doesn't exist
   */

  @Get(':id')
  getSingleArtist(id: string) {
    if (!this.artistsService.validateUUID(id)) {
      throw new BadRequestException(ERROR_MESSAGE.INVALID_UUID);
    }

    const artist = this.artistsService.getById(id);

    if (!artist) {
      throw new NotFoundException(
        `Artist with provided id ${ERROR_MESSAGE.DOES_NOT_EXIST}`,
      );
    }

    return artist;
  }

  /**
   * Create new artist
   *
   * @method POST
   * @endpoint /artist
   * @throws {BadRequestException} if request body does not contain required fields
   */

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createArtistDto: CreateArtistDto): Artist {
    return this.artistsService.create(createArtistDto);
  }

  /**
   * Update artist info
   *
   * @method PUT
   * @endpoint /artist/:id
   * @throws {BadRequestException} if artist is invalid (not uuid)
   * @throws {NotFoundException} if record with id === artistId doesn't exist
   */

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateArtistInfoDto: UpdateArtistInfoDto,
  ) {
    if (!this.artistsService.validateUUID(id)) {
      throw new BadRequestException(ERROR_MESSAGE.INVALID_UUID);
    }

    try {
      const artist = this.artistsService.update(id, updateArtistInfoDto);
      return artist;
    } catch (error) {
      if (error.message === ERROR_MESSAGE.NOT_FOUND)
        throw new NotFoundException(
          `Artist with provided id ${ERROR_MESSAGE.DOES_NOT_EXIST}`,
        );
    }
  }

  /**
   * Delete artist
   *
   * @method DELETE
   * @endpoint /artist/:id
   * @returns {void} 204 if the record is found and deleted
   * @throws {BadRequestException} if artist is invalid (not uuid)
   * @throws {NotFoundException} if record with id === artistId doesn't exist
   */

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(id: string): void {
    if (!this.artistsService.validateUUID(id)) {
      throw new BadRequestException(ERROR_MESSAGE.INVALID_UUID);
    }

    try {
      this.artistsService.delete(id);
    } catch (error) {
      if (error.message === ERROR_MESSAGE.NOT_FOUND)
        throw new NotFoundException(
          `Artist with provided id ${ERROR_MESSAGE.DOES_NOT_EXIST}`,
        );
    }
  }
}
