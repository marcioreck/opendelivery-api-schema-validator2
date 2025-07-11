import { Router } from 'express';
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
      .matches(/^\d+\.\d+\.\d+(-rc)?$/)
      .withMessage('Invalid from version format'),
    body('to_version')
      .isString()
      .matches(/^\d+\.\d+\.\d+(-rc)?$/)
      .withMessage('Invalid to version format'),
    body('payload')
      .isObject()
      .withMessage('Payload must be a valid JSON object'),
  ],
  validateRequest,
  async (req, res, next) => {
    try {
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