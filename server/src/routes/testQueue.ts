import express from 'express';
import { TEST_OUTPUT_CONFIG } from '../config/testOutput';
import fs from 'fs/promises';
import path from 'path';

const router = express.Router();

router.get('/test-queue/status/:videoId', async (req, res) => {
  try {
    const { videoId } = req.params;
    
    // Check each directory for the video
    for (const status of ['queue', 'processing', 'completed', 'failed']) {
      const filePath = path.join(
        TEST_OUTPUT_CONFIG.PATHS[status.toUpperCase()], 
        `${videoId}.json`
      );
      
      try {
        const data = await fs.readFile(filePath, 'utf-8');
        return res.json(JSON.parse(data));
      } catch (err) {
        // File not found in this directory, continue searching
        continue;
      }
    }
    
    res.status(404).json({ error: 'Video not found' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch status' });
  }
});

export default router; 