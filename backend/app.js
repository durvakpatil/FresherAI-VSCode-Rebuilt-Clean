import express from 'express';
import cors from 'cors';
import agentRoutes from './routes/agentRoutes.js';
import { requireAuthentication } from './middleware/authenticationMiddleware.js';

export const app = express();

// Allow the Vite frontend to call the backend during local development.
app.use(cors({ origin: process.env.FRONTEND_URL || true }));
app.use(express.json({ limit: '1mb' }));

// Simple health check for local/deployed monitoring.
app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'FresherAI backend' }));

// Every application API request is authenticated before it reaches a route.
app.use('/api', requireAuthentication, agentRoutes);
