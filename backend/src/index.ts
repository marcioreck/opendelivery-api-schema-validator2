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
app.use(helmet({
  contentSecurityPolicy: false, // Allow for development
  crossOriginEmbedderPolicy: false
}));

// CORS configuration for local development
const corsOptions = {
  origin: [
    'http://localhost:8000', 
    'http://127.0.0.1:8000',
    'http://localhost:4173', // Vite preview port
    'http://127.0.0.1:4173',
    'http://localhost:5173', // Default Vite port
    'http://127.0.0.1:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));

// Routes
app.use('/api/validate', validateRouter);
app.use('/api/compatibility', compatibilityRouter);
app.use('/api/certify', certifyRouter);

// Health check endpoint
app.get('/api/health', (_, res) => {
  try {
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();
    
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'OpenDelivery API Schema Validator 2',
      version: '2.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: {
        seconds: Math.floor(uptime),
        human: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${Math.floor(uptime % 60)}s`
      },
      memory: {
        used: Math.round(memoryUsage.heapUsed / 1024 / 1024) + ' MB',
        total: Math.round(memoryUsage.heapTotal / 1024 / 1024) + ' MB',
        external: Math.round(memoryUsage.external / 1024 / 1024) + ' MB'
      },
      schemas: {
        available: ['1.0.0', '1.0.1', '1.1.0', '1.1.1', '1.2.0', '1.2.1', '1.3.0', '1.4.0', '1.5.0', '1.6.0-rc', 'beta'],
        count: 11
      },
      endpoints: {
        validate: '/api/validate',
        compatibility: '/api/compatibility',
        certify: '/api/certify',
        health: '/api/health'
      }
    };
    
    res.status(200).json(healthData);
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      service: 'OpenDelivery API Schema Validator 2',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
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