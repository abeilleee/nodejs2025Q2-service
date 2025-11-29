import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/base.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { ERROR_MESSAGE } from 'src/constants';
import { FavoritesService } from 'src/favorites/favorites.service';

@Injectable()
export class TracksService extends BaseService<Track> {
  constructor(
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
  ) {
    super();
  }

  public getTracksMap() {
    return this.items;
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

    this.favoritesService.removeFavoriteItem({ id, category: 'tracks' });
    this.items.delete(id);
  }

  public removeArtistReference(artistId: string): void {
    for (const track of this.items.values()) {
      if (track.artistId === artistId) {
        track.artistId = null;
      }
    }
  }

  public removeAlbumReference(albumId: string): void {
    for (const track of this.items.values()) {
      if (track.albumId === albumId) {
        track.albumId = null;
      }
    }
  }
}
