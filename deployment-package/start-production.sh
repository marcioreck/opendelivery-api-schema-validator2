#!/bin/bash
export NODE_ENV=production
export PORT=3001
export CORS_ORIGIN=https://fazmercado.com
export LOG_LEVEL=info

echo "🚀 Iniciando OpenDelivery Backend..."
node dist/index.js
