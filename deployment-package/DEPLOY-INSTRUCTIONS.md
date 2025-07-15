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
