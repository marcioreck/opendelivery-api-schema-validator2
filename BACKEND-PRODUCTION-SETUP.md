# Backend Setup para Produção

## Problema
O Laravel precisa se conectar ao backend Node.js real para fazer validações corretas, não pode simular.

## Solução: Backend Node.js em Produção

### Opção 1: Backend no mesmo servidor (Recomendado)

1. **Instalar Node.js no servidor:**
```bash
# No servidor de produção
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

2. **Fazer upload do backend:**
```bash
# Fazer upload da pasta backend/ para o servidor
# Exemplo: /home/user/opendelivery-backend/
```

3. **Instalar dependências:**
```bash
cd /home/user/opendelivery-backend/
npm install
```

4. **Configurar PM2 para manter backend rodando:**
```bash
sudo npm install -g pm2
pm2 start dist/index.js --name opendelivery-backend
pm2 startup
pm2 save
```

5. **Configurar variável de ambiente no Laravel:**
```bash
# Adicionar no .env do Laravel
OPENDELIVERY_BACKEND_URL=http://localhost:3001
```

### Opção 2: Backend externo

Se preferir hospedar o backend separadamente:

1. **Deploy do backend em serviço como Heroku, Railway, etc.**

2. **Configurar variável de ambiente no Laravel:**
```bash
# Adicionar no .env do Laravel
OPENDELIVERY_BACKEND_URL=https://seu-backend.herokuapp.com
```

## Configuração do Laravel

O arquivo `laravel-routes-complete.php` já está configurado para:
- Usar a variável `OPENDELIVERY_BACKEND_URL`
- Fazer proxy das requisições para o backend Node.js
- Tratar erros quando backend não está disponível

## Teste

Após configurar o backend:

```bash
# Testar se backend está rodando
curl http://localhost:3001/api/health

# Testar através do Laravel
curl https://fazmercado.com/opendelivery-api-schema-validator2/api/health
```

## Vantagens desta Abordagem

- ✅ Validação real usando schemas OpenDelivery
- ✅ Compatibilidade perfeita com desenvolvimento local
- ✅ Todas as funcionalidades funcionando corretamente
- ✅ Payloads inválidos são corretamente rejeitados

## Arquivos Necessários no Servidor

```
backend/
├── dist/           # Código compilado
├── schemas/        # Schemas OpenDelivery
├── package.json
├── .env.production
└── start-production.sh
```

---

**Conclusão**: O Laravel serve apenas como proxy. A validação real é feita pelo backend Node.js que contém toda a lógica de schemas OpenDelivery.
