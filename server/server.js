const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Improved URL validation
const isValidTikTokUrl = (url) => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.includes('tiktok.com') && 
           urlObj.pathname.includes('@') && 
           urlObj.pathname.includes('/video/');
  } catch (e) {
    return false;
  }
};

// New function to get TikTok embed data
async function getTikTokData(url) {
  try {
    // Convert video URL to embed URL
    const videoId = url.split('/video/')[1]?.split('?')[0];
    const embedUrl = `https://www.tiktok.com/oembed?url=${url}`;

    // Get embed data
    const response = await axios.get(embedUrl);
    const embedData = response.data;

    // Extract hashtags from title
    const hashtags = (embedData.title.match(/#\w+/g) || []).map(tag => tag.slice(1));
    
    // Clean description by removing hashtags
    const cleanDescription = embedData.title.replace(/#\w+/g, '').trim();

    return {
      success: true,
      data: {
        videoId: videoId,
        author: {
          name: embedData.author_name,
          url: embedData.author_url
        },
        description: cleanDescription,
        hashtags: hashtags,
        thumbnail: embedData.thumbnail_url,
        embedHtml: embedData.html,
        platform: 'TikTok',
        url: url,
        timestamp: new Date().toISOString()
      }
    };

  } catch (error) {
    console.error('Data extraction error:', error);
    return {
      success: false,
      error: 'Could not fetch video information'
    };
  }
}

// Basic health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Updated summary endpoint with video extraction
app.post('/api/summary', async (req, res) => {
  try {
    const { url } = req.body;

    // Check if URL exists
    if (!url) {
      return res.status(400).json({
        status: 'error',
        message: 'No URL provided'
      });
    }

    // Validate URL format
    if (!isValidTikTokUrl(url)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid TikTok URL. Must be in format: https://www.tiktok.com/@username/video/...'
      });
    }

    const videoData = await getTikTokData(url);

    if (!videoData.success) {
      return res.status(500).json({
        status: 'error',
        message: 'Could not process video. Please try again.'
      });
    }

    res.json({
      status: 'success',
      data: videoData.data
    });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error processing request'
    });
  }
});

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'TikTok Summarizer API',
    endpoints: {
      health: 'GET /health',
      summary: 'POST /api/summary'
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
