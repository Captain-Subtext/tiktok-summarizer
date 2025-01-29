import type { TestOutput, QueuedOutput, ProcessingOutput, CompletedOutput, FailedOutput } from '../types/TestOutput';

export const TestOutputUtils = {
  // Type guards
  isQueued(data: TestOutput): data is QueuedOutput {
    return data.status === 'queued';
  },

  isProcessing(data: TestOutput): data is ProcessingOutput {
    return data.status === 'processing';
  },

  isCompleted(data: TestOutput): data is CompletedOutput {
    return data.status === 'completed';
  },

  isFailed(data: TestOutput): data is FailedOutput {
    return data.status === 'failed';
  },

  // Time utilities
  getElapsedTime(data: TestOutput): number {
    const startTime = this.isQueued(data) ? data.queuedAt :
      this.isProcessing(data) ? data.startedAt :
      this.isCompleted(data) ? data.completedAt :
      this.isFailed(data) ? data.failedAt : 
      new Date().toISOString();

    return Date.now() - new Date(startTime).getTime();
  },

  // Format utilities
  formatProgress(data: ProcessingOutput): string {
    return `${data.progress}% - ${data.currentStep || 'Processing'}`;
  },

  formatError(data: FailedOutput): string {
    return `${data.error.code}: ${data.error.message}`;
  },

  // Summary utilities
  getSummary(data: TestOutput): string {
    if (this.isQueued(data)) {
      return `Queued at ${new Date(data.queuedAt).toLocaleString()}`;
    }
    if (this.isProcessing(data)) {
      return this.formatProgress(data);
    }
    if (this.isCompleted(data)) {
      return `Completed: ${data.result.summary.substring(0, 100)}...`;
    }
    if (this.isFailed(data)) {
      return this.formatError(data);
    }
    return 'Unknown state';
  }
}; 