import axios from 'axios';
import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';
import { ApifyClient } from 'apify-client';

// Define the shape of our Apify dataset item based on the actual response
type ApifyDatasetItem = {
  id: string;
  text: string;
  webVideoUrl: string;
  videoMeta: {
    height: number;
    width: number;
    duration: number;
    format: string;
    downloadAddr: string;
    subtitleLinks?: Array<{
      language: string;
      downloadLink: string;
    }>;
  };
};

export async function downloadVideo(videoId: string, outputPath: string): Promise<string> {
  try {
    // Ensure the output directory exists
    const videoDir = path.join('test_output', 'videos');
    await fsPromises.mkdir(videoDir, { recursive: true });

    // Create a proper local file path
    const localVideoPath = path.join(videoDir, `${videoId}.mp4`);

    // Initialize Apify client
    const client = new ApifyClient({
      token: process.env.APIFY_API_TOKEN,
    });

    // Prepare the Actor input
    const runInput = {
      postURLs: [`https://www.tiktok.com/@placeholder/video/${videoId}`],
      shouldDownloadVideos: true,
      maxVideoCount: 1
    };

    console.log('Starting Apify actor run...');
    
    // Run the Actor and wait for it to finish
    const run = await client.actor("clockworks/tiktok-video-scraper").call(runInput);

    console.log('Actor run completed, fetching results...');

    // Get the dataset items
    const dataset = await client.dataset(run.defaultDatasetId);
    const { items } = await dataset.listItems();
    
    if (!items || items.length === 0) {
      throw new Error('No results found in Apify dataset');
    }

    const videoData = items[0] as ApifyDatasetItem;
    
    // Use the direct download address instead of subtitle links
    const videoUrl = videoData.videoMeta.downloadAddr;
    
    if (!videoUrl) {
      throw new Error('No video URL found in Apify response');
    }

    console.log('Using TikTok CDN URL:', videoUrl);

    // Download the video with TikTok headers
    const videoResponse = await axios({
      method: 'get',
      url: videoUrl,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Referer': 'https://www.tiktok.com/',
        'Accept': 'video/mp4,video/*;q=0.9,*/*;q=0.8'
      },
      responseType: 'stream'
    });

    // Create write stream to save to the LOCAL file path
    const writer = fs.createWriteStream(localVideoPath);

    // Pipe the video data to the file
    videoResponse.data.pipe(writer);

    // Wait for the download to complete
    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        console.log('Video downloaded successfully to:', localVideoPath);
        resolve(localVideoPath);  // Return the local path
      });
      writer.on('error', reject);
    });

  } catch (error) {
    console.error('Video download error:', error);
    throw new Error(`Failed to download video: ${error.message}`);
  }
}

function extractVideoUrl(html: string): string {
  // Extract video URL from TikTok page HTML
  const match = html.match(/"playAddr":"([^"]+)"/);
  if (!match) throw new Error('Could not find video URL');
  return match[1].replace(/\\u002F/g, '/');
} 