import { Injectable, NotFoundException } from '@nestjs/common';
import { ERROR_MESSAGE } from 'src/constants';
import { BaseService } from '../common/base.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistInfoDto } from './dto/update-artist-info.dto';

@Injectable()
export class ArtistsService extends BaseService<Artist> {
  constructor() {
    super();
  }

  public getArtistsMap() {
    return this.items;
  }

  public create(createArtistDto: CreateArtistDto) {
    const id = this.generateId();
    const artist: Artist = {
      id,
      ...createArtistDto,
    };

    this.items.set(id, artist);
    return artist;
  }

  public update(id: string, updateArtistInfoDto: UpdateArtistInfoDto) {
    const artist = this.items.get(id);

    if (!artist) {
      throw new NotFoundException(ERROR_MESSAGE.NOT_FOUND);
    }

    if (updateArtistInfoDto.name !== undefined)
      artist.name = updateArtistInfoDto.name;

    if (updateArtistInfoDto.grammy !== undefined)
      artist.grammy = updateArtistInfoDto.grammy;

    this.items.set(id, artist);

    return artist;
  }

  public delete(id: string) {
    const artist = this.items.get(id);

    if (!artist) throw new Error(ERROR_MESSAGE.NOT_FOUND);

    this.items.delete(id);
  }
}
