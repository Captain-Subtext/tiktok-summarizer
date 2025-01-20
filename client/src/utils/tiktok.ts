export function extractAndValidateTikTokId(url: string): { 
  videoId: string | null; 
  error?: string 
} {
  // First try to extract the ID
  const patterns = [
    /tiktok\.com\/@[\w.-]+\/video\/(\d+)/,
    /vm\.tiktok\.com\/(\w+)/,
    /m\.tiktok\.com\/v\/(\d+)/,
    /video\/(\d+)/
  ];

  let extractedId: string | null = null;

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      extractedId = match[1];
      break;
    }
  }

  if (!extractedId) {
    return {
      videoId: null,
      error: "Could not extract video ID from URL"
    };
  }

  // Then validate the extracted ID
  const numericPattern = /^\d{19}$/;
  
  if (!numericPattern.test(extractedId)) {
    return {
      videoId: null,
      error: "Invalid video ID format"
    };
  }

  try {
    const numericId = BigInt(extractedId);
    if (numericId <= 0) {
      return {
        videoId: null,
        error: "Invalid video ID value"
      };
    }
  } catch {
    return {
      videoId: null,
      error: "Invalid video ID"
    };
  }

  return { videoId: extractedId };
}

// Usage example:
const result = extractAndValidateTikTokId("https://www.tiktok.com/@getahead.app/video/7460616221008973064");
if (result.videoId) {
  // Valid ID found
  console.log(`Valid TikTok ID: ${result.videoId}`);
} else {
  // Handle error
  console.error(`Error: ${result.error}`);
} 