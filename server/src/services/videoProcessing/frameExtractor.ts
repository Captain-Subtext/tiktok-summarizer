import ffmpeg from 'ffmpeg-static';
import { spawn, type ChildProcess } from 'child_process';
import path from 'path';
import fs from 'fs/promises';
import { prisma } from '../../lib/db';
import type { TestVideo } from '@prisma/client';
import { downloadVideo } from './videoDownloader';

interface FrameExtractionOptions {
  fps?: number;
  maxFrames?: number;
  quality?: number;
}

interface FrameData {
  path: string;
  index: number;
  timestamp: number;
}

export class FrameExtractor {
  private readonly outputDir: string;
  
  constructor() {
    this.outputDir = path.join(process.cwd(), 'test_output', 'frames');
  }

  async extractFrames(
    videoId: string, 
    videoUrl: string, 
    options: FrameExtractionOptions = {}
  ) {
    // Download video first
    const videoPath = await downloadVideo(videoId, videoUrl);

    const {
      fps = 1,        // Extract 1 frame per second by default
      maxFrames = 30, // Maximum number of frames to extract
      quality = 80    // JPEG quality
    } = options;

    const videoDir = path.join(this.outputDir, videoId, 'raw');
    await fs.mkdir(videoDir, { recursive: true });

    return new Promise<string[]>((resolve, reject) => {
      // Ensure ffmpeg is not null
      if (!ffmpeg) {
        reject(new Error('FFmpeg not found'));
        return;
      }

      const ffmpegProcess = spawn(ffmpeg as string, [
        '-i', videoPath,
        '-vf', `fps=${fps}`,
        '-frames:v', maxFrames.toString(),
        '-q:v', Math.floor(quality / 10).toString(),
        path.join(videoDir, 'frame_%03d.jpg')
      ]);

      ffmpegProcess.stderr?.on('data', (data: Buffer) => {
        console.log(`FFmpeg stderr: ${data}`);
      });

      const frames: string[] = [];
      
      ffmpegProcess.on('close', async (code: number) => {
        if (code === 0) {
          // Get list of extracted frames
          const files = await fs.readdir(videoDir);
          const framePaths = files
            .filter(f => f.startsWith('frame_'))
            .map(f => path.join(videoDir, f));
          
          // Update database with frame data
          await this.updateVideoFrames(videoId, framePaths);
          
          resolve(framePaths);
        } else {
          reject(new Error(`FFmpeg process exited with code ${code}`));
        }
      });

      ffmpegProcess.on('error', reject);
    });
  }

  private async updateVideoFrames(videoId: string, framePaths: string[]) {
    const frameData: FrameData[] = framePaths.map((path, index) => ({
      path,
      index,
      timestamp: index
    }));

    await prisma.testVideo.update({
      where: { videoId },
      data: {
        analysis: {
          upsert: {
            create: {
              summary: '', // Required field
              frames: frameData as unknown as any[] // Type assertion for now
            },
            update: {
              frames: frameData as unknown as any[] // Type assertion for now
            }
          }
        }
      }
    });
  }
} 