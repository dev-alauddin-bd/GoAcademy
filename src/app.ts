// src/app.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.config';


const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: [
    env.FRONTEND_URL,
    'http://localhost:3000',
    /\.lms\.com$/,
  ],
  credentials: true,
}));
app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
// app.use('/api/v1');

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes

// Add more routes...

// Stripe webhook (raw body needed)
// app.post('/api/v1/webhooks/stripe', express.raw({ type: 'application/json' }), (req, res) => {
//   // Handle stripe webhook
// });

// Error handling


// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

const PORT = env.PORT;
app.listen(PORT, () => {
  console.log(`🚀 LMS Server running on port ${PORT}`);
  console.log(`📚 Environment: ${env.NODE_ENV}`);
});

export default app;