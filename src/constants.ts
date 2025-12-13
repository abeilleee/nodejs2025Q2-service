export const LOG_DIRECTORY = '/app/logs';
export const MAX_FILE_SIZE_KB = '1024';
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
  VERBOSE = 'verbose',
  DEBUG = 'debug',
  LOG = 'log',
  WARN = 'warn',
  ERROR = 'error',
}
