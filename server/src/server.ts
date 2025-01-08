import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import summariesRoutes from './routes/summaries';

// Load environment variables
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Routes
app.use('/api', summariesRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 