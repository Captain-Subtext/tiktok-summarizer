import { useState, useEffect, useCallback } from 'react';
import type { TestOutput } from '../types/TestOutput';

interface TestQueueMonitorProps {
  videoId: string;
  onStatusChange?: (status: TestOutput) => void;
}

export const TestQueueMonitor: React.FC<TestQueueMonitorProps> = ({ 
  videoId, 
  onStatusChange 
}) => {
  const [status, setStatus] = useState<TestOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      const response = await fetch(`/api/test-queue/status/${videoId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch status');
      }
      const data = await response.json();
      setStatus(data);
      onStatusChange?.(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error fetching status');
    }
  }, [videoId, onStatusChange]);

  useEffect(() => {
    // Initial fetch
    fetchStatus();

    // Poll every 3 seconds while processing
    const interval = setInterval(() => {
      if (status?.status === 'processing') {
        fetchStatus();
      }
    }, 3000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId, status?.status, fetchStatus]);

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!status) {
    return <div>Loading status...</div>;
  }

  return (
    <div className="test-status-monitor p-4 bg-gray-50 rounded-lg">
      <div className="font-semibold mb-2">
        Status: {status.status.toUpperCase()}
      </div>
      
      {status.status === 'processing' && 'progress' in status && (
        <div className="progress-bar h-2 bg-gray-200 rounded">
          <div 
            className="h-full bg-blue-500 rounded transition-all duration-300"
            style={{ width: `${status.progress}%` }}
          />
        </div>
      )}

      {status.status === 'completed' && 'result' in status && (
        <div className="mt-2">
          <div>Summary: {status.result.summary}</div>
          <div>Confidence: {status.result.metrics.confidence}</div>
        </div>
      )}

      {status.status === 'failed' && 'error' in status && (
        <div className="text-red-500 mt-2">
          Error: {status.error.message}
        </div>
      )}
    </div>
  );
}; 