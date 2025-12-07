import { forwardRef, Module } from '@nestjs/common';
import { AlbumsModule } from '../albums/albums.module';
import { TracksModule } from '../tracks/tracks.modules';
import { FavoritesModule } from '../favorites/favorites.module';
import { ArtistsController } from './artists.controller';
import { ArtistsService } from './artists.service';

@Module({
  imports: [
    forwardRef(() => AlbumsModule),
    forwardRef(() => TracksModule),
    forwardRef(() => FavoritesModule),
  ],
  controllers: [ArtistsController],
  providers: [ArtistsService],
  exports: [ArtistsService],
})
export class ArtistsModule {}
