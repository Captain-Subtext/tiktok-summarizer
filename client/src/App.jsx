import { useState } from 'react'
import axios from 'axios'

function App() {
  const [url, setUrl] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setResult(null)
    setLoading(true)

    try {
      const response = await axios.post('http://localhost:3000/api/summary', { url })
      console.log('Server response:', response.data)
      
      if (response.data.status === 'success') {
        setResult(response.data.data)
      } else {
        setError('Could not get summary. Please try again.')
      }
    } catch (error) {
      console.error('Error:', error)
      setError('Could not get summary. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#1a1a1a',
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '20px',
        marginTop: '20px'
      }}>
        <h1 style={{
          color: 'black',
          textAlign: 'center',
          marginTop: '0',
          marginBottom: '20px',
          fontSize: '24px',
          fontWeight: 'bold'
        }}>
          TikTok Summarizer
        </h1>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="Paste TikTok URL here"
            style={{ 
              width: '100%',
              padding: '12px',
              marginBottom: error ? '5px' : '10px',
              borderRadius: '8px',
              border: error ? '1px solid #ff4444' : 'none',
              backgroundColor: '#333',
              color: 'white',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
          />

          {error && (
            <div style={{
              color: '#ff4444',
              fontSize: '14px',
              marginBottom: '10px',
              padding: '0 5px'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: loading ? '#cccccc' : '#007AFF',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'default' : 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            {loading ? 'Getting Summary...' : 'Get Summary'}
          </button>
        </form>

        {result && (
          <div style={{ 
            marginTop: '20px', 
            padding: '15px', 
            backgroundColor: '#f0f0f0',
            borderRadius: '8px',
            fontSize: '14px',
            color: 'black',
            wordBreak: 'break-word',
            lineHeight: '1.5'
          }}>
            {result.author && (
              <div style={{ marginBottom: '10px' }}>
                <strong>Author:</strong> {result.author.name}
              </div>
            )}
            
            {result.description && (
              <div style={{ marginBottom: '10px' }}>
                <strong>Description:</strong> {result.description}
              </div>
            )}

            {result.videoId && (
              <div style={{ marginBottom: '10px' }}>
                <strong>Video ID:</strong> {result.videoId}
              </div>
            )}

            {result.platform && (
              <div style={{ marginBottom: '10px' }}>
                <strong>Platform:</strong> {result.platform}
              </div>
            )}

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

            {result.music && (
              <div style={{ marginTop: '15px' }}>
                <strong>Music:</strong>
                <div style={{ marginBottom: '10px' }}>
                  <strong>Title:</strong> {result.music.title}
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <strong>URL:</strong> {result.music.url}
                </div>
              </div>
            )}

            {result.hashtags && result.hashtags.length > 0 && (
              <div style={{ marginBottom: '10px' }}>
                <strong>Tags:</strong>{' '}
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
          </div>
        )}
      </div>
    </div>
  )
}

export default App
