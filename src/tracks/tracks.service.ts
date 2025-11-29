import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/base.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { ERROR_MESSAGE } from 'src/constants';

@Injectable()
export class TracksService extends BaseService<Track> {
  constructor() {
    super();
  }

  public create(createTrackDto: CreateTrackDto) {
    const id = this.generateId();
    const track: Track = {
      id,
      ...createTrackDto,
    };

    this.items.set(id, track);

    return track;
  }

  public update(id: string, updateTrackDto: UpdateTrackDto) {
    const track = this.items.get(id);

    if (!track) throw new Error(ERROR_MESSAGE.NOT_FOUND);

    track.albumId = updateTrackDto.albumId;
    track.artistId = updateTrackDto.artistId;
    track.name = updateTrackDto.name;

    this.items.set(id, track);

    return track;
  }

  public delete(id: string) {
    const track = this.items.get(id);

    if (!track) throw new Error(ERROR_MESSAGE.NOT_FOUND);

    this.items.delete(id);

    //TODO: удалить из favorites
  }
}
