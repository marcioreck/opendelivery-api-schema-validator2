#!/bin/bash

# Script de Deploy para Produção
# Prepara o backend para deployment em produção

echo "🚀 Preparando Backend para Produção..."

# 1. Compilar TypeScript
echo "📦 Compilando TypeScript..."
cd backend/
npm run build

# 2. Criar arquivo de produção
echo "⚙️  Criando configuração de produção..."
cat > .env.production << 'EOF'
NODE_ENV=production
PORT=3001
CORS_ORIGIN=https://fazmercado.com
LOG_LEVEL=info
EOF

# 3. Criar script de start para produção
echo "🔧 Criando script de start..."
cat > start-production.sh << 'EOF'
#!/bin/bash
export NODE_ENV=production
export PORT=3001
export CORS_ORIGIN=https://fazmercado.com
export LOG_LEVEL=info

echo "🚀 Iniciando OpenDelivery Backend..."
node dist/index.js
EOF

chmod +x start-production.sh

# 4. Criar configuração PM2
echo "🔄 Criando configuração PM2..."
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'opendelivery-backend',
    script: 'dist/index.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3001,
      CORS_ORIGIN: 'https://fazmercado.com',
      LOG_LEVEL: 'info'
    }
  }]
};
EOF

# 5. Criar pacote para upload
echo "📦 Criando pacote para upload..."
cd ..
mkdir -p deployment-package
cp -r backend/dist deployment-package/
cp -r backend/schemas deployment-package/
cp backend/package.json deployment-package/
cp backend/.env.production deployment-package/
cp backend/start-production.sh deployment-package/
cp backend/ecosystem.config.js deployment-package/

# 6. Criar instruções de deploy
cat > deployment-package/DEPLOY-INSTRUCTIONS.md << 'EOF'
# Instruções de Deploy

## 1. Upload dos arquivos
Faça upload desta pasta para o servidor em: `/home/user/opendelivery-backend/`

## 2. Instalar dependências
```bash
cd /home/user/opendelivery-backend/
npm install --production
```

## 3. Iniciar com PM2
```bash
pm2 start ecosystem.config.js
pm2 startup
pm2 save
```

## 4. Configurar Laravel
Adicione no .env do Laravel:
```
OPENDELIVERY_BACKEND_URL=http://localhost:3001
```

## 5. Testar
```bash
curl http://localhost:3001/api/health
```

## 6. Logs
```bash
pm2 logs opendelivery-backend
```
EOF

echo "✅ Backend preparado para produção!"
echo "📁 Arquivos em: deployment-package/"
echo "📋 Siga as instruções em: deployment-package/DEPLOY-INSTRUCTIONS.md"
