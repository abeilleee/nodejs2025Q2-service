export interface Album {
  id: string;
  name: string;
  year: number;
  /**
   *  refers to Artist
   */
  artistId: string | null;
}
