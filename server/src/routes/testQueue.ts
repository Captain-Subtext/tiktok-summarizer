import express from 'express';
import { AppRequest, AppResponse, AppError } from '../types/express';
import { TEST_OUTPUT_CONFIG } from '../config/testOutput';
import fs from 'fs/promises';
import path from 'path';
import { z } from 'zod';

const router = express.Router();

const VideoIdSchema = z.object({
  videoId: z.string().min(1)
});

router.get('/test-queue/status/:videoId', async (req: AppRequest, res: AppResponse) => {
  try {
    const { videoId } = VideoIdSchema.parse(req.params);
    
    // Check each directory for the video
    for (const status of ['queue', 'processing', 'completed', 'failed']) {
      const filePath = path.join(
        TEST_OUTPUT_CONFIG.PATHS[status.toUpperCase()], 
        `${videoId}.json`
      );
      
      try {
        const data = await fs.readFile(filePath, 'utf-8');
        return res.sendSuccess(JSON.parse(data));
      } catch (err) {
        // File not found in this directory, continue searching
        continue;
      }
    }
    
    const error: AppError = new Error('Video not found');
    error.statusCode = 404;
    throw error;

  } catch (error) {
    if (error instanceof z.ZodError) {
      const appError: AppError = new Error('Invalid video ID');
      appError.statusCode = 400;
      appError.status = 'validation_error';
      throw appError;
    }

    if (error instanceof Error) {
      throw error; // Re-throw AppErrors
    }
    
    const appError: AppError = new Error('Failed to fetch status');
    appError.statusCode = 500;
    throw appError;
  }
});

export default router; 