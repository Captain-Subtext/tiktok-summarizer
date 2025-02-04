import { Request, Response } from 'express';
import { AppMiddlewareHandler } from '../types/express';
import { addResponseHelpers } from '../utils/response';

export const responseMiddleware: AppMiddlewareHandler = (
  _req: Request, 
  res: Response,
  next
) => {
  addResponseHelpers(res);
  next();
}; 