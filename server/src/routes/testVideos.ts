import express from 'express';
import { prisma } from '../lib/db';
import { VideoQuerySchema, VideoParamsSchema, UpdateStatusSchema } from '../types/video';
import { z } from 'zod';
import { AppRequestHandler, AppError } from '../types/express';

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
      videos: videos.map(video => ({
        ...video,
        author: video.author ? {
          name: video.author.name || '',
          url: video.author.url || ''
        } : null,
        aiSummary: video.analysis?.summary
      })),
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
      startedAt: video.startedAt,
      stalledAt: video.stalledAt,
      failureReason: video.failureReason,
      lastActivity: video.lastActivity,
      deleteAfter: video.deleteAfter,
      aiSummary: video.analysis?.summary
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /test-videos/:videoId/status
 * Updates video status with validation
 * 
 * Path Parameters:
 * @param {string} videoId - The ID of the video to update
 * 
 * Request Body:
 * @param {VideoStatus} status - New status
 * @param {string} [failureReason] - Required if status is 'failed'
 * 
 * @returns {Promise<TestVideo>} Updated video
 * @throws {400} Invalid status transition
 * @throws {404} Video not found
 * @throws {500} Server error
 */
const updateVideoStatus: AppRequestHandler = async (req, res, next) => {
  try {
    const { videoId } = VideoParamsSchema.parse(req.params);
    const updateData = UpdateStatusSchema.parse(req.body);
    
    const video = await prisma.testVideo.update({
      where: { videoId },
      data: {
        status: updateData.status,
        failureReason: updateData.failureReason,
        lastActivity: new Date(),
        ...(updateData.status === 'failed' && { stalledAt: null }),
        ...(updateData.status === 'processing' && { startedAt: new Date() })
      },
      include: {
        author: true,
        analysis: true
      }
    });

    res.sendSuccess(video);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /test-videos/:videoId/retry
 * Retries processing for a failed or stalled video
 * 
 * Path Parameters:
 * @param {string} videoId - The ID of the video to retry
 * 
 * @returns {Promise<TestVideo>} Updated video
 * @throws {400} Video not in failed/stalled state
 * @throws {404} Video not found
 * @throws {500} Server error
 */
const retryVideoProcessing: AppRequestHandler = async (req, res, next) => {
  try {
    const { videoId } = VideoParamsSchema.parse(req.params);
    
    // Get current video state
    const video = await prisma.testVideo.findUnique({
      where: { videoId }
    });

    if (!video) {
      const error: AppError = new Error('Video not found');
      error.statusCode = 404;
      next(error);
      return;
    }

    // Verify video can be retried
    if (video.status !== 'failed') {
      const error: AppError = new Error('Only failed videos can be retried');
      error.statusCode = 400;
      error.status = 'invalid_operation';
      next(error);
      return;
    }

    // Reset video for processing
    const updatedVideo = await prisma.testVideo.update({
      where: { videoId },
      data: {
        status: 'processing',
        startedAt: new Date(),
        stalledAt: null,
        failureReason: null,
        lastActivity: new Date()
      },
      include: {
        author: true,
        analysis: true
      }
    });

    res.sendSuccess(updatedVideo);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /test-videos/:videoId/archive
 * Archives a completed video
 * 
 * Path Parameters:
 * @param {string} videoId - The ID of the video to archive
 * 
 * Query Parameters:
 * @param {string} [deleteAfter] - Optional date to auto-delete
 * 
 * @returns {Promise<TestVideo>} Updated video
 * @throws {400} Video not in completed state
 * @throws {404} Video not found
 * @throws {500} Server error
 */
const archiveVideo: AppRequestHandler = async (req, res, next) => {
  try {
    const { videoId } = VideoParamsSchema.parse(req.params);
    
    // Get current video state
    const video = await prisma.testVideo.findUnique({
      where: { videoId }
    });

    if (!video) {
      const error: AppError = new Error('Video not found');
      error.statusCode = 404;
      next(error);
      return;
    }

    // Verify video can be archived
    if (video.status !== 'completed') {
      const error: AppError = new Error('Only completed videos can be archived');
      error.statusCode = 400;
      error.status = 'invalid_operation';
      next(error);
      return;
    }

    // Archive the video
    const updatedVideo = await prisma.testVideo.update({
      where: { videoId },
      data: {
        status: 'archived',
        lastActivity: new Date(),
        deleteAfter: req.query.deleteAfter ? new Date(req.query.deleteAfter as string) : undefined
      },
      include: {
        author: true,
        analysis: true
      }
    });

    res.sendSuccess(updatedVideo);
  } catch (error) {
    next(error);
  }
};

router.get('/test-videos', getTestVideos);
router.get('/test-videos/:videoId', getTestVideoById);
router.patch('/test-videos/:videoId/status', updateVideoStatus);
router.post('/test-videos/:videoId/retry', retryVideoProcessing);
router.post('/test-videos/:videoId/archive', archiveVideo);

export default router; 