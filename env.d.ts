declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string;
    CRYPT_SALT: string;
    JWT_SECRET_KEY: string;
    JWT_SECRET_REFRESH_KEY: string;
    TOKEN_EXPIRE_TIME: string;
    TOKEN_REFRESH_EXPIRE_TIME: string;
    POSTGRES_PORT: string;
    POSTGRES_DB: string;
    POSTGRES_USER: string;
    POSTGRES_PASSWORD: string;
    POSTGRES_HOST: string;
    DATABASE_URL: string;
    LOG_LEVEL: 'ERROR' | 'WARN' | 'LOG' | 'DEBUG' | 'VERBOSE';
    LOG_MAX_FILE_SIZE_KB: number;
  }
}
