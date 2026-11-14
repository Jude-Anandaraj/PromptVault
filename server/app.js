import express from 'express';
import cors from 'cors';
import { isDBConnected } from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import promptRoutes from './routes/promptRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const app = express();

// Allow the React app to call this API from the browser.
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));

// Read JSON request bodies into req.body.
app.use(express.json());

// Health check: confirms the API is running and the database is connected.
app.get('/api/health', (req, res) => {
  const connected = isDBConnected();
  res.status(connected ? 200 : 503).json({
    status: connected ? 'ok' : 'error',
    database: connected ? 'connected' : 'disconnected'
  });
});

// Feature routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/prompts', promptRoutes);
app.use('/api/categories', categoryRoutes);

// These two must stay last.
app.use(notFound);
app.use(errorHandler);

export default app;
