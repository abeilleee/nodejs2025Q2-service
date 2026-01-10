import { forwardRef, Module } from '@nestjs/common';
import { TracksModule } from '../tracks/tracks.modules';
import { FavoritesModule } from '../favorites/favorites.module';
import { AlbumsController } from './albums.controller';
import { AlbumsService } from './albums.service';

@Module({
  imports: [forwardRef(() => TracksModule), forwardRef(() => FavoritesModule)],
  controllers: [AlbumsController],
  providers: [AlbumsService],
  exports: [AlbumsService],
})
export class AlbumsModule {}
