import { Router } from 'express';
import { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { CompatibilityService } from '../services/CompatibilityService';
import { validateRequest } from '../utils/validateRequest';
import { AppError } from '../utils/errorHandler';

const compatibilityRouter = Router();
const compatibilityService = new CompatibilityService();

compatibilityRouter.post(
  '/',
  [
    body('fromVersion')
      .isString()
      .matches(/^\d+\.\d+\.\d+(-rc|-beta|\.beta|beta)?$/)
      .withMessage('Invalid from version format'),
    body('toVersion')
      .isString()
      .matches(/^\d+\.\d+\.\d+(-rc|-beta|\.beta|beta)?$/)
      .withMessage('Invalid to version format'),
    body('payload')
      .isObject()
      .withMessage('Payload must be a valid JSON object'),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log('📥 Compatibility request received:', req.body);
      const { fromVersion, toVersion, payload } = req.body;

      const compatibilityResult = await compatibilityService.checkCompatibility(
        fromVersion,
        toVersion,
        payload
      );

      res.json({
        status: 'success',
        ...compatibilityResult,
      });
    } catch (error) {
      if (error instanceof AppError) {
        next(error);
      } else {
        next(new AppError(500, 'Compatibility service error'));
      }
    }
  }
);

export { compatibilityRouter }; 