import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { CreateArtistDto } from './create-artist.dto';

export class UpdateArtistInfoDto extends CreateArtistDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsBoolean()
  grammy: boolean;
}
