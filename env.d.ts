declare namespace NodeJS {
  interface ProcessEnv {
    PORT: number;
    CRYPT_SALT: number;
    JWT_SECRET_KEY: string;
    JWT_SECRET_REFRESH_KEY: string;
    TOKEN_EXPIRE_TIME: string;
    TOKEN_REFRESH_EXPIRE_TIME: string;
    POSTGRES_PORT: string;
    POSTGRES_DB: string;
    POSTGRES_USER: string;
    POSTGRES_PASSWORD: string;
    DATABASE_URL: string;
  }
}
