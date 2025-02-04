import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { TestVideo } from '../../types/TestVideo';
import { buildApiUrl } from '../../config/api';
import { VideoDetailSkeleton } from './VideoSkeleton';

export const TestVideoDetail: React.FC = () => {
  const { videoId } = useParams();
  const [video, setVideo] = useState<TestVideo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const url = buildApiUrl('TEST_VIDEOS', undefined) + `/${videoId}`;
        const response = await fetch(url);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Video not found');
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const { data } = await response.json();
        setVideo(data);
      } catch (error) {
        console.error('Error fetching video:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch video');
      } finally {
        setLoading(false);
      }
    };

    if (videoId) {
      fetchVideo();
    }
  }, [videoId]);

  if (loading) return <VideoDetailSkeleton />;
  if (error) return <div>Error: {error}</div>;
  if (!video) return <div>Video not found</div>;

  return (
    <div className="video-detail">
      <h2>{video.description}</h2>
      <div className="video-metadata">
        <p>By: {video.author.name}</p>
        <p>Status: {video.status}</p>
      </div>
      {video.aiSummary && (
        <div className="ai-summary">
          <h3>AI Summary</h3>
          <p>{video.aiSummary}</p>
        </div>
      )}
    </div>
  );
}; 