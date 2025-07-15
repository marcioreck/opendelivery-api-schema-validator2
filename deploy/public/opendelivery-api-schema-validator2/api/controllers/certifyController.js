"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.certifyRouter = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const CertificationService_1 = require("../services/CertificationService");
const validateRequest_1 = require("../utils/validateRequest");
const errorHandler_1 = require("../utils/errorHandler");
const certifyRouter = (0, express_1.Router)();
exports.certifyRouter = certifyRouter;
const certificationService = new CertificationService_1.CertificationService();
certifyRouter.post('/', [
    (0, express_validator_1.body)('schema_version')
        .isString()
        .matches(/^\d+\.\d+\.\d+(-rc)?$/)
        .withMessage('Invalid schema version format'),
    (0, express_validator_1.body)('payload')
        .isObject()
        .withMessage('Payload must be a valid JSON object'),
], validateRequest_1.validateRequest, async (req, res, next) => {
    try {
        const { schema_version, payload } = req.body;
        const certificationResult = await certificationService.certify(schema_version, payload);
        res.json({
            status: 'success',
            ...certificationResult,
        });
    }
    catch (error) {
        if (error instanceof errorHandler_1.AppError) {
            next(error);
        }
        else {
            next(new errorHandler_1.AppError(500, 'Certification service error'));
        }
    }
});
