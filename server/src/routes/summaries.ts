import express, { Request, Response } from 'express';
import { fetchTikTokData } from '../services/tiktokService';
import { generateAISummary } from '../services/aiService';

const router = express.Router();

router.post('/summary', async (req: Request<any, any, { url: string }>, res: Response) => {
  try {
    console.log('POST /api/summary received');
    console.log('Request body:', req.body);
    const { url } = req.body;
    console.log('Processing URL:', url);

    if (!url) {
      return res.status(400).json({
        status: 'error',
        message: 'No URL provided'
      });
    }

    console.log('Fetching TikTok data...');
    const videoData = await fetchTikTokData(url);
    console.log('TikTok data:', videoData);

    console.log('Generating AI summary...');
    const aiSummary = await generateAISummary(videoData);
    console.log('AI summary generated');

    res.json({
      status: 'success',
      data: {
        ...videoData,
        aiSummary
      }
    });

  } catch (error) {
    console.error('Error details:', error);
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
    res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Server error processing request'
    });
  }
});

export default router; 