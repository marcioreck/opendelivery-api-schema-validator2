import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { logger } from './utils/logger';
import { errorHandler } from './utils/errorHandler';
import validateRouter from './controllers/validateController';
import { compatibilityRouter } from './controllers/compatibilityController';
import { certifyRouter } from './controllers/certifyController';

const app = express();
const port = process.env.PORT || 8000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));

// Routes
app.use('/api/validate', validateRouter);
app.use('/api/compatibility', compatibilityRouter);
app.use('/api/certify', certifyRouter);

// Health check endpoint
app.get('/health', (_, res) => {
  res.json({ status: 'ok' });
});

// Error handling
app.use(errorHandler);

// Start server
app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
}); 