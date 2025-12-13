import {
  statSync,
  appendFileSync,
  renameSync,
  writeFileSync,
  existsSync,
} from 'node:fs';
import { join, basename } from 'node:path';
import { Injectable, LoggerService } from '@nestjs/common';
import {
  MAX_FILE_SIZE_KB,
  LOG_DIRECTORY,
  LOG_FILE_NAME,
  LOG_LEVEL,
} from '../constants';

@Injectable()
export class LoggingService implements LoggerService {
  private context?: string;
  private mainLogFile: string;
  private errorLogFile: string;
  private maxFileSizeKB: number;
  private currentLogLevel: LOG_LEVEL;

  constructor() {
    this.currentLogLevel = this.getLogLevelFromEnv();
    (this.maxFileSizeKB = process.env.LOG_MAX_FILE_SIZE_KB || MAX_FILE_SIZE_KB),
      (this.mainLogFile = join(LOG_DIRECTORY, LOG_FILE_NAME.APP));
    this.errorLogFile = join(LOG_DIRECTORY, LOG_FILE_NAME.ERROR);
    this.initializeLogFiles();
  }

  public setContext(context: string) {
    this.context = context;
  }

  public error(message: unknown, error?: Error | unknown) {
    this.writeLog(LOG_LEVEL.ERROR, message, error);
  }

  public warn(message: unknown) {
    this.writeLog(LOG_LEVEL.WARN, message);
  }

  public log(message: unknown) {
    this.writeLog(LOG_LEVEL.LOG, message);
  }

  public debug(message: unknown) {
    this.writeLog(LOG_LEVEL.DEBUG, message);
  }

  public verbose(message: unknown) {
    this.writeLog(LOG_LEVEL.VERBOSE, message);
  }

  private initializeLogFiles() {
    try {
      const files = [this.mainLogFile, this.errorLogFile];

      for (const file of files) {
        if (!existsSync(file)) {
          writeFileSync(file, '', 'utf8');
        } else {
          continue;
        }
      }
    } catch (error) {
      console.error('Error while creating log files');
    }
  }

  private async writeLog(
    level: LOG_LEVEL,
    message: unknown,
    error?: Error | unknown,
  ) {
    if (level > this.currentLogLevel) {
      return;
    }

    const timestamp = new Date().toLocaleString();
    const context = this.context ? `[${this.context}] ` : '';
    let logMessage = `${timestamp} ${level} ${context}${message}\n`;

    if (error instanceof Error && error.stack) {
      logMessage += `${error.stack}\n`;
    } else if (error && typeof error === 'object') {
      try {
        logMessage += `Details: ${JSON.stringify(error, null, 2)}\n`;
      } catch {
        logMessage += `Details: [Unserializable object]\n`;
      }
    }

    console.log(logMessage.trim());

    try {
      this.checkFileSize();
      appendFileSync(this.mainLogFile, logMessage, 'utf8');

      if (level === LOG_LEVEL.ERROR) {
        appendFileSync(this.errorLogFile, logMessage, 'utf8');
      }
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  private checkFileSize() {
    const files = [this.mainLogFile, this.errorLogFile];

    for (const filePath of files) {
      try {
        const stats = statSync(filePath);
        const fileSizeKB = stats.size / Number(MAX_FILE_SIZE_KB);

        if (fileSizeKB > this.maxFileSizeKB) {
          this.rotateFile(filePath);
        }
      } catch (error) {
        continue;
      }
    }
  }

  private rotateFile(filePath: string) {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const newPath = filePath.replace('.log', `.${timestamp}.log`);

      renameSync(filePath, newPath);
      writeFileSync(filePath, '', 'utf8');

      console.log(`Rotate file: ${basename(filePath)}`);
    } catch (error) {
      console.error('Error while rotating file', error);
    }
  }

  private getLogLevelFromEnv() {
    const level = process.env.LOG_LEVEL;

    switch (level) {
      case 'ERROR':
        return LOG_LEVEL.ERROR;

      case 'WARN':
        return LOG_LEVEL.WARN;

      case 'LOG':
        return LOG_LEVEL.LOG;

      case 'DEBUG':
        return LOG_LEVEL.DEBUG;

      case 'VERBOSE':
        return LOG_LEVEL.VERBOSE;

      default:
        return LOG_LEVEL.LOG;
    }
  }
}
