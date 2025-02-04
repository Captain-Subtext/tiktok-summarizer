import express from 'express';
import { AppRequestHandler, AppError } from '../types/express';
import { fetchTikTokData } from '../services/tiktokService';
import { generateAISummary } from '../services/aiService';
import { z } from 'zod';

const router = express.Router();

// Request validation schema
const SummaryRequestSchema = z.object({
  url: z.string().url('Invalid TikTok URL')
});

const createSummary: AppRequestHandler = async (req, res, next) => {
  try {
    const { url } = SummaryRequestSchema.parse(req.body);
    const videoData = await fetchTikTokData(url);
    const aiSummary = await generateAISummary(videoData);

    res.sendSuccess({
      ...videoData,
      aiSummary
    });
  } catch (error) {
    next(error);
  }
};

router.post('/summary', createSummary);

export default router; 