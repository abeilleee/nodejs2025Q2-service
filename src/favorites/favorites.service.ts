import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../shared/prisma.service';
import { AlbumsService } from '../albums/albums.service';
import { ArtistsService } from '../artists/artists.service';
import { TracksService } from '../tracks/tracks.service';
import { ERROR_MESSAGE, PRISMA_ERROR } from '../constants';
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
    private prisma: PrismaService,
    @Inject(forwardRef(() => ArtistsService))
    private readonly artistsService: ArtistsService,

    @Inject(forwardRef(() => AlbumsService))
    private readonly albumsService: AlbumsService,

    @Inject(forwardRef(() => TracksService))
    private readonly tracksService: TracksService,
  ) {}

  public async getAll() {
    const [artists, albums, tracks] = await Promise.all([
      this.prisma.artistFavorite.findMany({
        include: { artist: true },
      }),
      this.prisma.albumFavorite.findMany({
        include: { album: true },
      }),
      this.prisma.trackFavorite.findMany({
        include: { track: true },
      }),
    ]);

    return {
      artists: artists.map((data) => data.artist),
      albums: albums.map((data) => data.album),
      tracks: tracks.map((data) => data.track),
    };
  }

  public async addTrack(id: string) {
    const track = await this.tracksService.getById(id);

    if (!track) {
      throw new Error(ERROR_MESSAGE.NOT_FOUND);
    }

    try {
      await this.prisma.trackFavorite.create({
        data: { trackId: id },
      });
    } catch (error) {
      if (error.code !== PRISMA_ERROR.CONSTRAINT_ERROR) {
        throw error;
      }
    }
  }

  public async addArtist(id: string) {
    const artist = await this.artistsService.getById(id);

    if (!artist) {
      throw new Error(ERROR_MESSAGE.NOT_FOUND);
    }

    try {
      await this.prisma.artistFavorite.create({
        data: { artistId: id },
      });
    } catch (error) {
      if (error.code !== PRISMA_ERROR.CONSTRAINT_ERROR) {
        throw error;
      }
    }
  }

  public async addAlbum(id: string) {
    const album = await this.albumsService.getById(id);

    if (!album) {
      throw new Error(ERROR_MESSAGE.NOT_FOUND);
    }

    try {
      await this.prisma.albumFavorite.create({
        data: { albumId: id },
      });
    } catch (error) {
      if (error.code !== PRISMA_ERROR.CONSTRAINT_ERROR) {
        throw error;
      }
    }
  }

  public async removeFavoriteItem({ id, category }: RemoveFavoriteOptions) {
    try {
      switch (category) {
        case 'albums':
          return await this.prisma.albumFavorite.delete({
            where: { albumId: id },
          });

        case 'tracks':
          return await this.prisma.trackFavorite.delete({
            where: { trackId: id },
          });

        case 'artists':
          return await this.prisma.artistFavorite.delete({
            where: { artistId: id },
          });
      }
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PRISMA_ERROR.QUERY_ERROR) {
          return null;
        }

        throw error;
      }
    }
  }
}
