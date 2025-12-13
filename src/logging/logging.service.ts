import { mkdir, stat, appendFile, rename, writeFile } from 'node:fs/promises';
import { join, basename } from 'node:path';
import { Injectable, LoggerService, LogLevel } from '@nestjs/common';
import {
  MAX_FILE_SIZE_KB,
  LOG_DIRECTORY,
  LOG_FILE_NAME,
  LOG_LEVEL,
} from '../constants';

@Injectable()
export class LoggingService implements LoggerService {
  private context?: string;
  private logDirectory: string;
  private mainLogFile: string;
  private errorLogFile: string;
  private maxFileSizeKB: number;

  constructor() {
    this.maxFileSizeKB = parseInt(
      process.env.LOG_MAX_FILE_SIZE_KB || MAX_FILE_SIZE_KB,
    );
    this.logDirectory = join(process.cwd(), LOG_DIRECTORY);
    this.mainLogFile = join(this.logDirectory, LOG_FILE_NAME.APP);
    this.errorLogFile = join(this.logDirectory, LOG_FILE_NAME.ERROR);
  }

  public async initialize() {
    try {
      await mkdir(this.logDirectory, { recursive: true });
    } catch (error) {
      console.error('Failed to initialize logging service:', error);
      throw error;
    }
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

  private async writeLog(
    level: LogLevel,
    message: unknown,
    error?: Error | unknown,
  ) {
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
      await this.checkFileSize();
      await appendFile(this.mainLogFile, logMessage, 'utf8');

      if (level === LOG_LEVEL.ERROR) {
        await appendFile(this.errorLogFile, logMessage, 'utf8');
      }
    } catch (error) {
      console.error('Failed to write to file:', error);
    }
  }

  private async checkFileSize() {
    const files = [this.mainLogFile, this.errorLogFile];

    for (const filePath of files) {
      try {
        const stats = await stat(filePath);
        const fileSizeKB = stats.size / Number(MAX_FILE_SIZE_KB);

        if (fileSizeKB > this.maxFileSizeKB) {
          await this.rotateFile(filePath);
        }
      } catch (error) {
        continue;
      }
    }
  }

  private async rotateFile(filePath: string) {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const newPath = filePath.replace('.log', `.${timestamp}.log`);

      await rename(filePath, newPath);
      await writeFile(filePath, '', 'utf8');

      console.log(`Rotate file: ${basename(filePath)}`);
    } catch (error) {
      console.error('Error while rotating file', error);
    }
  }
}
