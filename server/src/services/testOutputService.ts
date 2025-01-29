import fs from 'fs/promises';
import path from 'path';
import { TEST_OUTPUT_CONFIG } from '../config/testOutput';

// Import interfaces
import type { 
  TestOutput,
  QueuedOutput,
  ProcessingOutput,
  CompletedOutput,
  FailedOutput 
} from '../types/TestOutput';

// Custom error types
export class TestOutputError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'TestOutputError';
  }
}

export class TestOutputService {
  // Add to queue with validation
  async addToQueue(data: QueuedOutput): Promise<void> {
    try {
      this.validateQueueData(data);
      
      const filePath = path.join(TEST_OUTPUT_CONFIG.PATHS.QUEUE, `${data.videoId}.json`);
      
      // Check if already exists in any state
      await this.ensureNotExists(data.videoId);
      
      await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
      throw new TestOutputError(
        `Failed to add video to queue: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'QUEUE_ERROR'
      );
    }
  }

  // Move to processing with checks
  async moveToProcessing(videoId: string, progress: number = 0): Promise<void> {
    try {
      const queuePath = path.join(TEST_OUTPUT_CONFIG.PATHS.QUEUE, `${videoId}.json`);
      const processingPath = path.join(TEST_OUTPUT_CONFIG.PATHS.PROCESSING, `${videoId}.json`);
      
      // Verify video is in queue
      const queueData = await this.readFile<QueuedOutput>(queuePath);
      
      // Check if already processing
      await this.ensureNotInState(videoId, 'processing');
      
      const processingData: ProcessingOutput = {
        ...queueData,
        status: 'processing',
        startedAt: new Date().toISOString(),
        progress
      };

      // Write new file before deleting old one
      await fs.writeFile(processingPath, JSON.stringify(processingData, null, 2));
      await fs.unlink(queuePath);
    } catch (error) {
      throw new TestOutputError(
        `Failed to move video to processing: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'PROCESSING_ERROR'
      );
    }
  }

  // Mark as completed
  async markAsCompleted(videoId: string, result: CompletedOutput['result']): Promise<void> {
    const processingPath = path.join(TEST_OUTPUT_CONFIG.PATHS.PROCESSING, `${videoId}.json`);
    const completedPath = path.join(TEST_OUTPUT_CONFIG.PATHS.COMPLETED, `${videoId}.json`);
    
    const processingData = await this.readFile<ProcessingOutput>(processingPath);
    
    const completedData: CompletedOutput = {
      ...processingData,
      status: 'completed',
      completedAt: new Date().toISOString(),
      result
    };

    await fs.writeFile(completedPath, JSON.stringify(completedData, null, 2));
    await fs.unlink(processingPath);
  }

  // Mark as failed
  async markAsFailed(videoId: string, error: FailedOutput['error']): Promise<void> {
    const processingPath = path.join(TEST_OUTPUT_CONFIG.PATHS.PROCESSING, `${videoId}.json`);
    const failedPath = path.join(TEST_OUTPUT_CONFIG.PATHS.FAILED, `${videoId}.json`);
    
    const processingData = await this.readFile<ProcessingOutput>(processingPath);
    
    const failedData: FailedOutput = {
      ...processingData,
      status: 'failed',
      failedAt: new Date().toISOString(),
      error
    };

    await fs.writeFile(failedPath, JSON.stringify(failedData, null, 2));
    await fs.unlink(processingPath);
  }

  // Move to queue
  async moveToQueue(videoId: string): Promise<void> {
    try {
      // Get the processing file path
      const processingPath = path.join(TEST_OUTPUT_CONFIG.PATHS.PROCESSING, `${videoId}.json`);
      const queuePath = path.join(TEST_OUTPUT_CONFIG.PATHS.QUEUE, `${videoId}.json`);
      
      // Read the processing data
      const processingData = await this.readFile<ProcessingOutput>(processingPath);
      
      // Create queue data
      const queueData: QueuedOutput = {
        videoId: processingData.videoId,
        url: processingData.url,
        status: 'queued',
        queuedAt: new Date().toISOString(),
        notifyEmail: processingData.notifyEmail // Assuming this exists in processing data
      };

      // Write to queue first, then delete from processing
      await fs.writeFile(queuePath, JSON.stringify(queueData, null, 2));
      await fs.unlink(processingPath);
    } catch (error) {
      throw new TestOutputError(
        `Failed to move video to queue: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'QUEUE_MOVE_ERROR'
      );
    }
  }

  // Helper methods
  private async ensureNotExists(videoId: string): Promise<void> {
    const states = ['queue', 'processing', 'completed', 'failed'];
    for (const state of states) {
      const filePath = path.join(TEST_OUTPUT_CONFIG.PATHS[state.toUpperCase()], `${videoId}.json`);
      try {
        await fs.access(filePath);
        throw new Error(`Video already exists in ${state}`);
      } catch (error) {
        // File doesn't exist, which is what we want
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
          throw error;
        }
      }
    }
  }

  private async ensureNotInState(videoId: string, state: string): Promise<void> {
    const filePath = path.join(TEST_OUTPUT_CONFIG.PATHS[state.toUpperCase()], `${videoId}.json`);
    try {
      await fs.access(filePath);
      throw new Error(`Video already in ${state} state`);
    } catch (error) {
      // File doesn't exist, which is what we want
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw error;
      }
    }
  }

  private validateQueueData(data: QueuedOutput): void {
    if (!data.videoId?.match(/^\d+$/)) {
      throw new Error('Invalid videoId format');
    }
    
    if (!data.url?.startsWith('https://')) {
      throw new Error('Invalid URL format');
    }

    if (!data.notifyEmail?.includes('@')) {
      throw new Error('Invalid email format');
    }

    if (data.status !== 'queued') {
      throw new Error(`Invalid status for queue: ${data.status}`);
    }
  }

  private async readFile<T extends TestOutput>(filePath: string): Promise<T> {
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(data) as T;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        throw new Error(`File not found: ${filePath}`);
      }
      throw new Error(`Error reading file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  interface ProgressUpdate {
    progress: number;
    currentStep: string;
    message: string;
  }

  async updateProgress(videoId: string, update: ProgressUpdate): Promise<void> {
    try {
      const processingPath = path.join(TEST_OUTPUT_CONFIG.PATHS.PROCESSING, `${videoId}.json`);
      
      // Read current data
      const processingData = await this.readFile<ProcessingOutput>(processingPath);
      
      // Update progress
      const updatedData: ProcessingOutput = {
        ...processingData,
        progress: update.progress,
        currentStep: update.currentStep,
        statusMessage: update.message,
        updatedAt: new Date().toISOString()
      };

      // Write updated data
      await fs.writeFile(processingPath, JSON.stringify(updatedData, null, 2));
    } catch (error) {
      throw new TestOutputError(
        `Failed to update progress: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'PROGRESS_UPDATE_ERROR'
      );
    }
  }
} 