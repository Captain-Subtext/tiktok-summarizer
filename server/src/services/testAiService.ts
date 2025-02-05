import axios from 'axios';

export async function generateTestAISummary(videoData: any): Promise<string> {
  try {
    // First verify we have an API key
    if (!process.env.DEEPSEEK_API_KEY) {
      console.error('Missing DeepSeek API key');
      throw new Error('API configuration error');
    }

    // Log the start of processing
    console.log('Starting AI summary generation for:', videoData.videoId);

    const prompt = `Summarize this TikTok video based on its metadata:

Video Information:
Title: "${videoData.description}"
Creator: ${videoData.author.name}
Tags: ${videoData.hashtags.join(' ')}

Please provide a concise summary of the video's likely content and purpose.`;

    const response = await axios.post(
      'https://api.deepseek.com/v1/chat/completions',
      {
        model: "deepseek-chat",
        messages: [{
          role: "user",
          content: prompt
        }],
        max_tokens: 500,
        temperature: 0.3
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000  // Increased to 30 seconds
      }
    );

    // Log successful response
    console.log('DeepSeek API response received for:', videoData.videoId);

    if (!response.data?.choices?.[0]?.message?.content) {
      console.error('Invalid API response format:', response.data);
      throw new Error('Invalid AI response format');
    }

    return response.data.choices[0].message.content;

  } catch (error) {
    // Enhanced error logging
    console.error('DeepSeek API error details:', {
      name: error.name,
      message: error.message,
      code: error.code,
      response: error.response?.data
    });

    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNRESET') {
        throw new Error('Connection to AI service was reset. Please try again.');
      }
      if (error.response?.status === 429) {
        throw new Error('AI service is busy. Please try again in a moment.');
      }
    }

    throw new Error('Could not generate AI summary. Please try again.');
  }
} 