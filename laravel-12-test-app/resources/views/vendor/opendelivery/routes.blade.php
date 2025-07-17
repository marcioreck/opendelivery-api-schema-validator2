@extends('opendelivery::layouts.app')

@section('title', 'OpenDelivery API Schema Validator 2 - Routes')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-10">
            <div class="card">
                <div class="card-header">
                    <h3>🚀 OpenDelivery API Schema Validator 2 - Rotas Disponíveis</h3>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6">
                            <h5>📱 Interfaces de Usuário</h5>
                            <ul class="list-group mb-3">
                                <li class="list-group-item">
                                    <a href="/opendelivery-api-schema-validator2" class="text-decoration-none">
                                        <strong>🎯 React Interface (Principal)</strong>
                                    </a>
                                    <br><small class="text-muted">/opendelivery-api-schema-validator2</small>
                                </li>
                                <li class="list-group-item">
                                    <a href="/opendelivery-api-schema-validator2/react" class="text-decoration-none">
                                        <strong>⚛️ React Interface (Direta)</strong>
                                    </a>
                                    <br><small class="text-muted">/opendelivery-api-schema-validator2/react</small>
                                </li>
                                <li class="list-group-item">
                                    <a href="/opendelivery-api-schema-validator2/blade" class="text-decoration-none">
                                        <strong>🔧 Blade Dashboard</strong>
                                    </a>
                                    <br><small class="text-muted">/opendelivery-api-schema-validator2/blade</small>
                                </li>
                            </ul>
                        </div>
                        <div class="col-md-6">
                            <h5>🔍 Monitoramento</h5>
                            <ul class="list-group mb-3">
                                <li class="list-group-item">
                                    <a href="/opendelivery-api-schema-validator2/health" class="text-decoration-none">
                                        <strong>💓 Health Check</strong>
                                    </a>
                                    <br><small class="text-muted">/opendelivery-api-schema-validator2/health</small>
                                </li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="row">
                        <div class="col-md-12">
                            <h5>🔗 API Endpoints</h5>
                            <div class="table-responsive">
                                <table class="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>Método</th>
                                            <th>Endpoint</th>
                                            <th>Descrição</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><span class="badge bg-success">POST</span></td>
                                            <td>/opendelivery-api-schema-validator2/validate</td>
                                            <td>Validar payload contra esquema específico</td>
                                        </tr>
                                        <tr>
                                            <td><span class="badge bg-success">POST</span></td>
                                            <td>/opendelivery-api-schema-validator2/compatibility</td>
                                            <td>Verificar compatibilidade entre versões</td>
                                        </tr>
                                        <tr>
                                            <td><span class="badge bg-success">POST</span></td>
                                            <td>/opendelivery-api-schema-validator2/certify</td>
                                            <td>Obter certificação OpenDelivery Ready</td>
                                        </tr>
                                        <tr>
                                            <td><span class="badge bg-primary">GET</span></td>
                                            <td>/opendelivery-api-schema-validator2/schemas</td>
                                            <td>Listar versões de esquemas disponíveis</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    
                    <div class="alert alert-info mt-4">
                        <h6>ℹ️ Informações Importantes</h6>
                        <ul class="mb-0">
                            <li><strong>Rota Principal:</strong> Acesse <code>/opendelivery-api-schema-validator2</code> para a interface React completa</li>
                            <li><strong>APIs Unificadas:</strong> Todos os endpoints agora usam o prefixo <code>/opendelivery-api-schema-validator2/</code></li>
                            <li><strong>Integração:</strong> Use os endpoints <code>/validate</code>, <code>/compatibility</code>, <code>/certify</code> para integração</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
