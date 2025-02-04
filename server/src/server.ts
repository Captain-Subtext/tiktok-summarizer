import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import summariesRoutes from './routes/summaries';
import testSummariesRouter from './routes/testSummaries';
import testVideosRouter from './routes/testVideos';
import { AppError, AppMiddlewareHandler, AppErrorHandler } from './types/express';
import { responseMiddleware } from './middleware/response';

// Load environment variables
dotenv.config();

const app = express();

// Middleware (must come before routes)
app.use(cors());
app.use(express.json());

// Logging middleware
const loggingMiddleware: AppMiddlewareHandler = (req, _res, next) => {
  console.log(`${req.method} ${req.path} received`);
  next();
};

// Error handler
const errorHandler: AppErrorHandler = (error, _req, res, _next) => {
  const statusCode = (error as AppError).statusCode || 500;
  res.status(statusCode).json({
    status: 'error',
    message: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
};

// Use the imported responseMiddleware
app.use(responseMiddleware);
app.use(loggingMiddleware);

// Routes
app.use('/api', testVideosRouter);
app.use('/api', summariesRoutes);
app.use('/api', testSummariesRouter);

// Error handler should be last
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 