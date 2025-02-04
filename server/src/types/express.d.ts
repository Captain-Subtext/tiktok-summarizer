import { Request, Response, NextFunction, RequestHandler, ErrorRequestHandler } from 'express';

// Custom error type
export interface AppError extends Error {
  statusCode?: number;
  status?: string;
}

// Response helpers interface
interface ResponseHelpers {
  sendSuccess(data: unknown): Response;
  sendError(error: AppError): Response;
}

// Extend Express Response
declare module 'express-serve-static-core' {
  interface Response extends ResponseHelpers {}
}

// Export Express types (now with our extensions)
export type AppRequest = Request;
export type AppResponse = Response;
export type AppRequestHandler = RequestHandler;
export type AppMiddlewareHandler = RequestHandler;
export type AppErrorHandler = ErrorRequestHandler; 