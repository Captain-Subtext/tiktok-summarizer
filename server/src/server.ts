import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import summariesRoutes from './routes/summaries';
import testSummariesRouter from './routes/testSummaries';

// Load environment variables
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Add this after the test endpoint
app.post('/api/test-summary-direct', (req, res) => {
  console.log('Direct test route hit');
  res.json({ status: 'ok', message: 'Direct route working' });
});

// Routes
app.use('/api', summariesRoutes);
app.use('/api', testSummariesRouter);

// Add before routes
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} received`);
  next();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 