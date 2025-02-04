export interface ApiResponse<T> {
  status: 'success' | 'error';
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  videos: T[];
  total: number;
  page: number;
  pageSize: number;
}

export type ApiError = {
  status: 'error';
  message: string;
  details?: Array<{
    code: string;
    message: string;
    path: string[];
  }>;
} 