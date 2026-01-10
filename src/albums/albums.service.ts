import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/prisma.service';
import { FavoritesService } from '../favorites/favorites.service';
import { TracksService } from '../tracks/tracks.service';
import { ERROR_MESSAGE } from '../constants';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Injectable()
export class AlbumsService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => TracksService))
    private readonly tracksService: TracksService,

    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
  ) {}

  public async getAll() {
    return await this.prisma.album.findMany();
  }

  public async getById(id: string) {
    const album = await this.prisma.album.findUnique({
      where: { id },
    });

    return album;
  }

  public async create(createAlbumDto: CreateAlbumDto) {
    return await this.prisma.album.create({
      data: { ...createAlbumDto, artistId: createAlbumDto.artistId ?? null },
    });
  }

  public async update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const album = await this.prisma.album.findUnique({
      where: { id },
    });

    if (!album) {
      throw new Error(ERROR_MESSAGE.NOT_FOUND);
    }

    return await this.prisma.album.update({
      where: { id },
      data: {
        ...updateAlbumDto,
        artistId: updateAlbumDto.artistId ?? null,
      },
    });
  }

  public async delete(id: string) {
    const album = await this.prisma.album.findUnique({
      where: { id },
    });

    if (!album) throw new Error(ERROR_MESSAGE.NOT_FOUND);

    await this.prisma.album.delete({
      where: { id },
    });
  }
}
