import axios from 'axios';

interface TikTokVideoData {
  videoId: string;
  author: {
    name: string;
    url: string;
  };
  description: string;
  hashtags: string[];
  thumbnail: string;
  embedHtml: string;
  url: string;
}

export async function fetchTikTokData(url: string): Promise<TikTokVideoData> {
  try {
    // Clean the URL by removing query parameters
    const cleanUrl = url.split('?')[0];
    
    // Get video data from TikTok's oembed endpoint
    const response = await axios.get(`https://www.tiktok.com/oembed?url=${cleanUrl}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko)',
        'Accept': 'application/json',
        'Referer': 'https://www.tiktok.com/'
      }
    });

    const embedData = response.data;

    // Extract hashtags and clean description from title
    const hashtags = (embedData.title?.match(/#\w+/g) || [])
      .map((tag: string) => tag.slice(1));
    const description = embedData.title?.replace(/#\w+/g, '').trim() || '';

    // Extract video ID from URL
    const videoId = cleanUrl.split('/video/')[1];

    return {
      videoId,
      author: {
        name: embedData.author_name,
        url: embedData.author_url
      },
      description,
      hashtags,
      thumbnail: embedData.thumbnail_url,
      embedHtml: embedData.html,
      url: cleanUrl
    };
  } catch (error) {
    console.error('Error fetching TikTok data:', error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.message;
      throw new Error(`TikTok API error (${status}): ${message || 'Unknown error'}`);
    }
    throw new Error('Failed to fetch video information');
  }
} 