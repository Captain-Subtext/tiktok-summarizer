import React from 'react';
import { Link } from 'react-router-dom';
import type { TestVideo } from '../../types/TestVideo';

interface TestVideoCardProps {
  video: TestVideo;
}

export const TestVideoCard: React.FC<TestVideoCardProps> = ({ video }) => {
  return (
    <Link to={`/test-dashboard/${video.videoId}`} className="video-card">
      <div className="thumbnail-container">
        {video.thumbnail && (
          <img 
            src={video.thumbnail} 
            alt={video.description}
            className="video-thumbnail"
          />
        )}
        {video.status === 'processing' && (
          <div className="processing-overlay">
            <span className="processing-icon">⌛</span>
            Processing
          </div>
        )}
      </div>
      <div className="video-card-content">
        <h3 className="video-title">{video.description}</h3>
        <p className="video-author">By: {video.author.name}</p>
      </div>
    </Link>
  );
}; 