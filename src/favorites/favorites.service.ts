import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AlbumsService } from 'src/albums/albums.service';
import { ArtistsService } from 'src/artists/artists.service';
import { ERROR_MESSAGE } from 'src/constants';
import { TracksService } from 'src/tracks/tracks.service';

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
    const artists = Object.values(this.favorites.artists).map((id) =>
      this.artistsService.getArtistsMap().get(id),
    );
    const albums = Object.values(this.favorites.albums).map((id) =>
      this.albumsService.getAlbumsMap().get(id),
    );
    const tracks = Object.values(this.favorites.tracks).map((id) =>
      this.tracksService.getTracksMap().get(id),
    );

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
