import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  HttpCode,
  HttpStatus,
  NotFoundException,
  UnprocessableEntityException,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { ERROR_MESSAGE } from '../constants';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  /**
   * Get all favorites
   *
   * @method GET
   * @endpoint /favs
   * @returns {FavoritesResponse} all favorite records split by entity type
   */
  @Get()
  async getAll() {
    return await this.favoritesService.getAll();
  }

  /**
   * Add track to favorites
   *
   * @method POST
   * @endpoint /favs/track/:id
   * @throws {BadRequestException} if trackId is invalid (not uuid)
   * @throws {UnprocessableEntityException} if track with id === trackId doesn't exist
   */
  @Post('track/:id')
  @HttpCode(HttpStatus.CREATED)
  async addTrack(@Param('id', ParseUUIDPipe) id: string) {
    try {
      await this.favoritesService.addTrack(id);
      return { message: 'Track added to favorites successfully' };
    } catch (error) {
      if (error.message === ERROR_MESSAGE.NOT_FOUND) {
        throw new UnprocessableEntityException(
          `Track with provided id ${ERROR_MESSAGE.DOES_NOT_EXIST}`,
        );
      }

      throw error;
    }
  }

  /**
   * Delete track from favorites
   *
   * @method DELETE
   * @endpoint /favs/track/:id
   * @returns {void} 204 if the track was in favorites and now it's deleted id is found and deleted
   * @throws {BadRequestException} if trackId is invalid (not uuid)
   * @throws {NotFoundException} if corresponding track is not favorite
   */
  @Delete('track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeTrack(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.favoritesService.removeFavoriteItem({
      id,
      category: 'tracks',
    });

    if (!result) {
      throw new NotFoundException('Track was not found in favorites');
    }

    return;
  }

  /**
   * Add album to favorites
   *
   * @method POST
   * @endpoint /favs/album/:id
   * @throws {BadRequestException} if albumId is invalid (not uuid)
   * @throws {UnprocessableEntityException} if album with id === albumId doesn't exist
   */
  @Post('album/:id')
  @HttpCode(HttpStatus.CREATED)
  async addAlbum(@Param('id', ParseUUIDPipe) id: string) {
    try {
      await this.favoritesService.addAlbum(id);
      return { message: 'Album added to favorites successfully' };
    } catch (error) {
      if (error.message === ERROR_MESSAGE.NOT_FOUND) {
        throw new UnprocessableEntityException(
          `Album with provided id ${ERROR_MESSAGE.DOES_NOT_EXIST}`,
        );
      }

      throw error;
    }
  }

  /**
   * Delete album from favorites
   *
   * @method DELETE
   * @endpoint /favs/album/:id
   * @returns {void} 204 if the album was in favorites and now it's deleted
   * @throws {BadRequestException} if albumId is invalid (not uuid)
   * @throws {NotFoundException} if corresponding album is not favorite
   */
  @Delete('album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeAlbum(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.favoritesService.removeFavoriteItem({
      id,
      category: 'albums',
    });

    if (!result) {
      throw new NotFoundException('Album not found in favorites');
    }

    return;
  }

  /**
   * Add artist to favorites
   *
   * @method POST
   * @endpoint /favs/artist/:id
   * @throws {BadRequestException} if artistId is invalid (not uuid)
   * @throws {UnprocessableEntityException} if artist with id === artistId doesn't exist
   */
  @Post('artist/:id')
  @HttpCode(HttpStatus.CREATED)
  async addArtist(@Param('id', ParseUUIDPipe) id: string) {
    try {
      await this.favoritesService.addArtist(id);
      return { message: 'Artist added to favorites successfully' };
    } catch (error) {
      if (error.message === ERROR_MESSAGE.NOT_FOUND) {
        throw new UnprocessableEntityException(
          `Artist with provided id ${ERROR_MESSAGE.DOES_NOT_EXIST}`,
        );
      }

      throw error;
    }
  }

  /**
   * Delete artist from favorites
   *
   * @method DELETE
   * @endpoint /favs/artist/:id
   * @returns {void} 204 if the artist was in favorites and now it's deleted
   * @throws {BadRequestException} if artistId is invalid (not uuid)
   * @throws {NotFoundException} if corresponding artist is not favorite
   */
  @Delete('artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeArtist(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.favoritesService.removeFavoriteItem({
      id,
      category: 'artists',
    });

    if (!result) {
      throw new NotFoundException('Artist not found in favorites');
    }

    return;
  }
}
