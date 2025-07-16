<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OpenDelivery Validator Dashboard</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            border-bottom: 2px solid #007bff;
            padding-bottom: 10px;
        }
        .status {
            background: #d4edda;
            color: #155724;
            padding: 15px;
            border-radius: 4px;
            margin: 20px 0;
            border: 1px solid #c3e6cb;
        }
        .info {
            background: #d1ecf1;
            color: #0c5460;
            padding: 15px;
            border-radius: 4px;
            margin: 20px 0;
            border: 1px solid #b8daff;
        }
        .endpoints {
            margin-top: 30px;
        }
        .endpoints h3 {
            color: #495057;
        }
        .endpoints ul {
            list-style: none;
            padding: 0;
        }
        .endpoints li {
            background: #f8f9fa;
            padding: 10px 15px;
            margin: 5px 0;
            border-radius: 4px;
            border-left: 4px solid #007bff;
        }
        .endpoints code {
            background: #e9ecef;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 OpenDelivery API Schema Validator</h1>
        
        <div class="status">
            ✅ <strong>Service Status:</strong> Active and Running
        </div>
        
        <div class="info">
            <strong>Version:</strong> 1.0.0 (Laravel Package)<br>
            <strong>Framework:</strong> Laravel {{ app()->version() }}<br>
            <strong>PHP Version:</strong> {{ PHP_VERSION }}<br>
            <strong>Environment:</strong> {{ app()->environment() }}<br>
            <strong>Timestamp:</strong> {{ now()->format('Y-m-d H:i:s T') }}
        </div>

        <div class="endpoints">
            <h3>📡 Available Endpoints</h3>
            <ul>
                <li>
                    <strong>POST</strong> <code>/opendelivery/validate</code> - Validate payload against schema
                </li>
                <li>
                    <strong>POST</strong> <code>/opendelivery/compatibility</code> - Check compatibility between versions
                </li>
                <li>
                    <strong>POST</strong> <code>/opendelivery/certify</code> - Certify payload as OpenDelivery Ready
                </li>
                <li>
                    <strong>GET</strong> <code>/opendelivery/health</code> - Health check endpoint
                </li>
                <li>
                    <strong>GET</strong> <code>/opendelivery/dashboard</code> - This dashboard
                </li>
            </ul>
        </div>

        <div class="info">
            <strong>🔧 Configuration:</strong><br>
            Default Schema Version: {{ config('opendelivery.default_schema_version', 'Not configured') }}<br>
            Supported Versions: {{ implode(', ', config('opendelivery.supported_versions', [])) }}<br>
            Cache Enabled: {{ config('opendelivery.cache.enabled', false) ? 'Yes' : 'No' }}<br>
            Node.js Backend: {{ config('opendelivery.nodejs_backend.enabled', false) ? 'Enabled' : 'Disabled' }}
        </div>

        <div class="endpoints">
            <h3>📚 Next Steps</h3>
            <ul>
                <li>✅ Basic Laravel package structure created</li>
                <li>⏳ TODO: Implement actual validation logic</li>
                <li>⏳ TODO: Add JSON Schema validation</li>
                <li>⏳ TODO: Create frontend interface</li>
                <li>⏳ TODO: Add comprehensive tests</li>
            </ul>
        </div>
    </div>
</body>
</html>
