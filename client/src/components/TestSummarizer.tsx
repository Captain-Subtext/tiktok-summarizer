import { useState } from 'react';
import { LoadingIndicator } from './LoadingIndicator';
import { extractAndValidateTikTokId } from '../utils/tiktok';
import { TikTokEmbed } from './TikTokEmbed';
import type { TestOutput } from '../types/TestOutput';
import { Link } from 'react-router-dom';
import { apiClient } from '../utils/apiClient';
import type { FrameExtractionResponse } from '../types/frame';

interface SummaryResult {
  author: {
    name: string;
    url: string;
  };
  description: string;
  aiSummary?: string;
  hashtags: string[];
  videoId: string;
  thumbnail?: string;
}

// Add new interface for error states
interface ErrorState {
  message: string;
  isRetryable: boolean;
}

export const TestSummarizer = () => {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<SummaryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorState | null>(null);
  const [isProcessingDetailed, setIsProcessingDetailed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    const validation = extractAndValidateTikTokId(url);
    if (!validation.videoId) {
      setError({ 
        message: validation.error || 'Invalid TikTok URL',
        isRetryable: false 
      });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/test-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          url,
          videoId: validation.videoId
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (data.status === 'error') {
        throw new Error(data.message);
      }

      // Check if we got an error message back from the AI service
      if (data.data.aiSummary?.startsWith('Error:')) {
        setError({
          message: data.data.aiSummary,
          isRetryable: true
        });
        return;
      }
      
      setResult(data.data);
      setIsProcessingDetailed(true);

      // Extract frames after successful summary
      try {
        await apiClient<FrameExtractionResponse>('FRAME_PROCESSING', {
          method: 'POST',
          body: { 
            videoId: data.data.videoId, 
            videoUrl: url 
          }
        });
      } catch (frameError) {
        console.error('Frame extraction failed:', frameError);
        // Don't fail the whole process if frame extraction fails
      }
    } catch (err) {
      setError({
        message: err instanceof Error ? err.message : 'An error occurred',
        isRetryable: true
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setLoading(false);
    setError(null);
    // Clear any pending state
    setResult(null);
    setIsProcessingDetailed(false);
    
    // Force reload to clear any pending requests
    window.location.reload();
  };

  return (
    <div style={{
      width: '90%',
      maxWidth: '500px',
      margin: '20px auto',
      padding: '20px',
      backgroundColor: '#fff4f4',
      borderRadius: '12px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    }}>
      <h1 style={{
        color: 'black',
        textAlign: 'center',
        marginTop: '0',
        marginBottom: '20px',
        fontSize: '24px',
        fontWeight: 'bold'
      }}>
        Test Summarizer (Experimental)
      </h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="Paste TikTok URL here"
          style={{
            width: '94%',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #ddd',
            marginBottom: '10px',
            fontSize: '16px',
            backgroundColor: '#f5f5f5',
            color: 'black'
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#007AFF',
            color: 'white',
            fontSize: '16px',
            cursor: loading ? 'wait' : 'pointer',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? 'Analyzing Video...' : 'Get Test Summary'}
        </button>
      </form>

      {loading && <LoadingIndicator onCancel={handleCancel} />}

      {error && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#ffebee',
          borderRadius: '8px',
          color: '#c62828'
        }}>
          <div style={{ marginBottom: '10px' }}>{error.message}</div>
          {error.isRetryable && (
            <button
              onClick={handleSubmit}
              style={{
                backgroundColor: '#007AFF',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Try Again
            </button>
          )}
        </div>
      )}

      {result && !loading && !error && (
        <div style={{
          backgroundColor: '#f5f5f5',
          padding: '20px',
          borderRadius: '8px',
          marginTop: '20px',
          color: '#000000'
        }}>
          {isProcessingDetailed && (
            <div style={{
              marginBottom: '20px',
              padding: '15px',
              backgroundColor: '#f0f7ff',
              borderRadius: '8px',
              border: '1px solid #cce3ff',
              color: '#000000'
            }}>
              <p style={{ fontSize: '14px', margin: '0 0 10px 0' }}>
                We're now working on a detailed summary by analyzing the full video content.
                We'll email you when the enhanced analysis is complete.
              </p>
              <Link 
                to="/test-dashboard"
                style={{
                  display: 'inline-block',
                  padding: '8px 16px',
                  backgroundColor: '#007AFF',
                  color: 'white',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  fontSize: '14px'
                }}
              >
                View Test Dashboard →
              </Link>
            </div>
          )}

          <TikTokEmbed videoId={result.videoId} />

          <div style={{ marginBottom: '10px' }}>
            <strong>Author:</strong> {result.author.name}
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            <strong>Description:</strong> {result.description}
          </div>
          
          {result.aiSummary && !result.aiSummary.startsWith('Error:') && (
            <div style={{ 
              marginBottom: '15px',
              padding: '15px',
              backgroundColor: '#f0f7ff',
              borderRadius: '8px',
              border: '1px solid #cce3ff'
            }}>
              <strong style={{ 
                display: 'block', 
                marginBottom: '10px',
                color: '#0066cc'
              }}>
                AI Analysis:
              </strong>
              <div style={{ 
                fontSize: '14px',
                lineHeight: '1.6',
                maxHeight: '600px',
                overflowY: 'auto'
              }}>
                {result.aiSummary}
              </div>
            </div>
          )}
          
          {result.hashtags.length > 0 && (
            <div style={{ marginBottom: '10px' }}>
              <strong>Tags:</strong>
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '5px',
                marginTop: '5px' 
              }}>
                {result.hashtags.map((tag, index) => (
                  <span
                    key={index}
                    style={{
                      backgroundColor: '#007AFF',
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <div style={{ marginBottom: '10px' }}>
            <strong>Video ID:</strong> {result.videoId}
          </div>

          {result.thumbnail && (
            <div style={{ marginTop: '15px' }}>
              <img 
                src={result.thumbnail} 
                alt="Video thumbnail" 
                style={{
                  width: '100%',
                  borderRadius: '4px'
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
