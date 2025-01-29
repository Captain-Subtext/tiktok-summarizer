import React, { useState } from 'react';

interface TikTokEmbedProps {
  videoId: string;
}

export const TikTokEmbed = ({ videoId }: TikTokEmbedProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div style={{ 
      marginBottom: '20px',
      position: 'relative',
      width: '325px',
      maxWidth: '100%',
      margin: '0 auto',
      paddingTop: '177.77%',
    }}>
      {!isPlaying ? (
        <div 
          onClick={() => setIsPlaying(true)}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            borderRadius: '8px',
            color: 'white',
            fontSize: '48px'
          }}
        >
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px'
          }}>
            ▶️
            <span style={{ fontSize: '14px' }}>Click to play</span>
          </div>
        </div>
      ) : (
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
      )}
    </div>
  );
};

// Add TypeScript declarations for window object
declare global {
  interface Window {
    tiktok: any;
  }
} 