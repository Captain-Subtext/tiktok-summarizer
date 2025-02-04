import { AppResponse, AppError } from '../types/express';

export function addResponseHelpers(res: AppResponse) {
  res.sendSuccess = function(data: unknown) {
    return this.json({
      status: 'success',
      data
    });
  };

  res.sendError = function(error: AppError) {
    return this.status(error.statusCode || 500).json({
      status: 'error',
      message: error.message
    });
  };
} 