# Troubleshooting de Deploy - OpenDelivery API Schema Validator 2

## Problemas Comuns e Soluções

### 1. Erro 404 nos Assets (CSS/JS)

**Problema:** Arquivos CSS/JS não são encontrados (404):
```
GET /opendelivery-api-schema-validator2/assets/index-BDcncAON.js 404 (Not Found)
GET /opendelivery-api-schema-validator2/assets/vendor-D9s9tBNk.js 404 (Not Found)
```

**Solução:**
1. Verifique se o build foi feito corretamente:
   ```bash
   cd frontend
   npm run build
   ```

2. Certifique-se que o diretório `dist/assets/` contém os arquivos:
   - `index-[hash].js`
   - `vendor-[hash].js`
   - `ui-[hash].js`
   - `monaco-[hash].js`
   - `monaco-[hash].css`

3. Copie o conteúdo de `frontend/dist/` para o diretório web:
   ```bash
   # Para Laravel com a estrutura de rota configurada
   cp -r frontend/dist/* /var/www/html/public/opendelivery-api-schema-validator2/
   ```

4. Verifique se o `.htaccess` está presente e correto no diretório:
   ```apache
   RewriteEngine On
   RewriteBase /opendelivery-api-schema-validator2/
   
   # Servir arquivos estáticos diretamente
   RewriteCond %{REQUEST_FILENAME} -f
   RewriteRule ^.*$ - [L]
   
   # Redirecionar assets para o caminho correto
   RewriteRule ^assets/(.*)$ /opendelivery-api-schema-validator2/assets/$1 [L]
   ```

### 2. Erro de CSP (Content Security Policy)

**Problema:** Scripts externos bloqueados pelo CSP:
```
Refused to load the script 'https://img1.wsimg.com/traffic-assets/js/tccl.min.js' because it violates CSP
```

**Solução:**
1. Se você tem scripts externos do seu framework (Laravel, WordPress, etc.), adicione o domínio ao CSP no `index.html`:
   ```html
   <meta http-equiv="Content-Security-Policy" content="
     script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://img1.wsimg.com;
   ">
   ```

2. Para máxima segurança, remova ou desabilite scripts externos desnecessários.

### 3. Favicon 404

**Problema:** `favicon.svg` não encontrado.

**Solução:**
1. Certifique-se que o arquivo existe em `dist/favicon.svg`
2. Verifique se o `.htaccess` está servindo arquivos SVG corretamente

### 4. Verificação de Deploy

**Checklist antes do deploy:**
- [ ] `npm run build` executado sem erros
- [ ] Diretório `dist/` contém todos os arquivos necessários
- [ ] `.htaccess` copiado para o diretório web
- [ ] `index.html` referencia os assets com hash correto
- [ ] CSP configurado para permitir scripts necessários
- [ ] Servidor web configurado para servir arquivos estáticos

**Teste rápido:**
```bash
# Verifique se os assets existem
ls -la /var/www/html/public/opendelivery-api-schema-validator2/assets/

# Teste se o .htaccess está funcionando
curl -I https://fazmercado.com/public/opendelivery-api-schema-validator2/assets/index-[hash].js

# Teste a rota Laravel
curl -I https://fazmercado.com/opendelivery-api-schema-validator2
```

## Estrutura de Deploy no Laravel

### Configuração da Rota
```php
// No arquivo routes/web.php
Route::get('/opendelivery-api-schema-validator2', function () {
    return redirect('/public/opendelivery-api-schema-validator2/');
})->name('opendelivery-api-schema-validator2');
```

### Estrutura de Diretórios
```
/var/www/html/public/opendelivery-api-schema-validator2/
├── .htaccess
├── index.html
├── favicon.svg
└── assets/
    ├── index-[hash].js
    ├── vendor-[hash].js
    ├── ui-[hash].js
    ├── monaco-[hash].js
    ├── monaco-[hash].css
    └── codicon-[hash].ttf
```

### Como Funciona
1. **Rota Laravel**: `/opendelivery-api-schema-validator2` → redireciona para `/public/opendelivery-api-schema-validator2/`
2. **Arquivos Estáticos**: Servidos diretamente pelo Apache/Nginx da pasta `public/`
3. **SPA Routing**: O `.htaccess` gerencia as rotas internas do React

### URLs de Acesso
- **Rota principal**: `https://fazmercado.com/opendelivery-api-schema-validator2`
- **Acesso direto**: `https://fazmercado.com/public/opendelivery-api-schema-validator2/`
- **Assets**: `https://fazmercado.com/public/opendelivery-api-schema-validator2/assets/`

## Comandos para Deploy Manual

```bash
# 1. Fazer build
cd /home/hoffamann/dev/opendelivery-api-schema-validator2/frontend
npm run build

# 2. Fazer backup do deploy anterior (opcional)
mv /var/www/html/public/opendelivery-api-schema-validator2 /var/www/html/public/opendelivery-api-schema-validator2.backup

# 3. Copiar novo build
cp -r dist /var/www/html/public/opendelivery-api-schema-validator2

# 4. Verificar permissões
chmod -R 755 /var/www/html/public/opendelivery-api-schema-validator2
```

## Logs Úteis

**Apache Error Log:**
```bash
tail -f /var/log/apache2/error.log | grep opendelivery
```

**Apache Access Log:**
```bash
tail -f /var/log/apache2/access.log | grep opendelivery
```

**Verificar CSP Headers:**
```bash
# Teste da rota Laravel (redireciona)
curl -I https://fazmercado.com/opendelivery-api-schema-validator2

# Teste direto da aplicação
curl -I https://fazmercado.com/public/opendelivery-api-schema-validator2/
```
