import { Injectable, NotFoundException } from '@nestjs/common';
import { ERROR_MESSAGE } from 'src/constants';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { BaseService } from '../common/base.service';

@Injectable()
export class AlbumsService extends BaseService<Album> {
  constructor() {
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

    this.items.delete(id);
  }
}
