import path from 'path';

export const TEST_OUTPUT_CONFIG = {
  BASE_DIR: path.join(process.cwd(), 'test_output'),
  PATHS: {
    QUEUE: path.join(process.cwd(), 'test_output', 'queue'),
    PROCESSING: path.join(process.cwd(), 'test_output', 'processing'),
    COMPLETED: path.join(process.cwd(), 'test_output', 'completed'),
    FAILED: path.join(process.cwd(), 'test_output', 'failed')
  },
  FILE_PATTERNS: {
    QUEUE: '{videoId}.json',
    PROCESSING: '{videoId}.json',
    COMPLETED: '{videoId}.json',
    FAILED: '{videoId}.json'
  }
}; 