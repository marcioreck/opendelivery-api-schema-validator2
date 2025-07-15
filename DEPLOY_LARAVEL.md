# Deploy para Laravel - fazmercado.com

## Estrutura de Deploy

O projeto foi configurado para funcionar perfeitamente com a estrutura do Laravel em `fazmercado.com`. A aplicação completa fica em uma única pasta que é servida pela rota Laravel.

### Estrutura no Servidor Laravel

```
/path/to/fazmercado.com/
├── public/
│   └── opendelivery-api-schema-validator2/     # Aplicação completa
│       ├── index.html                          # Frontend (raiz)
│       ├── assets/                             # CSS/JS do frontend
│       │   ├── index-*.js
│       │   ├── vendor-*.js
│       │   └── ui-*.js
│       └── api/                               # Backend API
│           ├── index.js                       # Servidor Express
│           ├── package.json
│           ├── node_modules/
│           ├── schemas/                       # Esquemas OpenDelivery
│           ├── .env.production
│           └── start-production.sh
```

### URLs de Acesso

- **Frontend**: `https://fazmercado.com/opendelivery-api-schema-validator2/`
- **Backend API**: `https://fazmercado.com/opendelivery-api-schema-validator2/api/`

### Configuração da Rota Laravel

No arquivo `routes/web.php` do Laravel, configure:

```php
Route::get('/opendelivery-api-schema-validator2/{any?}', function () {
    return view('opendelivery-validator');
})->where('any', '.*');
```

E crie uma view que serve o `index.html` da aplicação:

```php
// resources/views/opendelivery-validator.blade.php
<!DOCTYPE html>
<html>
<head>
    <title>OpenDelivery API Schema Validator 2</title>
    <base href="/opendelivery-api-schema-validator2/">
</head>
<body>
    {!! file_get_contents(public_path('opendelivery-api-schema-validator2/index.html')) !!}
</body>
</html>
```

### Processo de Deploy

1. **Build Local**: Execute `./deploy.sh` no projeto
2. **Upload**: Copie `deploy/public/opendelivery-api-schema-validator2/` para o servidor
3. **Configuração**: Configure o backend na pasta `/api/`
4. **Inicialização**: Execute `start-production.sh` para iniciar a API

### Deploy Automático via GitHub Actions

O arquivo `.github/workflows/deploy.yml` está configurado para:

1. Fazer build do frontend e backend
2. Criar estrutura unificada
3. Fazer upload via SSH para o servidor
4. Instalar dependências do backend
5. Reiniciar o serviço

### Secrets do GitHub Actions

Configure no GitHub (Settings > Secrets and variables > Actions):

- `SSH_HOST`: fazmercado.com
- `SSH_USER`: usuário do servidor
- `SSH_KEY`: chave privada SSH
- `TARGET_DIR`: `/path/to/fazmercado.com/public/opendelivery-api-schema-validator2`

### Configuração do Backend

O backend Express está configurado para:

- Porta: 3001
- CORS: https://fazmercado.com
- Frontend URL: https://fazmercado.com/opendelivery-api-schema-validator2

### Verificação de Funcionamento

1. **Frontend**: Acesse `https://fazmercado.com/opendelivery-api-schema-validator2/`
2. **API Health**: Teste `https://fazmercado.com/opendelivery-api-schema-validator2/api/health`
3. **Validação**: Teste via interface ou diretamente na API

### Logs e Monitoramento

- Logs do backend: pasta `/api/logs/`
- Status do serviço: `ps aux | grep node`
- Reiniciar: `cd /api && ./start-production.sh`

---

Esta configuração permite que a aplicação funcione como uma aplicação isolada dentro do framework Laravel, similar ao validador oficial em `https://programmersit.github.io/opendelivery-api-schema-validator/`.
