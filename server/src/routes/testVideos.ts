import express from 'express';
import { prisma } from '../lib/db';
import { VideoQuerySchema, VideoParamsSchema } from '../types/video';
import { z } from 'zod';
import { AppRequestHandler, AppError } from '../types/express';
import { Router } from 'express';

const router = express.Router();

/**
 * GET /test-videos
 * Retrieves a list of test videos, optionally filtered by status
 * 
 * Query Parameters:
 * @param {string} [status] - Filter videos by status ('processing', 'completed', 'failed')
 * 
 * @returns {Promise<Array<TestVideo>>} List of test videos
 * @throws {400} Invalid query parameters
 * @throws {500} Server error
 */
const getTestVideos: AppRequestHandler = async (req, res, next) => {
  try {
    const query = VideoQuerySchema.parse(req.query);
    
    const videos = await prisma.testVideo.findMany({
      where: query.status ? {
        status: query.status
      } : undefined,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        author: true,
        analysis: true
      }
    });

    const response = {
      videos,
      total: videos.length,
      page: query.page,
      pageSize: query.pageSize
    };

    res.sendSuccess(response);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /test-videos/:videoId
 * Retrieves a single test video by ID
 * 
 * Path Parameters:
 * @param {string} videoId - The ID of the video to retrieve
 * 
 * @returns {Promise<TestVideo>} The requested video
 * @throws {400} Invalid video ID
 * @throws {404} Video not found
 * @throws {500} Server error
 */
const getTestVideoById: AppRequestHandler = async (req, res, next) => {
  try {
    const { videoId } = VideoParamsSchema.parse(req.params);
    
    const video = await prisma.testVideo.findUnique({
      where: { videoId },
      include: {
        author: true,
        analysis: true
      }
    });

    if (!video) {
      const error: AppError = new Error('Video not found');
      error.statusCode = 404;
      next(error);
      return;
    }

    res.sendSuccess({
      videoId: video.videoId,
      status: video.status,
      author: video.author ? {
        name: video.author?.name || '',
        url: video.author?.url || ''
      } : null,
      description: video.description,
      hashtags: video.hashtags,
      thumbnail: video.thumbnail,
      createdAt: video.createdAt,
      aiSummary: video.analysis?.summary
    });
  } catch (error) {
    next(error);
  }
};

const deleteTestVideos: AppRequestHandler = async (req, res, next) => {
  try {
    const { videoIds } = req.body;
    
    if (!Array.isArray(videoIds)) {
      const error: AppError = new Error('videoIds must be an array');
      error.statusCode = 400;
      next(error);
      return;
    }

    // Delete in a transaction to ensure consistency
    await prisma.$transaction(async (tx) => {
      // First delete the analysis records
      await tx.testAnalysis.deleteMany({
        where: {
          videoId: { in: videoIds }
        }
      });

      // Then delete the videos
      await tx.testVideo.deleteMany({
        where: {
          videoId: { in: videoIds }
        }
      });
    });

    res.sendSuccess({ success: true });
  } catch (error) {
    next(error);
  }
};

// Routes
router.get('/', getTestVideos);
router.get('/:videoId', getTestVideoById);
router.delete('/', deleteTestVideos);

export default router; 