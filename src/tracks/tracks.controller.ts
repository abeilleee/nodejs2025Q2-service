import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { TracksService } from './tracks.service';
import { ERROR_MESSAGE } from '../constants';
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
  async getAll() {
    return await this.tracksService.getAll();
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
  async getSingleTrack(@Param('id', ParseUUIDPipe) id: string) {
    const track = await this.tracksService.getById(id);

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
  async create(@Body() createTrackDto: CreateTrackDto) {
    return await this.tracksService.create(createTrackDto);
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
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTrackDto: UpdateTrackDto,
  ) {
    try {
      const track = await this.tracksService.update(id, updateTrackDto);
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
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    try {
      await this.tracksService.delete(id);
    } catch (error) {
      if (error.message === ERROR_MESSAGE.NOT_FOUND)
        throw new NotFoundException(
          `Track with provided id ${ERROR_MESSAGE.DOES_NOT_EXIST}`,
        );
    }
  }
}
