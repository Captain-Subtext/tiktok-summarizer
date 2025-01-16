import axios from 'axios';

export async function generateTestAISummary(videoData: any): Promise<string> {
  try {
    const prompt = `Analyze this TikTok video based on its metadata:

Video Information:
Title: "${videoData.description}"
Creator: ${videoData.author.name}
Tags: ${videoData.hashtags.join(' ')}

Please provide a comprehensive summary of what this video might be about.
Note: Since I cannot view or access TikTok videos directly, I can only analyze based on the provided metadata.`;

    const response = await axios.post(
      'https://api.deepseek.com/v1/chat/completions',
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
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.data?.choices?.[0]?.message?.content) {
      throw new Error('Invalid AI response format');
    }

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating test AI summary:', error);
    throw new Error('Could not generate test AI summary. Please try again.');
  }
} 