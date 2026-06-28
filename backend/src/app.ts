import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { errorHandler } from './middlewares/error.middleware.js';
import { requestLogger } from './middlewares/logger.middleware.js';
import userRoutes from './routes/user.routes.js';
import taskRoutes from './routes/task.routes.js';
import goalRoutes from './routes/goal.routes.js';
import habitRoutes from './routes/habit.routes.js';
import authRoutes from './routes/auth.routes.js';
import aiRoutes from './routes/ai.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import focusBlockRoutes from './routes/focus_block.routes.js';
import notificationRoutes from './routes/notification.routes.js';

const app = express();

app.use((helmet as any)({ crossOriginResourcePolicy: false }));
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174'
  ],
  credentials: true,
}));
app.use(express.json());
app.use(requestLogger);

// Rate Limiters
const generalLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 300 });
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 });
const aiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 });

// Monitoring Endpoints
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'backend' }));
app.get('/live', (req, res) => res.json({ status: 'alive' }));
app.get('/ready', (req, res) => res.json({ status: 'ready' }));

app.use('/api/users', generalLimiter, userRoutes);
app.use('/api/tasks', generalLimiter, taskRoutes);
app.use('/api/goals', generalLimiter, goalRoutes);
app.use('/api/habits', generalLimiter, habitRoutes);
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/ai', aiLimiter, aiRoutes);
app.use('/api/analytics', generalLimiter, analyticsRoutes);
app.use('/api/focus-blocks', generalLimiter, focusBlockRoutes);
app.use('/api/notifications', generalLimiter, notificationRoutes);

app.use(errorHandler);

export default app;
