import express from 'express';
import { fetchTikTokData } from '../services/tiktokService';
import { generateTestAISummary } from '../services/testAiService';

const router = express.Router();

router.get('/test/ping', (req, res) => {
  console.log('Test ping received');
  res.json({ status: 'ok', message: 'Test router working' });
});

router.post('/test-summary', async (req, res) => {
  console.log('POST /api/test-summary received');
  console.log('Request body:', req.body);
  try {
    const { url } = req.body;
    if (!url) {
      console.log('Error: No URL provided');
      return res.status(400).json({
        status: 'error',
        message: 'No URL provided'
      });
    }

    console.log('Fetching TikTok data for:', url);
    const videoData = await fetchTikTokData(url);
    console.log('TikTok data received:', videoData);

    console.log('Generating test AI summary...');
    const aiSummary = await generateTestAISummary(videoData);
    console.log('AI summary generated');

    res.json({
      status: 'success',
      data: {
        ...videoData,
        aiSummary
      }
    });
  } catch (error) {
    console.error('Error in test summary route:', error);
    res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Server error'
    });
  }
});

export default router; 