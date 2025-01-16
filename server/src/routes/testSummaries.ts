import express from 'express';
import { fetchTikTokData } from '../services/tiktokService';
import { generateTestAISummary } from '../services/testAiService';

const router = express.Router();

router.post('/test-summary', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({
        status: 'error',
        message: 'No URL provided'
      });
    }

    const videoData = await fetchTikTokData(url);
    const aiSummary = await generateTestAISummary(videoData);

    res.json({
      status: 'success',
      data: {
        ...videoData,
        aiSummary
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Server error'
    });
  }
});

export default router; 