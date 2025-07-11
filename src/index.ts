import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { Validator } from './services/Validator';
import { logger } from './utils/logger';
import { ApiVersion } from './types';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const validator = new Validator();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Initialize validator before starting server
async function initializeApp() {
  try {
    await validator.initialize();
    logger.info('Validator initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize validator:', error);
    process.exit(1);
  }
}

// Routes
app.post('/validate', async (req, res) => {
  try {
    const { payload, version } = req.body;

    if (!payload) {
      return res.status(400).json({ error: 'Payload is required' });
    }

    if (version && !isValidVersion(version)) {
      return res.status(400).json({ error: 'Invalid API version' });
    }

    const result = version 
      ? await validator.validate(payload, version as ApiVersion)
      : await validator.validateAllVersions(payload);

    res.json(result);
  } catch (error) {
    logger.error('Validation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/compatibility', async (req, res) => {
  try {
    const { sourceVersion, targetVersion } = req.body;

    if (!sourceVersion || !targetVersion) {
      return res.status(400).json({ error: 'Source and target versions are required' });
    }

    if (!isValidVersion(sourceVersion) || !isValidVersion(targetVersion)) {
      return res.status(400).json({ error: 'Invalid API version' });
    }

    const result = await validator.checkCompatibility(
      sourceVersion as ApiVersion,
      targetVersion as ApiVersion
    );

    res.json(result);
  } catch (error) {
    logger.error('Compatibility check error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/breaking-changes', async (req, res) => {
  try {
    const { sourceVersion, targetVersion } = req.body;

    if (!sourceVersion || !targetVersion) {
      return res.status(400).json({ error: 'Source and target versions are required' });
    }

    if (!isValidVersion(sourceVersion) || !isValidVersion(targetVersion)) {
      return res.status(400).json({ error: 'Invalid API version' });
    }

    const result = await validator.checkBreakingChanges(
      sourceVersion as ApiVersion,
      targetVersion as ApiVersion
    );

    res.json(result);
  } catch (error) {
    logger.error('Breaking changes check error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/certify', async (req, res) => {
  try {
    const { payload } = req.body;

    if (!payload) {
      return res.status(400).json({ error: 'Payload is required' });
    }

    const result = await validator.certify(payload);
    res.json({
      ...result,
      certificationDate: new Date().toISOString(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
    });
  } catch (error) {
    logger.error('Certification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/health', (_, res) => {
  res.json({ 
    status: 'ok',
    lastSchemaUpdate: validator.getLastSchemaUpdateTime()
  });
});

// Helper function to validate API version
function isValidVersion(version: string): version is ApiVersion {
  const validVersions: ApiVersion[] = ['1.0.0', '1.1.0', '1.2.0', '1.3.0', '1.4.0', '1.5.0', '1.6.0-rc'];
  return validVersions.includes(version as ApiVersion);
}

// Start server after initialization
initializeApp().then(() => {
  app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
  });
}); 