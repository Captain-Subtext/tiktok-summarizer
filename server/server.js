const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

async function getAISummary(embedData) {
  try {
    const hashtags = embedData.title?.match(/#\w+/g) || [];
    const cleanDescription = embedData.title?.replace(/#\w+/g, '').trim() || '';

    const prompt = `Analyze this TikTok video tutorial and provide a detailed breakdown:

    Video Information:
    Title: "${cleanDescription}"
    Creator: ${embedData.author_name}
    Tags: ${hashtags.join(' ')}

    Please provide a comprehensive analysis including:
    1. What problem does this tutorial solve?
    2. What are the key technical requirements?
    3. What are the main steps involved?
    4. What are potential challenges or limitations?
    5. Who would benefit most from this solution?

    Format your response as a clear, structured analysis with bullet points.`;

    const response = await axios.post(
      DEEPSEEK_API_URL,
      {
        model: "deepseek-chat",
        messages: [{
          role: "user",
          content: prompt
        }],
        max_tokens: 1000,
        temperature: 0.3
      },
      {
        headers: {
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.data?.choices?.[0]?.message?.content) {
      throw new Error('Invalid AI response format');
    }

    return response.data.choices[0].message.content;
  } catch (error) {
    throw error;
  }
}

async function getTikTokData(url) {
  try {
    const embedUrl = `https://www.tiktok.com/oembed?url=${url}`;
    const embedResponse = await axios.get(embedUrl);
    
    if (!embedResponse.data) {
      throw new Error('Could not fetch TikTok embed data');
    }

    const embedData = embedResponse.data;
    const hashtags = (embedData.title?.match(/#\w+/g) || []).map(tag => tag.slice(1));
    const cleanDescription = embedData.title?.replace(/#\w+/g, '').trim() || '';
    
    let aiSummary;
    try {
      aiSummary = await getAISummary(embedData);
    } catch (error) {
      aiSummary = 'Could not generate AI summary. Please try again.';
    }

    return {
      success: true,
      data: {
        videoId: url.split('/video/')[1]?.split('?')[0] || '',
        author: {
          name: embedData.author_name || 'Unknown',
          url: embedData.author_url || '#'
        },
        description: cleanDescription,
        hashtags: hashtags,
        thumbnail: embedData.thumbnail_url,
        embedHtml: embedData.html,
        url: url,
        aiSummary: aiSummary,
        timestamp: new Date().toISOString()
      }
    };
  } catch (error) {
    return {
      success: false,
      error: 'Could not fetch video information'
    };
  }
}

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/summary', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        status: 'error',
        message: 'No URL provided'
      });
    }

    const result = await getTikTokData(url);

    if (!result.success) {
      return res.status(400).json({
        status: 'error',
        message: result.error
      });
    }

    res.json({
      status: 'success',
      data: result.data
    });

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Server error processing request'
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`TikTok Summarizer server running on port ${PORT}`);
});
