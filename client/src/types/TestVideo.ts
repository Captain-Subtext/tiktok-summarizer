// Processing stages for detailed analysis
export type ProcessingStage = 'pending' | 'processing' | 'completed' | 'failed';

// Overall video status
export type VideoStatus = 'queued' | 'processing' | 'completed' | 'failed';

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