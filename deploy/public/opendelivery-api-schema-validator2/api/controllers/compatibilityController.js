"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compatibilityRouter = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const CompatibilityService_1 = require("../services/CompatibilityService");
const validateRequest_1 = require("../utils/validateRequest");
const errorHandler_1 = require("../utils/errorHandler");
const compatibilityRouter = (0, express_1.Router)();
exports.compatibilityRouter = compatibilityRouter;
const compatibilityService = new CompatibilityService_1.CompatibilityService();
compatibilityRouter.post('/', [
    (0, express_validator_1.body)('from_version')
        .isString()
        .matches(/^\d+\.\d+\.\d+(-rc)?$/)
        .withMessage('Invalid from version format'),
    (0, express_validator_1.body)('to_version')
        .isString()
        .matches(/^\d+\.\d+\.\d+(-rc)?$/)
        .withMessage('Invalid to version format'),
    (0, express_validator_1.body)('payload')
        .isObject()
        .withMessage('Payload must be a valid JSON object'),
], validateRequest_1.validateRequest, async (req, res, next) => {
    try {
        const { from_version, to_version, payload } = req.body;
        const compatibilityResult = await compatibilityService.checkCompatibility(from_version, to_version, payload);
        res.json({
            status: 'success',
            ...compatibilityResult,
        });
    }
    catch (error) {
        if (error instanceof errorHandler_1.AppError) {
            next(error);
        }
        else {
            next(new errorHandler_1.AppError(500, 'Compatibility service error'));
        }
    }
});
