import express from 'express';
import cors from 'cors';
import bmiRoutes from './routes/bmiRoutes.js';
import calorieRoutes from './routes/calorieRoutes.js';
import ageRoutes from './routes/ageRoutes.js';
import foodRoutes from './routes/foodRoutes.js';
import feedingPlanRoutes from './routes/feedingPlanRoutes.js';
import authRoutes from './routes/authRoutes.js';
import catsRoutes from './routes/catsRoutes.js';
import logsRoutes from './routes/logsRoutes.js';
import { logging } from './middleware/logging.js';
import { securityHeaders } from './middleware/securityHeaders.js';
import { rateLimit } from './middleware/rateLimit.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const app = express();

//core middlewrea
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:4200',
  credentials: true
}));
app.use(express.json({ limit: '10kb' }));
app.use(logging);
app.use(securityHeaders);
app.use(rateLimit);

//calc routes(public)
app.use('/api/bmi', bmiRoutes);
app.use('/api/calorie', calorieRoutes);
app.use('/api/age', ageRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/feeding-plan', feedingPlanRoutes);

//auth routes(public)
app.use('/api/auth', authRoutes);

//protectedroutes
app.use('/api/cats', catsRoutes);
app.use('/api/cats/:catId/logs', logsRoutes);

//error handling
app.use(notFound);
app.use(errorHandler);

export default app;

