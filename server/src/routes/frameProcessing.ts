import { Router } from 'express';
import { FrameExtractor } from '../services/videoProcessing/frameExtractor';
import { AppRequestHandler } from '../types/express';

const router = Router();
const frameExtractor = new FrameExtractor();

const extractFrames: AppRequestHandler = async (req, res, next) => {
  try {
    const { videoId, videoUrl } = req.body;

    const frames = await frameExtractor.extractFrames(videoId, videoUrl);

    res.sendSuccess({
      videoId,
      frameCount: frames.length,
      frames
    });
  } catch (error) {
    next(error);
  }
};

router.post('/extract', extractFrames);

export default router; 