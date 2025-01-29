import fs from 'fs/promises';
import path from 'path';

export interface TestLogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  event: string;
  videoId: string;
  details: any;
}

export class LogService {
  private logPath: string;

  constructor() {
    this.logPath = path.join(process.cwd(), 'logs', 'test_summarizer.log');
  }

  async log(entry: Omit<TestLogEntry, 'timestamp'>): Promise<void> {
    const logEntry: TestLogEntry = {
      timestamp: new Date().toISOString(),
      ...entry
    };

    const logLine = JSON.stringify(logEntry) + '\n';
    
    try {
      await fs.appendFile(this.logPath, logLine);
    } catch (error) {
      console.error('Failed to write log:', error);
    }
  }
} 