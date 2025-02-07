import { z } from 'zod';

export const VideoStatusSchema = z.enum([
  'queued',      // Initial state
  'processing',  // Currently being worked on
  'stalled',     // No progress for >5 mins
  'failed',      // Error occurred
  'completed',   // Successfully processed
  'archived',    // User archived
  'deleted'      // Marked for deletion
]);

export const VideoQuerySchema = z.object({
  status: VideoStatusSchema.optional(),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(10)
});

export const VideoParamsSchema = z.object({
  videoId: z.string().min(1)
});

export type VideoStatus = z.infer<typeof VideoStatusSchema>;
export type VideoQuery = z.infer<typeof VideoQuerySchema>;
export type VideoParams = z.infer<typeof VideoParamsSchema>;

export interface TestVideo {
  id: number;
  videoId: string;
  status: VideoStatus;
  author?: {
    name: string;
    url: string;
  };
  description: string;
  hashtags: string[];
  thumbnail: string | null;
  createdAt: Date;
  analysis?: {
    summary: string;
  };
} 