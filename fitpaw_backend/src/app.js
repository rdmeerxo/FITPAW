import express from 'express';
import cors from 'cors';
import bmiRoutes from './routes/bmiRoutes.js';
import calorieRoutes from './routes/calorieRoutes.js';
import ageRoutes from './routes/ageRoutes.js';
import foodRoutes from './routes/foodRoutes.js';
import feedingPlanRoutes from './routes/feedingPlanRoutes.js';
import { logging } from './middleware/logging.js';
import { securityHeaders } from './middleware/securityHeaders.js';
import { rateLimit } from './middleware/rateLimit.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const app = express();

// Core middleware
app.use(cors());
app.use(express.json({ limit: '10kb' }));
app.use(logging);
app.use(securityHeaders);
app.use(rateLimit);

// Routes
app.use('/api/bmi', bmiRoutes);
app.use('/api/calorie', calorieRoutes);
app.use('/api/age', ageRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/feeding-plan', feedingPlanRoutes);

// 404
app.use(notFound);
// Error handler
app.use(errorHandler);

export default app;
