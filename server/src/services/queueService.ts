import fs from 'fs/promises';
import path from 'path';
import { TestOutputService } from './testOutputService';
import { TEST_OUTPUT_CONFIG } from '../config/testOutput';

interface QueueConfig {
  maxConcurrent: number;
  retryAttempts: number;
  retryDelay: number; // milliseconds
  pollInterval: number; // milliseconds
}

export class QueueService {
  private isProcessing: boolean = false;
  private testOutput: TestOutputService;

  constructor(
    private config: QueueConfig = {
      maxConcurrent: 3,
      retryAttempts: 3,
      retryDelay: 5000,
      pollInterval: 1000
    }
  ) {
    this.testOutput = new TestOutputService();
  }

  async startProcessing(): Promise<void> {
    if (this.isProcessing) return;
    
    this.isProcessing = true;
    
    try {
      // Recover any stuck jobs first
      await this.recoverStuckJobs();

      while (this.isProcessing) {
        const activeJobs = await this.getActiveJobs();
        
        if (activeJobs.length < this.config.maxConcurrent) {
          const nextJob = await this.getNextQueuedJob();
          
          if (nextJob) {
            // Process in background without awaiting
            this.processJob(nextJob.videoId).catch(error => {
              console.error(`Failed to process job ${nextJob.videoId}:`, error);
            });
          } else {
            // No jobs to process, wait before checking again
            await this.sleep(this.config.pollInterval);
          }
        } else {
          // Max concurrent jobs running, wait before checking again
          await this.sleep(this.config.pollInterval);
        }
      }
    } catch (error) {
      console.error('Queue processing error:', error);
      this.isProcessing = false;
      throw error; // Re-throw to handle at higher level
    }
  }

  async stopProcessing(): Promise<void> {
    this.isProcessing = false;
  }

  private async processJob(videoId: string, attempt: number = 1): Promise<void> {
    try {
      // Move to processing state
      await this.testOutput.moveToProcessing(videoId);

      // Simulate video processing
      await this.processVideo(videoId);

      // Mark as completed
      await this.testOutput.markAsCompleted(videoId, {
        summary: 'Video analysis complete',
        sentiment: 'positive',
        keywords: ['test'],
        metrics: {
          processingTime: '5.2s',
          confidence: 0.92
        }
      });

    } catch (error) {
      console.error(`Error processing video ${videoId}:`, error);

      if (attempt < this.config.retryAttempts) {
        // Wait before retrying
        await this.sleep(this.config.retryDelay);
        return this.processJob(videoId, attempt + 1);
      }

      // Mark as failed after all retries
      await this.testOutput.markAsFailed(videoId, {
        code: error instanceof Error ? error.name : 'UNKNOWN_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  }

  private async getActiveJobs(): Promise<string[]> {
    try {
      const processingDir = TEST_OUTPUT_CONFIG.PATHS.PROCESSING;
      const files = await fs.readdir(processingDir);
      return files
        .filter(file => file.endsWith('.json'))
        .map(file => file.replace('.json', ''));
    } catch (error) {
      console.error('Error getting active jobs:', error);
      return [];
    }
  }

  private async getNextQueuedJob(): Promise<{ videoId: string } | null> {
    try {
      const queueDir = TEST_OUTPUT_CONFIG.PATHS.QUEUE;
      const files = await fs.readdir(queueDir);
      const jsonFiles = files.filter(file => file.endsWith('.json'));
      
      if (jsonFiles.length === 0) return null;
      
      // Get oldest file based on creation time
      const fileStats = await Promise.all(
        jsonFiles.map(async file => ({
          file,
          stat: await fs.stat(path.join(queueDir, file))
        }))
      );
      
      const oldestFile = fileStats
        .sort((a, b) => a.stat.ctimeMs - b.stat.ctimeMs)[0];
      
      return {
        videoId: oldestFile.file.replace('.json', '')
      };
    } catch (error) {
      console.error('Error getting next queued job:', error);
      return null;
    }
  }

  private async recoverStuckJobs(): Promise<void> {
    try {
      const processingJobs = await this.getActiveJobs();
      
      for (const videoId of processingJobs) {
        const processingPath = path.join(TEST_OUTPUT_CONFIG.PATHS.PROCESSING, `${videoId}.json`);
        const stat = await fs.stat(processingPath);
        
        // If job has been processing for more than 5 minutes, consider it stuck
        const isStuck = Date.now() - stat.ctimeMs > 5 * 60 * 1000;
        
        if (isStuck) {
          await this.logEvent({
            level: 'warn',
            event: 'STUCK_JOB_DETECTED',
            videoId,
            details: { processingTime: Date.now() - stat.ctimeMs }
          });
          
          await this.testOutput.moveToQueue(videoId);
          
          await this.logEvent({
            level: 'info',
            event: 'JOB_RECOVERED',
            videoId,
            details: { action: 'moved_to_queue' }
          });
        }
      }
    } catch (error) {
      await this.logEvent({
        level: 'error',
        event: 'RECOVERY_FAILED',
        videoId: 'system',
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      });
    }
  }

  private async retryFailedJob(videoId: string): Promise<void> {
    try {
      await this.logEvent({
        level: 'info',
        event: 'RETRY_ATTEMPT',
        videoId,
        details: { attempt: 1 }
      });
      
      await this.testOutput.moveToQueue(videoId);
    } catch (error) {
      await this.logEvent({
        level: 'error',
        event: 'RETRY_FAILED',
        videoId,
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      });
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async processVideo(videoId: string): Promise<void> {
    const steps = [
      { name: 'initialize', weight: 10 },
      { name: 'fetchMetadata', weight: 20 },
      { name: 'analyzeContent', weight: 40 },
      { name: 'generateSummary', weight: 20 },
      { name: 'finalize', weight: 10 }
    ];

    let completedWeight = 0;

    for (const step of steps) {
      try {
        // Simulate step processing
        await this.sleep(1000);
        
        // Update progress
        completedWeight += step.weight;
        const progress = Math.round(completedWeight);
        
        // Update progress in file
        await this.testOutput.updateProgress(videoId, {
          progress,
          currentStep: step.name,
          message: `Processing: ${step.name}`
        });

      } catch (error) {
        console.error(`Error in step ${step.name}:`, error);
        throw error;
      }
    }
  }
} 