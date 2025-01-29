import axios from 'axios';

export async function generateTestAISummary(videoData: any): Promise<string> {
  try {
    // First verify we have an API key
    if (!process.env.DEEPSEEK_API_KEY) {
      console.error('Missing DeepSeek API key');
      return 'Error: API configuration issue';
    }

    const prompt = `Summarize this TikTok video based on its metadata:

Video Information:
Title: "${videoData.description}"
Creator: ${videoData.author.name}
Tags: ${videoData.hashtags.join(' ')}

Please provide a concise summary of the video's likely content and purpose.`;

    console.log('Sending request to DeepSeek API...');
    
    const response = await axios.post(
      'https://api.deepseek.com/v1/chat/completions',
      {
        model: "deepseek-chat",
        messages: [{
          role: "user",
          content: prompt
        }],
        max_tokens: 500,  // Reduced for faster response
        temperature: 0.3
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000  // 10 second timeout
      }
    );

    console.log('DeepSeek API raw response:', response.data);

    // More detailed response checking
    if (!response.data) {
      console.error('Empty response from API');
      return 'Error: No response from AI service';
    }

    if (!response.data.choices?.[0]?.message?.content) {
      console.error('Malformed API response:', response.data);
      return `Summary based on metadata:
- Topic: ${videoData.description}
- Creator: ${videoData.author.name}
- Key themes: ${videoData.hashtags.join(', ')}`;
    }

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('DeepSeek API error:', error);
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        return 'Error: Request timed out. Please try again.';
      }
      console.error('API Error Details:', {
        status: error.response?.status,
        data: error.response?.data
      });
    }
    return 'Error generating summary. Please try again.';
  }
} 