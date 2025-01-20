import React from 'react';

interface TikTokEmbedProps {
  videoId: string;
}

export const TikTokEmbed = ({ videoId }: TikTokEmbedProps) => {
  return (
    <div style={{ 
      marginBottom: '20px',
      position: 'relative',
      width: '325px',           // Back to TikTok's default width
      maxWidth: '100%',
      margin: '0 auto',
      paddingTop: '177.77%',
    }}>
      <iframe
        src={`https://www.tiktok.com/embed/v2/${videoId}?lang=en-US&privacy=1`}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          border: 'none',
          borderRadius: '8px'
        }}
        title="TikTok video player"
        sandbox="allow-scripts allow-same-origin allow-presentation"
        allowFullScreen
      />
    </div>
  );
};

// Add TypeScript declarations for window object
declare global {
  interface Window {
    tiktok: any;
  }
} 