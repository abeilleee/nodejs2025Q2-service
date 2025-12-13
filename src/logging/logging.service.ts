import fs from 'node:fs/promises';
import path from 'node:path';
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
    this.logDirectory = path.join(process.cwd(), LOG_DIRECTORY);
    this.mainLogFile = path.join(this.logDirectory, LOG_FILE_NAME.APP);
    this.errorLogFile = path.join(this.logDirectory, LOG_FILE_NAME.ERROR);
  }

  public async initialize() {
    try {
      await fs.mkdir(this.logDirectory, { recursive: true });
    } catch (error) {
      console.error('Failed to initialize logging service:', error);
      throw error;
    }
  }

  public setContext(context: string) {
    this.context = context;
  }

  public error(message: unknown) {
    this.writeLog(LOG_LEVEL.ERROR, message);
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

  private async writeLog(level: LogLevel, message: unknown) {
    const timestamp = new Date().toLocaleString();
    const context = this.context ? `[${this.context}] ` : '';
    const logMessage = `${timestamp} ${level} ${context}${message}\n`;

    console.log(logMessage.trim());

    try {
      await this.checkFileSize();
      await fs.appendFile(this.mainLogFile, logMessage, 'utf8');

      if (level === LOG_LEVEL.ERROR) {
        await fs.appendFile(this.errorLogFile, logMessage, 'utf8');
      }
    } catch (error) {
      console.error('Failed to write to file:', error);
    }
  }

  private async checkFileSize() {
    const files = [this.mainLogFile, this.errorLogFile];

    for (const filePath of files) {
      try {
        const stats = await fs.stat(filePath);

        if (stats.size / Number(MAX_FILE_SIZE_KB) > this.maxFileSizeKB) {
          await this.rotateFile(filePath);
        }
      } catch (error) {
        continue;
      }
    }
  }

  private async rotateFile(filePath: string) {
    try {
      const timestamp = new Date().toLocaleString();
      const newPath = filePath.replace('.log', `.${timestamp}.log`);

      await fs.rename(filePath, newPath);
      await fs.writeFile(filePath, '', 'utf8');

      console.log(`Rotate file: ${path.basename(filePath)}`);
    } catch (error) {
      console.error('Error while rotating file', error);
    }
  }
}
