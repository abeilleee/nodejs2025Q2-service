import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../shared/prisma.service';
import { ERROR_MESSAGE } from '../constants';
import { AlbumsService } from '../albums/albums.service';
import { TracksService } from '../tracks/tracks.service';
import { FavoritesService } from '../favorites/favorites.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistInfoDto } from './dto/update-artist-info.dto';

@Injectable()
export class ArtistsService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => AlbumsService))
    private readonly albumsService: AlbumsService,

    @Inject(forwardRef(() => TracksService))
    private readonly tracksService: TracksService,

    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
  ) {}

  public async getAll() {
    return await this.prisma.artist.findMany();
  }

  public async getById(id: string) {
    const artist = await this.prisma.artist.findUnique({
      where: { id },
    });

    return artist;
  }

  public async create(createArtistDto: CreateArtistDto) {
    return await this.prisma.artist.create({ data: createArtistDto });
  }

  public async update(id: string, updateArtistInfoDto: UpdateArtistInfoDto) {
    const artist = await this.prisma.artist.findUnique({
      where: { id },
    });

    if (!artist) {
      throw new NotFoundException(ERROR_MESSAGE.NOT_FOUND);
    }

    return this.prisma.artist.update({
      where: { id },
      data: updateArtistInfoDto,
    });
  }

  public async delete(id: string) {
    const artist = await this.prisma.artist.findUnique({
      where: { id },
    });

    if (!artist) throw new Error(ERROR_MESSAGE.NOT_FOUND);

    await this.prisma.artist.delete({
      where: { id },
    });
  }
}
