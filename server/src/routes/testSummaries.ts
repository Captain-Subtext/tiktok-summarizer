import express from 'express';
import { AppRequestHandler, AppError } from '../types/express';
import { fetchTikTokData } from '../services/tiktokService';
import { generateTestAISummary } from '../services/testAiService';
import { prisma } from '../lib/db';
import { z } from 'zod';

const router = express.Router();

// Request validation schemas
const SummaryRequestSchema = z.object({
  url: z.string().url('Invalid TikTok URL')
});

const TestSummarySchema = z.object({
  videoId: z.string().min(1),
  text: z.string().min(1)
});

router.get('/test/ping', (req, res) => {
  console.log('Test ping received');
  res.json({ status: 'ok', message: 'Test router working' });
});

const processTestSummary: AppRequestHandler = async (req, res, next) => {
  try {
    const { url } = SummaryRequestSchema.parse(req.body);
    
    const videoData = await fetchTikTokData(url);

    const aiSummary = await generateTestAISummary(videoData);

    // Save to database
    const savedData = await prisma.$transaction(async (tx) => {
      // Create or find author
      const author = await tx.testAuthor.upsert({
        where: { url: videoData.author.url },
        update: {},
        create: {
          name: videoData.author.name,
          url: videoData.author.url
        }
      });

      // Create or update video
      const video = await tx.testVideo.upsert({
        where: { videoId: videoData.videoId },
        update: {
          description: videoData.description,
          hashtags: videoData.hashtags,
          thumbnail: videoData.thumbnail,
          status: 'processing'
        },
        create: {
          videoId: videoData.videoId,
          authorId: author.id,
          description: videoData.description,
          hashtags: videoData.hashtags,
          thumbnail: videoData.thumbnail,
          status: 'processing'
        }
      });

      // Update video with summary
      const updatedVideo = await tx.testVideo.update({
        where: { videoId: video.videoId },
        data: {
          status: 'completed',
          analysis: {
            create: {
              summary: aiSummary
            }
          }
        },
        include: {
          author: true,
          analysis: true
        }
      });

      return { video, updatedVideo, author };
    });

    res.sendSuccess({
      ...savedData.updatedVideo,
      aiSummary,
      status: 'COMPLETED'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const appError: AppError = new Error('Invalid request data');
      appError.statusCode = 400;
      appError.status = 'validation_error';
      next(appError);
      return;
    }

    console.error('Error in test summary route:', error);
    const appError: AppError = new Error(
      error instanceof Error ? error.message : 'Failed to process video'
    );
    appError.statusCode = 500;
    next(appError);
  }
};

const createTestSummary: AppRequestHandler = async (req, res, next) => {
  try {
    const { videoId, text } = TestSummarySchema.parse(req.body);
    
    const video = await prisma.testVideo.update({
      where: { videoId: videoId },
      data: {
        analysis: {
          create: {
            summary: text
          }
        },
        status: 'completed'
      },
      include: {
        author: true,
        analysis: true
      }
    });

    res.sendSuccess(video);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const appError: AppError = new Error('Invalid input data');
      appError.statusCode = 400;
      appError.status = 'validation_error';
      next(appError);
      return;
    }
    next(error);
  }
};

// Use different paths for different operations
router.post('/test-summary', (req, res, next) => {
  console.log('POST /test-summary received:', req.body);
  processTestSummary(req, res, next);
});

router.post('/test-summary/create', createTestSummary);

export default router; 