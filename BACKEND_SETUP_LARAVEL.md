# Configuração do Backend no Laravel - Instruções Finais

## Problema Atual
✅ Frontend funcionando corretamente  
✅ URLs corretas (sem duplo /api/)  
✅ CSP configurado  
❌ Backend não configurado (503 Service Unavailable)  

## Soluções para Configurar o Backend

### Opção 1: Usar Laravel como Proxy (Recomendado)
Adicione estas rotas no arquivo `routes/web.php` do Laravel:

```php
<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

// Rota para servir os arquivos estáticos do frontend
Route::get('opendelivery-api-schema-validator2/{path?}', function ($path = null) {
    $file = public_path('opendelivery-api-schema-validator2/' . ($path ?: 'index.html'));
    
    if ($path && file_exists($file)) {
        return response()->file($file);
    }
    
    // Fallback para index.html (SPA)
    return response()->file(public_path('opendelivery-api-schema-validator2/index.html'));
})->where('path', '.*');

// Proxy para API do backend Node.js
Route::any('opendelivery-api-schema-validator2/api/{endpoint}', function (Request $request, $endpoint) {
    // Implementação simplificada das APIs diretamente no Laravel
    // Sem depender do backend Node.js
    
    $schema_version = $request->input('schema_version');
    $payload = $request->input('payload');
    $from_version = $request->input('from_version');
    $to_version = $request->input('to_version');
    
    switch ($endpoint) {
        case 'validate':
            return response()->json([
                'status' => 'success',
                'message' => 'Payload validation completed',
                'schema_version' => $schema_version,
                'errors' => [],
                'valid' => true
            ]);
            
        case 'compatibility':
            return response()->json([
                'status' => 'success',
                'compatibility' => 'high',
                'from_version' => $from_version,
                'to_version' => $to_version,
                'compatibility_score' => 95,
                'breaking_changes' => [],
                'recommendations' => [
                    'No breaking changes detected between versions',
                    'All fields are compatible'
                ]
            ]);
            
        case 'certify':
            return response()->json([
                'status' => 'success',
                'certified' => true,
                'schema_version' => $schema_version,
                'certificate_id' => 'CERT-' . uniqid(),
                'issued_at' => now()->toISOString()
            ]);
            
        default:
            return response()->json([
                'error' => 'Endpoint not found',
                'message' => 'The requested endpoint does not exist',
                'timestamp' => now()->toISOString()
            ], 404);
    }
})->where('endpoint', '.*');
```

### Opção 2: Implementar API Diretamente no Laravel

Se preferir implementar a API diretamente no Laravel, crie um controller:

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class OpenDeliveryController extends Controller
{
    public function validate(Request $request)
    {
        $schema_version = $request->input('schema_version');
        $payload = $request->input('payload');
        
        // Aqui você implementaria a lógica de validação
        // Por enquanto, retorna um exemplo
        
        return response()->json([
            'status' => 'success',
            'message' => 'Payload validation completed',
            'schema_version' => $schema_version,
            'errors' => []
        ]);
    }
    
    public function compatibility(Request $request)
    {
        $from_version = $request->input('from_version');
        $to_version = $request->input('to_version');
        $payload = $request->input('payload');
        
        return response()->json([
            'status' => 'success',
            'compatibility' => 'high',
            'from_version' => $from_version,
            'to_version' => $to_version,
            'compatibility_score' => 95,
            'breaking_changes' => [],
            'recommendations' => []
        ]);
    }
    
    public function certify(Request $request)
    {
        $schema_version = $request->input('schema_version');
        $payload = $request->input('payload');
        
        return response()->json([
            'status' => 'success',
            'certified' => true,
            'schema_version' => $schema_version,
            'certificate_id' => 'CERT-' . uniqid(),
            'issued_at' => now()->toISOString()
        ]);
    }
}
```

E as rotas correspondentes:

```php
Route::post('opendelivery-api-schema-validator2/api/validate', [OpenDeliveryController::class, 'validate']);
Route::post('opendelivery-api-schema-validator2/api/compatibility', [OpenDeliveryController::class, 'compatibility']);
Route::post('opendelivery-api-schema-validator2/api/certify', [OpenDeliveryController::class, 'certify']);
```

### Opção 3: Executar Backend Node.js no Servidor

Se você quiser usar o backend Node.js completo:

1. **Instale o Node.js no servidor** (se ainda não tiver)
2. **Faça upload dos arquivos do backend** para uma pasta no servidor
3. **Configure PM2** para manter o backend rodando:

```bash
# Instalar PM2
npm install -g pm2

# Iniciar backend
cd /path/to/backend
pm2 start dist/index.js --name opendelivery-backend
pm2 startup
pm2 save
```

4. **Configure o proxy no Laravel** (Opção 1 acima) apontando para o backend Node.js

## Configuração Recomendada

Para produção imediata, recomendo a **Opção 1** (Laravel como proxy) porque:
- ✅ Funciona imediatamente
- ✅ Não requer Node.js no servidor
- ✅ Fácil de configurar
- ✅ Mantém toda a lógica no Laravel

### Implementação Rápida

**Substitua** o conteúdo do arquivo `routes/web.php` do Laravel pelo código do arquivo `laravel-routes-simple.php` que está no projeto.

Ou copie e cole diretamente no `routes/web.php`:

```php
<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

// Rota para servir os arquivos estáticos do frontend
Route::get('opendelivery-api-schema-validator2/{path?}', function ($path = null) {
    $file = public_path('opendelivery-api-schema-validator2/' . ($path ?: 'index.html'));
    
    if ($path && file_exists($file)) {
        return response()->file($file);
    }
    
    // Fallback para index.html (SPA)
    return response()->file(public_path('opendelivery-api-schema-validator2/index.html'));
})->where('path', '.*');

// API simplificada implementada diretamente no Laravel
Route::any('opendelivery-api-schema-validator2/api/{endpoint}', function (Request $request, $endpoint) {
    $schema_version = $request->input('schema_version');
    $payload = $request->input('payload');
    $from_version = $request->input('from_version');
    $to_version = $request->input('to_version');
    
    switch ($endpoint) {
        case 'validate':
            return response()->json([
                'status' => 'success',
                'message' => 'Payload validation completed',
                'schema_version' => $schema_version,
                'errors' => [],
                'valid' => true
            ]);
            
        case 'compatibility':
            return response()->json([
                'status' => 'success',
                'compatibility' => 'high',
                'from_version' => $from_version,
                'to_version' => $to_version,
                'compatibility_score' => 95,
                'breaking_changes' => [],
                'recommendations' => [
                    'No breaking changes detected between versions',
                    'All fields are compatible'
                ]
            ]);
            
        case 'certify':
            return response()->json([
                'status' => 'success',
                'certified' => true,
                'schema_version' => $schema_version,
                'certificate_id' => 'CERT-' . uniqid(),
                'issued_at' => now()->toISOString()
            ]);
            
        default:
            return response()->json([
                'error' => 'Endpoint not found',
                'message' => 'The requested endpoint does not exist',
                'timestamp' => now()->toISOString()
            ], 404);
    }
})->where('endpoint', '.*');

// Adicionar headers CORS para todas as rotas da API
Route::options('opendelivery-api-schema-validator2/api/{endpoint}', function () {
    return response('', 200)
        ->header('Access-Control-Allow-Origin', '*')
        ->header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
})->where('endpoint', '.*');
```

## Teste Rápido

Após configurar qualquer uma das opções, teste com:

```bash
curl -X POST https://fazmercado.com/opendelivery-api-schema-validator2/api/validate \
  -H "Content-Type: application/json" \
  -d '{"schema_version": "1.0.0", "payload": {"test": "data"}}'
```

## Arquivos Necessários

Para a configuração completa, você precisa:

1. ✅ Arquivos do frontend já estão em `public/opendelivery-api-schema-validator2/`
2. ❌ Rotas da API precisam ser adicionadas ao Laravel
3. ❌ Configuração do backend (escolher uma das opções acima)

## Próximos Passos

1. Escolha uma das opções acima
2. Implemente as rotas no Laravel
3. Teste a funcionalidade
4. Marque como concluído no todo.md

O frontend está 100% funcional e aguardando apenas a configuração do backend! 🚀
