import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { LoggingService } from '../logging/logging.service';
import { ERROR_MESSAGE } from '../constants';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private logger: LoggingService;

  constructor() {
    this.logger = new LoggingService();
    this.logger.setContext('ExceptionFilter');
  }

  public catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const { statusCode, message } = this.getErrorInfo(exception);

    this.logError(exception, request, statusCode);

    response.status(statusCode).json({
      statusCode,
      message:
        statusCode >= HttpStatus.INTERNAL_SERVER_ERROR
          ? ERROR_MESSAGE.INTERNAL_SERVER_ERROR
          : message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  private getErrorInfo(exception: unknown) {
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const response = exception.getResponse();

      return {
        statusCode: status,
        message: this.extractMessageFromResponse(response),
      };
    }

    if (exception instanceof Error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: exception.message || ERROR_MESSAGE.UNKNOWN_ERROR,
      };
    }

    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    };
  }

  private extractMessageFromResponse(response: string | object) {
    if (typeof response === 'string') {
      return response;
    }

    if (typeof response === 'object' && response !== null) {
      const errorObj = response as Record<string, unknown>;

      if (typeof errorObj.message === 'string') {
        return errorObj.message;
      }
    }

    return ERROR_MESSAGE.HTTP_ERROR;
  }

  private logError(exception: unknown, request: Request, statusCode: number) {
    const errorMessage = this.getErrorMessage(exception);

    if (statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `${request.method} ${request.url} - ${statusCode}: ${errorMessage}`,
        exception instanceof Error ? exception : undefined,
      );
    } else if (statusCode >= HttpStatus.BAD_REQUEST) {
      this.logger.warn(
        `${request.method} ${request.url} - ${statusCode}: ${errorMessage}`,
      );
    } else {
      this.logger.debug(
        `${request.method} ${request.url} - ${statusCode}: ${errorMessage}`,
      );
    }
  }

  private getErrorMessage(exception: unknown) {
    if (exception instanceof Error) {
      return exception.message;
    }

    if (typeof exception === 'string') {
      return exception;
    }

    if (exception !== null && typeof exception === 'object') {
      return JSON.stringify(exception);
    }

    return String(exception);
  }
}
