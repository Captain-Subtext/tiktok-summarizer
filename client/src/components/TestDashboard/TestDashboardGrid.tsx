import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TestVideoCard } from './TestVideoCard';
import { SelectionControls } from './SelectionControls';
import type { TestVideo } from '../../types/TestVideo';
import { buildApiUrl } from '../../config/api';
import { VideoSkeleton } from './VideoSkeleton';
import { apiClient, ApiError } from '../../utils/apiClient';
import type { PaginatedResponse } from '../../types/api';
import { SelectionProvider } from '../../contexts/SelectionContext';

export const TestDashboardGrid: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [videos, setVideos] = useState<TestVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVideos = async () => {
    const status = searchParams.get('status');
    const sort = searchParams.get('sort') || 'newest';
    
    try {
      const response = await apiClient<PaginatedResponse<TestVideo>>('TEST_VIDEOS', {
        params: {
          ...(status ? { status } : {}),
          sort
        }
      });
      
      if (!response.videos) {
        throw new Error('Invalid response format');
      }

      const sortedVideos = [...response.videos].sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sort === 'newest' ? dateB - dateA : dateA - dateB;
      });
      
      setVideos(sortedVideos);
    } catch (error) {
      setError(error instanceof ApiError ? error.message : 'Failed to fetch videos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
    <SelectionProvider>
      <div className="dashboard-content">
        <h1 className="dashboard-title">Test Dashboard</h1>
        <div className="px-4">
          <SelectionControls 
            allVideoIds={videos.map(video => video.videoId)} 
            onDelete={fetchVideos}
          />
        </div>
        <div className={`${
          searchParams.get('layout') === 'list' 
            ? 'flex flex-col gap-4 px-4' 
            : 'video-grid'
        }`}>
          {videos.map(video => (
            <TestVideoCard 
              key={video.videoId}
              video={video}
            />
          ))}
        </div>
      </div>
    </SelectionProvider>
  );
};