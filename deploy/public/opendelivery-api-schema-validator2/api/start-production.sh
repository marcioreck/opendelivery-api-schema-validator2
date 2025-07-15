#!/bin/bash
cd /path/to/fazmercado.com/public/opendelivery-api-schema-validator2/api
export NODE_ENV=production
export PORT=3001
export FRONTEND_URL=https://fazmercado.com/opendelivery-api-schema-validator2
export CORS_ORIGIN=https://fazmercado.com
node index.js
