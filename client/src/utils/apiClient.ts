import { API_CONFIG, buildApiUrl } from '../config/api';
import type { ApiResponse, ApiError } from '../types/api';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export type ApiEndpoint = 
  | 'TEST_VIDEOS'
  | keyof typeof API_CONFIG.ENDPOINTS;

const API_ENDPOINTS: Record<ApiEndpoint, string> = {
  TEST_VIDEOS: '/api/test-videos',
  ...API_CONFIG.ENDPOINTS,
};

export async function apiClient<T>(
  endpoint: keyof typeof API_CONFIG.ENDPOINTS,
  options?: {
    params?: Record<string, string>;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: unknown;
  }
): Promise<T> {
  const url = buildApiUrl(endpoint, options?.params);
  
  const response = await fetch(url, {
    method: options?.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    body: options?.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await response.json();

  if (!response.ok || data.status === 'error') {
    throw new ApiError(
      response.status,
      'message' in data ? data.message : 'An unknown error occurred'
    );
  }

  return (data as ApiResponse<T>).data;
} 