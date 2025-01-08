import { useState, useEffect } from 'react';

const loadingMessages = [
  "Accessing TikTok video...",
  "Scanning video content...",
  "Analyzing metadata...",
  "Generating AI summary...",
  "Processing results..." // This will be the final state
];

interface LoadingIndicatorProps {
  onCancel: () => void;
  onRetry?: () => void;
}

export const LoadingIndicator = ({ onCancel, onRetry }: LoadingIndicatorProps) => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [showCancel, setShowCancel] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    const messageTimer = setTimeout(() => {
      if (messageIndex < loadingMessages.length - 1) {
        setMessageIndex(prev => prev + 1);
      } else {
        setIsProcessing(true);
      }
    }, 3000);

    const cancelTimer = setTimeout(() => {
      setShowCancel(true);
    }, 30000);

    return () => {
      clearTimeout(messageTimer);
      clearTimeout(cancelTimer);
    };
  }, [messageIndex]);

  const handleCancelClick = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmCancel = () => {
    setShowConfirmDialog(false);
    onCancel();
  };

  const handleCancelDialog = () => {
    setShowConfirmDialog(false);
  };

  return (
    <div style={{
      textAlign: 'center',
      marginTop: '20px',
      padding: '20px',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px',
      color: '#000000',
      position: 'relative'
    }}>
      <div style={{
        marginBottom: '10px',
        fontSize: '24px',
        animation: 'spin 1s linear infinite'
      }}>⏳</div>
      
      <div style={{ marginBottom: showCancel ? '15px' : '0' }}>
        {loadingMessages[messageIndex]}
        {isProcessing && <span className="processing-dots"></span>}
      </div>

      {showCancel && !showConfirmDialog && (
        <div>
          <div style={{
            fontSize: '14px',
            color: '#666',
            marginBottom: '10px'
          }}>
            Still working in the background. This is taking longer than usual.
          </div>
          <button
            onClick={handleCancelClick}
            style={{
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Cancel Request
          </button>
        </div>
      )}

      {showConfirmDialog && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          width: '90%',
          maxWidth: '300px',
          zIndex: 1000
        }}>
          <div style={{ marginBottom: '15px', fontWeight: 'bold' }}>
            Cancel Request?
          </div>
          <div style={{ marginBottom: '20px', fontSize: '14px', color: '#666' }}>
            Are you sure you want to cancel this request? Any progress will be lost.
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              onClick={handleCancelDialog}
              style={{
                backgroundColor: '#f8f9fa',
                color: '#212529',
                border: '1px solid #dee2e6',
                padding: '6px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              No, Continue
            </button>
            <button
              onClick={handleConfirmCancel}
              style={{
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Yes, Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}; 