import { promisify } from 'util';
import { join } from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

interface VideoStream {
  codec_type: string;
  codec_name: string;
  avg_frame_rate: string;
}

interface AudioStream {
  codec_type: string;
  codec_name: string;
}

interface FFProbeMetadata {
  streams: (VideoStream | AudioStream)[];
  format: {
    duration?: number;
  };
}

// Check if ffmpeg is installed
function checkFfmpeg(): Promise<boolean> {
  return new Promise((resolve) => {
    ffmpeg.getAvailableCodecs((err, codecs) => {
      resolve(!err && !!codecs);
    });
  });
}

function detectSpeech(audioStream: any): boolean {
  // Basic heuristic: if the audio codec is speech-optimized
  const speechCodecs = ['aac', 'opus', 'vorbis'];
  return speechCodecs.includes(audioStream.codec_name);
}

function detectSlideshow(videoStream: any): boolean {
  // Basic heuristic: low frame rate might indicate slideshow
  return videoStream.avg_frame_rate && 
    eval(videoStream.avg_frame_rate) < 10; // Less than 10 fps
} 