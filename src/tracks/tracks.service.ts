import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/prisma.service';
import { ERROR_MESSAGE } from '../constants';
import { FavoritesService } from '../favorites/favorites.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';

@Injectable()
export class TracksService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
  ) {}

  public async getAll() {
    return await this.prisma.track.findMany();
  }

  public async getById(id: string) {
    const track = await this.prisma.track.findUnique({
      where: { id },
    });

    return track;
  }

  public async create(createTrackDto: CreateTrackDto) {
    const track = await this.prisma.track.create({
      data: {
        ...createTrackDto,
        artistId: createTrackDto.artistId ?? null,
        albumId: createTrackDto.albumId ?? null,
      },
    });

    return track;
  }

  public async update(id: string, updateTrackDto: UpdateTrackDto) {
    const track = await this.prisma.track.findUnique({
      where: { id },
    });

    if (!track) throw new Error(ERROR_MESSAGE.NOT_FOUND);

    return this.prisma.track.update({
      where: { id },
      data: {
        ...updateTrackDto,
        artistId: updateTrackDto.artistId ?? null,
        albumId: updateTrackDto.albumId ?? null,
      },
    });
  }

  public async delete(id: string) {
    const track = await this.prisma.track.findUnique({
      where: { id },
    });

    if (!track) throw new Error(ERROR_MESSAGE.NOT_FOUND);

    await this.prisma.track.delete({
      where: { id },
    });
  }
}
