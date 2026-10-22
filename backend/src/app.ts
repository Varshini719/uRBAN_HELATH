import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { config } from './config.js';
import dashboardRouter from './routes/dashboard.js';
import authRouter from './routes/auth.js';
import { districtsRouter, initiativesRouter, stationsRouter } from './routes/resources.js';
import { errorHandler, notFound } from './middleware/error.js';

export const app = express();
app.use(helmet()); app.use(cors({origin:config.CORS_ORIGIN})); app.use(compression());
app.use(express.json({limit:'1mb'})); app.use(morgan(config.NODE_ENV==='production'?'combined':'dev'));
app.get('/health', (_req,res)=>res.json({status:'ok',service:'urban-heat-api'}));
app.use('/api/auth', authRouter);
app.use('/api/dashboard',dashboardRouter); app.use('/api/districts',districtsRouter);
app.use('/api/stations',stationsRouter); app.use('/api/initiatives',initiativesRouter);
app.use(notFound); app.use(errorHandler);
