import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FavoritesService } from 'src/favorites/favorites.service';
import { TracksService } from 'src/tracks/tracks.service';
import { ERROR_MESSAGE } from 'src/constants';
import { BaseService } from 'src/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';

@Injectable()
export class AlbumsService extends BaseService<Album> {
  constructor(
    @Inject(forwardRef(() => TracksService))
    private readonly tracksService: TracksService,

    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
  ) {
    super();
  }

  public getAlbumsMap() {
    return this.items;
  }

  public create(createAlbumDto: CreateAlbumDto) {
    const id = this.generateId();
    const album: Album = {
      id,
      ...createAlbumDto,
    };

    this.items.set(id, album);

    return album;
  }

  public update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const album = this.items.get(id);

    if (!album) {
      throw new NotFoundException(ERROR_MESSAGE.NOT_FOUND);
    }

    album.name = updateAlbumDto.name;
    album.year = updateAlbumDto.year;
    if (updateAlbumDto.artistId) album.artistId = updateAlbumDto.artistId;

    this.items.set(id, album);

    return album;
  }

  public delete(id: string) {
    const album = this.items.get(id);

    if (!album) throw new Error(ERROR_MESSAGE.NOT_FOUND);

    this.favoritesService.removeFavoriteItem({ id, category: 'albums' });
    this.tracksService.removeAlbumReference(id);
    this.items.delete(id);
  }

  public removeArtistReference(artistId: string) {
    for (const album of this.items.values()) {
      if (album.artistId === artistId) {
        album.artistId = null;
      }
    }
  }
}
