"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const ValidationService_1 = require("../services/ValidationService");
const validateRequest_1 = require("../utils/validateRequest");
const errorHandler_1 = require("../utils/errorHandler");
const validateRouter = (0, express_1.Router)();
const validationService = new ValidationService_1.ValidationService();
validateRouter.post('/', [
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
        const validationResult = await validationService.validate(schema_version, payload);
        if (!validationResult.valid) {
            return res.status(400).json({
                status: 'error',
                message: 'Validation failed',
                errors: validationResult.errors?.map(error => ({
                    path: error.path || '/',
                    message: error.message,
                    details: error.details || {}
                })) || [],
                schema_version
            });
        }
        res.json({
            status: 'success',
            message: 'Payload is valid',
            details: {
                ...validationResult.details,
                schema_version
            }
        });
    }
    catch (error) {
        if (error instanceof errorHandler_1.AppError) {
            next(error);
        }
        else {
            next(new errorHandler_1.AppError(500, 'Validation service error'));
        }
    }
});
exports.default = validateRouter;
