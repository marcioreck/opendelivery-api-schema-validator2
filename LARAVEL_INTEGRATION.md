# Integração com Laravel - OpenDelivery API Schema Validator 2

## Configuração da Rota Laravel

Adicione esta rota no arquivo `routes/web.php`:

```php
// opendelivery-api-schema-validator2
Route::get('/opendelivery-api-schema-validator2', function () {
    return redirect('/public/opendelivery-api-schema-validator2/');
})->name('opendelivery-api-schema-validator2');
```

## Estrutura de Diretórios

```
/var/www/html/
├── app/                              # Laravel app
├── public/                           # Laravel public
│   ├── opendelivery-api-schema-validator2/    # Nossa aplicação
│   │   ├── .htaccess                 # Configuração Apache
│   │   ├── index.html                # Aplicação React
│   │   ├── favicon.svg               # Ícone
│   │   └── assets/                   # Assets da aplicação
│   │       ├── index-[hash].js       # App principal
│   │       ├── vendor-[hash].js      # Bibliotecas
│   │       ├── ui-[hash].js          # Componentes UI
│   │       ├── monaco-[hash].js      # Editor Monaco
│   │       ├── monaco-[hash].css     # Estilos Monaco
│   │       └── codicon-[hash].ttf    # Fontes Monaco
│   └── index.php                     # Laravel index
├── routes/
│   └── web.php                       # Rotas Laravel
└── ...
```

## Fluxo de Funcionamento

1. **Usuário acessa**: `https://fazmercado.com/opendelivery-api-schema-validator2`
2. **Laravel processa**: Rota definida em `routes/web.php`
3. **Laravel redireciona**: Para `/public/opendelivery-api-schema-validator2/`
4. **Apache/Nginx serve**: Arquivos estáticos da pasta `public/`
5. **React Router**: Gerencia navegação interna da SPA

## Vantagens desta Configuração

- ✅ **SEO Friendly**: URL limpa sem `/public/`
- ✅ **Integração nativa**: Funciona perfeitamente com Laravel
- ✅ **Flexibilidade**: Pode adicionar middleware Laravel se necessário
- ✅ **Performance**: Arquivos estáticos servidos diretamente
- ✅ **Manutenção**: Fácil de atualizar e gerenciar

## Deploy Manual

```bash
# 1. Fazer build
cd /caminho/para/opendelivery-api-schema-validator2/frontend
npm run build

# 2. Copiar para Laravel
cp -r dist/* /var/www/html/public/opendelivery-api-schema-validator2/

# 3. Ajustar permissões
chmod -R 755 /var/www/html/public/opendelivery-api-schema-validator2/
```

## Deploy Automatizado

Use o script fornecido:

```bash
./deploy-production.sh
```

## Teste de Funcionamento

```bash
# Teste da rota Laravel (deve retornar 302)
curl -I https://fazmercado.com/opendelivery-api-schema-validator2

# Teste do acesso direto (deve retornar 200)
curl -I https://fazmercado.com/public/opendelivery-api-schema-validator2/

# Teste dos assets
curl -I https://fazmercado.com/public/opendelivery-api-schema-validator2/assets/index-[hash].js
```

## Possíveis Melhorias Futuras

Se necessário, você pode adicionar:

### Middleware para Autenticação
```php
Route::get('/opendelivery-api-schema-validator2', function () {
    return redirect('/public/opendelivery-api-schema-validator2/');
})->middleware('auth')->name('opendelivery-api-schema-validator2');
```

### Controller dedicado
```php
class OpenDeliveryController extends Controller
{
    public function index()
    {
        // Lógica adicional se necessário
        return redirect('/public/opendelivery-api-schema-validator2/');
    }
}
```

### Configuração de ambiente
```php
Route::get('/opendelivery-api-schema-validator2', function () {
    $basePath = config('app.env') === 'production' 
        ? '/public/opendelivery-api-schema-validator2/' 
        : '/opendelivery-api-schema-validator2/';
    
    return redirect($basePath);
})->name('opendelivery-api-schema-validator2');
```

## Logs e Monitoramento

Para monitorar a aplicação:

```bash
# Logs do Laravel
tail -f /var/www/html/storage/logs/laravel.log

# Logs do Apache
tail -f /var/log/apache2/access.log | grep opendelivery
tail -f /var/log/apache2/error.log | grep opendelivery
```

## Solução de Problemas

### 1. Rota não funciona
- Verifique se a rota está em `routes/web.php`
- Execute `php artisan route:cache` para limpar cache

### 2. Redirect loop
- Verifique se não há conflito com `.htaccess` do Laravel
- Certifique-se que o caminho do redirect está correto

### 3. Assets 404
- Verifique se os arquivos estão em `public/opendelivery-api-schema-validator2/`
- Confirme que o `.htaccess` está na pasta da aplicação

### 4. CSP Issues
- Ajuste o CSP no `index.html` se necessário
- Considere configurar CSP via Laravel headers

## Resultado Final

Com esta configuração, você terá:

- **URL principal**: https://fazmercado.com/opendelivery-api-schema-validator2
- **Funcionalidade completa**: Toda a aplicação funcionando
- **Integração Laravel**: Perfeita integração com o framework
- **Performance otimizada**: Assets servidos diretamente
- **Manutenibilidade**: Fácil de atualizar e gerenciar
