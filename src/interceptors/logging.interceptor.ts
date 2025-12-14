import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { tap } from 'rxjs/operators';
import { LoggingService } from '../logging/logging.service';
import { HIDDEN, SENSITIVE_DATA } from '../constants';

interface NestRequest {
  method: string;
  url: string;
  query: Record<string, any>;
  body: Record<string, any>;
}

interface NestResponse {
  statusCode: number;
}

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger = new LoggingService();

  constructor() {
    this.logger.setContext('HTTP');
  }

  public intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest();
    const start = Date.now();

    this.logRequest(req);

    return next.handle().pipe(
      tap(() => {
        const res = context.switchToHttp().getResponse();
        const time = Date.now() - start;

        this.logResponse(req, res, time);
      }),
    );
  }

  private logRequest(request: NestRequest) {
    let logMsg = `Request: ${request.method} ${request.url}`;
    const queryStr = this.formatQuery(request.query);

    if (queryStr) logMsg += `?${queryStr}`;

    const body = this.hideSensitive(request.body);

    if (body && Object.keys(body).length > 0) {
      logMsg += ` | Body: ${JSON.stringify(body)}`;
    }

    this.logger.log(logMsg);
  }

  private logResponse(
    request: NestRequest,
    response: NestResponse,
    duration: number,
  ) {
    this.logger.log(
      `Response: ${request.method} ${request.url} - Status:${response.statusCode} (${duration}ms)`,
    );
  }

  private formatQuery(query: Record<string, any>) {
    if (!query || Object.keys(query).length === 0) return '';
    return new URLSearchParams(query).toString();
  }

  private hideSensitive(data: unknown) {
    if (!data || typeof data !== 'object') {
      return data;
    }

    const safe = { ...(data as Record<string, unknown>) };

    SENSITIVE_DATA.forEach((field: string) => {
      if (field in safe) {
        safe[field] = HIDDEN;
      }
    });

    return safe;
  }
}
