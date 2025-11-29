import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AlbumsService } from 'src/albums/albums.service';
import { ArtistsService } from 'src/artists/artists.service';
import { ERROR_MESSAGE } from 'src/constants';
import { TracksService } from 'src/tracks/tracks.service';
import { Favorites } from './entities/favorite.entity';

interface RemoveFavoriteOptions {
  id: string;
  category: keyof Favorites;
}

@Injectable()
export class FavoritesService {
  private favorites = {
    artists: new Set(),
    albums: new Set(),
    tracks: new Set(),
  };

  constructor(
    @Inject(forwardRef(() => ArtistsService))
    private readonly artistsService: ArtistsService,

    @Inject(forwardRef(() => AlbumsService))
    private readonly albumsService: AlbumsService,

    @Inject(forwardRef(() => TracksService))
    private readonly tracksService: TracksService,
  ) {}

  public getAll() {
    const artists = Array.from(this.favorites.artists)
      .map((id: string) => this.artistsService.getArtistsMap().get(id))
      .filter(Boolean);

    const albums = Array.from(this.favorites.albums)
      .map((id: string) => this.albumsService.getAlbumsMap().get(id))
      .filter(Boolean);

    const tracks = Array.from(this.favorites.tracks)
      .map((id: string) => this.tracksService.getTracksMap().get(id))
      .filter(Boolean);

    return { artists, albums, tracks };
  }

  public addTrack(id: string) {
    if (!this.tracksService.getById(id)) {
      throw new Error(ERROR_MESSAGE.NOT_FOUND);
    }

    this.favorites.tracks.add(id);
  }

  public addArtist(id: string) {
    if (!this.validateUUID(id)) {
      throw new Error(ERROR_MESSAGE.INVALID_UUID);
    }

    if (!this.artistsService.getById(id)) {
      throw new Error(ERROR_MESSAGE.NOT_FOUND);
    }

    this.favorites.artists.add(id);
  }

  public addAlbum(id: string): void {
    if (!this.albumsService.getById(id)) {
      throw new Error(ERROR_MESSAGE.NOT_FOUND);
    }

    this.favorites.albums.add(id);
  }

  public removeFavoriteItem({ id, category }: RemoveFavoriteOptions) {
    switch (category) {
      case 'albums':
        return this.favorites.albums.delete(id);

      case 'tracks':
        return this.favorites.tracks.delete(id);

      case 'artists':
        return this.favorites.artists.delete(id);
    }
  }

  public validateUUID(id: string): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  }
}
