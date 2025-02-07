// Processing stages for detailed analysis
export type ProcessingStage = 'pending' | 'processing' | 'completed' | 'failed';

// Video processing status
export type VideoStatus = 
  | 'queued'      // Initial state
  | 'processing'  // Currently being worked on
  | 'stalled'     // No progress for >5 mins
  | 'failed'      // Error occurred
  | 'completed'   // Successfully processed
  | 'archived'    // User archived
  | 'deleted';    // Marked for deletion

// Processing stages tracking
export interface ProcessingStages {
  download: ProcessingStage;
  audioExtraction: ProcessingStage;
  transcription: ProcessingStage;
  visualAnalysis: ProcessingStage;
  finalSummary: ProcessingStage;
}

// Author information
export interface VideoAuthor {
  name: string;
  url: string;
}

// Test video metadata and status
export interface TestVideo {
  videoId: string;
  status: VideoStatus;
  queuePosition?: number;
  stages: ProcessingStages;
  createdAt: string;
  updatedAt: string;
  startedAt?: string;      // When processing began
  stalledAt?: string;      // When detected as stalled
  completedAt?: string;    // When processing completed
  archivedAt?: string;     // When user archived
  deleteAfter?: string;    // When to auto-delete
  author: VideoAuthor;
  description: string;
  hashtags: string[];
  thumbnail?: string;
  aiSummary?: string;
  detailedAnalysis?: {
    transcription?: string;
    visualContent?: string;
    audioAnalysis?: string;
    finalSummary?: string;
  };
}

// Response from the API when fetching videos
export interface TestVideoResponse {
  videos: TestVideo[];
  total: number;
  page: number;
  pageSize: number;
} 