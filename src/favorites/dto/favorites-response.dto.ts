import { IsArray } from 'class-validator';

export class FavoritesResponseDto {
  @IsArray()
  artists: Artist[];

  @IsArray()
  albums: Album[];

  @IsArray()
  tracks: Track[];
}
