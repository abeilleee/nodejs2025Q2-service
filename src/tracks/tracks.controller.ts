import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TracksService } from './tracks.service';
import { ERROR_MESSAGE } from 'src/constants';
import { UpdateTrackDto } from './dto/update-track.dto';
import { CreateTrackDto } from './dto/create-track.dto';

@Controller('track')
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  /**
   * Get all tracks
   *
   * @method GET
   * @endpoint /track
   */

  @Get()
  getAll() {
    return this.tracksService.getAll();
  }

  /**
   * Get single track by id
   *
   * @method GET
   * @endpoint /track/:id
   * @throws {BadRequestException}  if trackId is invalid (not uuid)
   * @throws {NotFoundException} if record with id === trackId doesn't exist
   */

  @Get(':id')
  getSingleTrack(@Param('id') id: string) {
    if (!this.tracksService.validateUUID(id)) {
      throw new BadRequestException(ERROR_MESSAGE.INVALID_UUID);
    }

    const track = this.tracksService.getById(id);

    if (!track)
      throw new NotFoundException(
        `Track with provided id ${ERROR_MESSAGE.DOES_NOT_EXIST}`,
      );

    return track;
  }

  /**
   * Create track
   *
   * @method POST
   * @endpoint /track
   * @throws {BadRequestException} if request body does not contain required fields
   */

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createTrackDto: CreateTrackDto) {
    return this.tracksService.create(createTrackDto);
  }

  /**
   * Update track
   *
   * @method PUT
   * @endpoint /track/:id
   * @throws {BadRequestException} if trackId is invalid (not uuid)
   * @throws {NotFoundException}  if record with id === trackId doesn't exist
   */

  @Put(':id')
  update(@Param('id') id: string, @Body() updateTrackDto: UpdateTrackDto) {
    if (!this.tracksService.validateUUID(id)) {
      throw new BadRequestException(ERROR_MESSAGE.INVALID_UUID);
    }

    try {
      const track = this.tracksService.update(id, updateTrackDto);
      return track;
    } catch (error) {
      if (error.message === ERROR_MESSAGE.NOT_FOUND)
        throw new NotFoundException(
          `Track with provided id ${ERROR_MESSAGE.DOES_NOT_EXIST}`,
        );
    }
  }

  /**
   * Delete track
   *
   * @method DELETE
   * @endpoint /track/:id
   * @returns {void} 204 if the record is found and deleted
   * @throws {BadRequestException} if trackId is invalid (not uuid)
   * @throws {NotFoundException}  if record with id === trackId doesn't exist
   */

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string) {
    if (!this.tracksService.validateUUID(id)) {
      throw new BadRequestException(ERROR_MESSAGE.INVALID_UUID);
    }

    try {
      this.tracksService.delete(id);
    } catch (error) {
      if (error.message === ERROR_MESSAGE.NOT_FOUND)
        throw new NotFoundException(
          `Track with provided id ${ERROR_MESSAGE.DOES_NOT_EXIST}`,
        );
    }
  }
}
