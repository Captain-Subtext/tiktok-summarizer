export type TestOutputStatus = 'queued' | 'processing' | 'completed' | 'failed';

// Base interface for common properties
interface BaseTestOutput {
  videoId: string;
  url: string;
  status: TestOutputStatus;
  notifyEmail?: string;
}

// Queue entry interface
export interface QueuedOutput extends BaseTestOutput {
  status: 'queued';
  queuedAt: string;
}

// Processing entry interface
export interface ProcessingOutput extends BaseTestOutput {
  status: 'processing';
  startedAt: string;
  progress: number;
  currentStep?: string;
  statusMessage?: string;
  updatedAt?: string;
}

// Completed entry interface
export interface CompletedOutput extends BaseTestOutput {
  status: 'completed';
  completedAt: string;
  result: {
    summary: string;
    sentiment: 'positive' | 'negative' | 'neutral';
    keywords: string[];
    metrics: {
      processingTime: string;
      confidence: number;
    };
  };
}

// Failed entry interface
export interface FailedOutput extends BaseTestOutput {
  status: 'failed';
  queuedAt: string;
  failedAt: string;
  error: {
    code: string;
    message: string;
  };
}

export type TestOutput = QueuedOutput | ProcessingOutput | CompletedOutput | FailedOutput; 