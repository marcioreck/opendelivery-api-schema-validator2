import { Router } from 'express';
import { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { CertificationService } from '../services/CertificationService';
import { validateRequest } from '../utils/validateRequest';
import { AppError } from '../utils/errorHandler';

const certifyRouter = Router();
const certificationService = new CertificationService();

certifyRouter.post(
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

      const certificationResult = await certificationService.certify(
        version,
        payload
      );

      res.json({
        status: 'success',
        ...certificationResult,
      });
    } catch (error) {
      if (error instanceof AppError) {
        next(error);
      } else {
        next(new AppError(500, 'Certification service error'));
      }
    }
  }
);

export { certifyRouter }; 