"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const logger_1 = require("./utils/logger");
const errorHandler_1 = require("./utils/errorHandler");
const validateController_1 = __importDefault(require("./controllers/validateController"));
const compatibilityController_1 = require("./controllers/compatibilityController");
const certifyController_1 = require("./controllers/certifyController");
const SchemaManager_1 = require("./services/SchemaManager");
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
// Initialize schema manager
const schemaManager = new SchemaManager_1.SchemaManager();
// Middleware
app.use((0, helmet_1.default)({
    contentSecurityPolicy: false, // Allow for development
    crossOriginEmbedderPolicy: false
}));
// CORS configuration for production
const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
        ? ['https://fazmercado.com', 'https://www.fazmercado.com']
        : ['http://localhost:8000', 'http://127.0.0.1:8000'],
    credentials: true
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use((0, morgan_1.default)('combined', { stream: { write: (message) => logger_1.logger.info(message.trim()) } }));
// Routes
app.use('/api/validate', validateController_1.default);
app.use('/api/compatibility', compatibilityController_1.compatibilityRouter);
app.use('/api/certify', certifyController_1.certifyRouter);
// Health check endpoint
app.get('/api/health', (_, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'OpenDelivery API Schema Validator 2'
    });
});
// Error handling
app.use(errorHandler_1.errorHandler);
// Start server with schema loading
async function startServer() {
    try {
        // Load OpenDelivery schemas
        await schemaManager.loadSchemas();
        logger_1.logger.info('Schemas loaded successfully');
        app.listen(port, () => {
            logger_1.logger.info(`Server is running on port ${port}`);
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to start server:', error);
        process.exit(1);
    }
}
startServer();
