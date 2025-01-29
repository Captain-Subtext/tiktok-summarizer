import type { 
  TestOutput, 
  QueuedOutput, 
  ProcessingOutput, 
  CompletedOutput, 
  FailedOutput 
} from '../types/TestOutput';

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export const validateTestOutput = {
  queue(data: any): data is QueuedOutput {
    if (!data.videoId || typeof data.videoId !== 'string') {
      throw new ValidationError('Invalid videoId');
    }
    
    if (!data.url || !data.url.startsWith('https://')) {
      throw new ValidationError('Invalid URL format');
    }

    if (data.status !== 'queued') {
      throw new ValidationError('Invalid status for queue entry');
    }

    if (!data.queuedAt || isNaN(Date.parse(data.queuedAt))) {
      throw new ValidationError('Invalid queuedAt timestamp');
    }

    if (data.notifyEmail && !data.notifyEmail.includes('@')) {
      throw new ValidationError('Invalid email format');
    }

    return true;
  },

  processing(data: any): data is ProcessingOutput {
    if (!data.videoId || typeof data.videoId !== 'string') {
      throw new ValidationError('Invalid videoId');
    }

    if (data.status !== 'processing') {
      throw new ValidationError('Invalid status for processing entry');
    }

    if (!data.startedAt || isNaN(Date.parse(data.startedAt))) {
      throw new ValidationError('Invalid startedAt timestamp');
    }

    if (typeof data.progress !== 'number' || data.progress < 0 || data.progress > 100) {
      throw new ValidationError('Invalid progress value');
    }

    return true;
  },

  completed(data: any): data is CompletedOutput {
    if (!data.result || typeof data.result !== 'object') {
      throw new ValidationError('Missing or invalid result object');
    }

    if (!['positive', 'negative', 'neutral'].includes(data.result.sentiment)) {
      throw new ValidationError('Invalid sentiment value');
    }

    if (!Array.isArray(data.result.keywords)) {
      throw new ValidationError('Invalid keywords array');
    }

    if (typeof data.result.metrics?.confidence !== 'number') {
      throw new ValidationError('Invalid confidence value');
    }

    return true;
  }
}; 