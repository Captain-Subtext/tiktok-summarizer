import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TestVideoCard } from './TestVideoCard';
import type { TestVideo } from '../../types/TestVideo';
import { buildApiUrl } from '../../config/api';
import { VideoSkeleton } from './VideoSkeleton';
import { apiClient, ApiError } from '../../utils/apiClient';
import type { PaginatedResponse } from '../../types/api';

export const TestDashboardGrid: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [videos, setVideos] = useState<TestVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      const status = searchParams.get('status');
      try {
        const response = await apiClient<PaginatedResponse<TestVideo>>('TEST_VIDEOS', {
          params: status ? { status } : undefined
        });
        
        if (!response.videos) {
          throw new Error('Invalid response format');
        }
        
        setVideos(response.videos);
      } catch (error) {
        setError(error instanceof ApiError ? error.message : 'Failed to fetch videos');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="video-grid">
        {[...Array(6)].map((_, i) => (
          <VideoSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center',
        color: '#dc2626' 
      }}>
        Error: {error}
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center',
        color: '#666' 
      }}>
        No videos found. Try submitting a video from the home page.
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      <h1 className="dashboard-title">Test Dashboard</h1>
      <div className="video-grid">
        {videos.map(video => (
          <TestVideoCard 
            key={video.videoId}
            video={video}
          />
        ))}
      </div>
    </div>
  );
}; 