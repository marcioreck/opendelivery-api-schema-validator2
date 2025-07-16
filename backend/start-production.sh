#!/bin/bash
export NODE_ENV=development
export PORT=3001
export LOG_LEVEL=info

echo "🚀 Iniciando OpenDelivery Backend..."
node dist/index.js
