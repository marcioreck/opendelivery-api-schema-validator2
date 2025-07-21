import { Router } from 'express';
import { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { ValidationService } from '../services/ValidationService';
import { validateRequest } from '../utils/validateRequest';
import { AppError } from '../utils/errorHandler';

const validateRouter = Router();
const validationService = new ValidationService();

validateRouter.post(
  '/',
  [
    body('version')
      .isString()
      .matches(/^\d+\.\d+\.\d+(-rc|-beta|\.beta|beta)?$/)
      .withMessage('Invalid schema version format'),
    body('payload')
      .isObject()
      .withMessage('Payload must be a valid JSON object'),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { version, payload } = req.body;

      const validationResult = await validationService.validate(version, payload);

      if (!validationResult.valid) {
        return res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: validationResult.errors?.map(error => ({
            path: (error as any).path || '/',
            message: error.message,
            details: (error as any).details || {}
          })) || [],
          schema_version: version
        });
      }

      res.json({
        status: 'success',
        details: {
          schema_version: version,
          validated_at: validationResult.details?.validated_at || new Date().toISOString()
        }
      });
    } catch (error) {
      if (error instanceof AppError) {
        next(error);
      } else {
        next(new AppError(500, 'Validation service error'));
      }
    }
  }
);

export default validateRouter; 