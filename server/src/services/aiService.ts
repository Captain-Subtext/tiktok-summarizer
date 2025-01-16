import axios from 'axios';
import { analyzeContent } from './contentAnalyzer';

export async function generateAISummary(videoData: any): Promise<string> {
  try {
    const analysis = await analyzeContent(videoData.url);
    
    // Customize prompt based on content type
    let contentPrompt = '';
    switch (analysis.type) {
      case 'speech':
        contentPrompt = `
Speech Content:
${analysis.content.transcript || analysis.content.subtitles}
`;
        break;
      case 'visual':
        contentPrompt = `
Visual Content:
${analysis.content.visualDescription}
`;
        break;
      case 'hybrid':
        contentPrompt = `
Speech Content:
${analysis.content.transcript || analysis.content.subtitles}

Visual Content:
${analysis.content.visualDescription}
`;
        break;
    }

    const prompt = `Analyze this TikTok video based on its ${analysis.type} content:

Video Information:
Title: "${videoData.description}"
Creator: ${videoData.author.name}
Tags: ${videoData.hashtags.join(' ')}

${contentPrompt}

Please provide a comprehensive summary of what actually happens in this video.`;

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
    console.error('Error generating AI summary:', error);
    throw new Error('Could not generate AI summary. Please try again.');
  }
} 