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
    body('from_version')
      .isString()
      .matches(/^\d+\.\d+\.\d+(-rc|beta)?$/)
      .withMessage('Invalid from version format'),
    body('to_version')
      .isString()
      .matches(/^\d+\.\d+\.\d+(-rc|beta)?$/)
      .withMessage('Invalid to version format'),
    body('payload')
      .isObject()
      .withMessage('Payload must be a valid JSON object'),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log('📥 Compatibility request received:', req.body);
      const { from_version, to_version, payload } = req.body;

      const compatibilityResult = await compatibilityService.checkCompatibility(
        from_version,
        to_version,
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