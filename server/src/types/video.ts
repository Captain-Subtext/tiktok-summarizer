import { z } from 'zod';

export const VideoStatusSchema = z.enum(['processing', 'completed', 'failed']);

export const VideoQuerySchema = z.object({
  status: z.enum(['processing', 'completed', 'failed']).optional(),
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