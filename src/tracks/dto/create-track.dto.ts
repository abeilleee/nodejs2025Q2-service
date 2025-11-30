import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';

export class CreateTrackDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @ValidateIf((v) => v.artistId !== null)
  @IsUUID()
  artistId: string | null;

  @ValidateIf((v) => v.albumId !== null)
  @IsUUID()
  albumId: string | null;

  @IsNumber()
  @IsPositive()
  duration: number;
}
