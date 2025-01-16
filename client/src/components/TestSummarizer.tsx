import { useState } from 'react';
import { LoadingIndicator } from './LoadingIndicator';

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

export const TestSummarizer = () => {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<SummaryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('http://localhost:3000/api/test-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.status === 'error') {
        throw new Error(data.message);
      }
      
      setResult(data.data);
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
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

      {loading && <LoadingIndicator onCancel={() => setLoading(false)} />}

      {error && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#ffebee',
          borderRadius: '8px',
          color: '#c62828'
        }}>
          {error}
        </div>
      )}

      {result && !loading && (
        <div style={{
          backgroundColor: '#f5f5f5',
          padding: '20px',
          borderRadius: '8px',
          marginTop: '20px',
          color: '#000000'
        }}>
          <div style={{ marginBottom: '10px' }}>
            <strong>Author:</strong> {result.author.name}
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            <strong>Description:</strong> {result.description}
          </div>
          
          {result.aiSummary && result.aiSummary !== result.description && (
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
                {result.aiSummary.split('\n').map((line, index) => {
                  const cleanLine = line
                    .replace(/^###\s*/, '')
                    .replace(/####\s*\*\*/g, '')
                    .replace(/\*\*/g, '')
                    .replace(/^\d\.\s/, '')
                    .replace(/^#+ /, '')
                    .trim();

                  if (!cleanLine) return null;

                  if (line.includes('What are') || line.includes('Comprehensive Analysis')) {
                    return (
                      <h3 key={index} style={{
                        fontSize: '15px',
                        fontWeight: 'bold',
                        marginTop: '15px',
                        marginBottom: '8px',
                        color: '#0066cc'
                      }}>
                        {cleanLine}
                      </h3>
                    );
                  } else if (line.trim().startsWith('-')) {
                    return (
                      <div key={index} style={{
                        marginLeft: '15px',
                        marginBottom: '4px',
                        display: 'flex',
                        alignItems: 'flex-start'
                      }}>
                        <span style={{ marginRight: '8px' }}>•</span>
                        <span>{cleanLine.substring(1).trim()}</span>
                      </div>
                    );
                  } else if (line.trim().match(/^\d+\./)) {
                    return (
                      <div key={index} style={{
                        marginLeft: '15px',
                        marginBottom: '4px',
                        paddingLeft: '8px'
                      }}>
                        {cleanLine}
                      </div>
                    );
                  }
                  return (
                    <p key={index} style={{
                      margin: '4px 0'
                    }}>
                      {cleanLine}
                    </p>
                  );
                })}
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