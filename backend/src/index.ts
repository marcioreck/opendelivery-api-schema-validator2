import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { logger } from './utils/logger';
import { errorHandler } from './utils/errorHandler';
import validateRouter from './controllers/validateController';
import { compatibilityRouter } from './controllers/compatibilityController';
import { certifyRouter } from './controllers/certifyController';
import { SchemaManager } from './services/SchemaManager';

const app = express();
const port = process.env.PORT || 3001;

// Initialize schema manager
const schemaManager = new SchemaManager();

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
app.get('/api/health', (_, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'OpenDelivery API Schema Validator 2'
  });
});

// Error handling
app.use(errorHandler);

// Start server with schema loading
async function startServer() {
  try {
    // Load OpenDelivery schemas
    await schemaManager.loadSchemas();
    logger.info('Schemas loaded successfully');
    
    app.listen(port, () => {
      logger.info(`Server is running on port ${port}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer(); 