interface Track {
  id: string;
  name: string;
  /**
   *  refers to Artist
   */
  artistId: string | null;
  /**
   *  refers to Album
   */
  albumId: string | null;
  /**
   *  timestamp of creation
   */
  duration: number;
}
