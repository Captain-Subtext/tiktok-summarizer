import { generateText } from '../lib/deepseek';

export async function generateAISummary(videoData: any): Promise<string> {
  try {
    const prompt = `Analyze this TikTok video and provide a detailed breakdown:

Title: "${videoData.description}"
Creator: ${videoData.author.name}
Tags: ${videoData.hashtags.join(' ')}

Please provide a comprehensive analysis including:
1. What problem does this video solve?
2. What are the key technical requirements?
3. What are the main steps involved?
4. What are potential challenges or limitations?
5. Who would benefit most from this solution?

Format your response as a clear, structured analysis with bullet points.`;

    const response = await generateText(prompt);
    return response;
  } catch (error) {
    console.error('Error generating AI summary:', error);
    throw new Error('Failed to generate AI summary');
  }
} 