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
  NotFoundException,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { ERROR_MESSAGE } from '../constants';
import { UpdateArtistInfoDto } from './dto/update-artist-info.dto';

@Controller('artist')
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  /**
   * Get all artists
   *
   * @method GET
   * @endpoint /artist
   */

  @Get()
  async getAll() {
    return await this.artistsService.getAll();
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
  async getSingleArtist(@Param('id', ParseUUIDPipe) id: string) {
    const artist = await this.artistsService.getById(id);

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
  async create(@Body() createArtistDto: CreateArtistDto) {
    return await this.artistsService.create(createArtistDto);
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
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateArtistInfoDto: UpdateArtistInfoDto,
  ) {
    try {
      const artist = await this.artistsService.update(id, updateArtistInfoDto);
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
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    try {
      await this.artistsService.delete(id);
    } catch (error) {
      if (error.message === ERROR_MESSAGE.NOT_FOUND)
        throw new NotFoundException(
          `Artist with provided id ${ERROR_MESSAGE.DOES_NOT_EXIST}`,
        );
    }
  }
}
