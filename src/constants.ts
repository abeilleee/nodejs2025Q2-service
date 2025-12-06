export const enum ERROR_MESSAGE {
  NOT_FOUND = 'Not found',
  INVALID_UUID = 'Invalid ID',
  DOES_NOT_EXIST = 'does not exist',
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
