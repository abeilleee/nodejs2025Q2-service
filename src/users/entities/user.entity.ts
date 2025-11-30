export interface User {
  id: string;
  login: string;
  password: string;
  /**
   *  integer number, increments on update
   */
  version: number;
  /**
   *  timestamp of creation
   */
  createdAt: number;
  /**
   *  timestamp of last update
   */
  updatedAt: number;
}
