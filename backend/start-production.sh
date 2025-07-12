#!/bin/bash

# Production start script for OpenDelivery API Schema Validator 2 Backend

# Set environment
export NODE_ENV=production
export PORT=3001

# Load environment variables
if [ -f .env.production ]; then
    source .env.production
fi

# Start the backend server
echo "Starting OpenDelivery API Schema Validator 2 Backend..."
echo "Environment: $NODE_ENV"
echo "Port: $PORT"

# Use PM2 for production process management (if available)
if command -v pm2 &> /dev/null; then
    echo "Using PM2 for process management..."
    pm2 start dist/index.js --name "opendelivery-api-backend" --env production
else
    echo "Starting with Node.js directly..."
    node dist/index.js
fi
