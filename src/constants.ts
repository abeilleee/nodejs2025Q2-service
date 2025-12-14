export const LOGS_DIRECTORY = 'logs';
export const MAX_FILE_SIZE_KB = 1024;
export const SENSITIVE_DATA = [
  'password',
  'token',
  'refreshToken',
  'oldPassword',
  'newPassword',
];
export const HIDDEN = '***HIDDEN***';

export const enum ERROR_MESSAGE {
  NOT_FOUND = 'Not found',
  INVALID_UUID = 'Invalid ID',
  DOES_NOT_EXIST = 'does not exist',
  HTTP_ERROR = 'Http Error',
  UNKNOWN_ERROR = 'Unknown error',
  INTERNAL_SERVER_ERROR = 'Internal server error',
  TOKEN_EXPIRED = 'Token has expired',
  INVALID_TOKEN = 'Invalid token',
  VALIDATION_FAILED = 'Refresh token validation failed',
}

export const enum USER_ERROR_MESSAGE {
  DOES_NOT_EXIST = 'User with provided ID does not exist',
  NOT_FOUND = 'User was not found',
  OLD_PASSWORD_INCORRECT = 'Old password is incorrect',
  USER_ALREADY_EXISTS = 'User with provided ID is already exists',
}

export const enum PRISMA_ERROR {
  CONSTRAINT_ERROR = 'P2002',
  QUERY_ERROR = 'P2025',
}

export const LOG_FILE_NAME = {
  APP: 'app.log',
  ERROR: 'error.log',
};

export enum LOG_LEVEL {
  ERROR = 0,
  WARN = 1,
  LOG = 2,
  DEBUG = 3,
  VERBOSE = 4,
}

export const LOG_LEVEL_NAMES = {
  [LOG_LEVEL.ERROR]: 'ERROR',
  [LOG_LEVEL.WARN]: 'WARN',
  [LOG_LEVEL.LOG]: 'LOG',
  [LOG_LEVEL.DEBUG]: 'DEBUG',
  [LOG_LEVEL.VERBOSE]: 'VERBOSE',
};
