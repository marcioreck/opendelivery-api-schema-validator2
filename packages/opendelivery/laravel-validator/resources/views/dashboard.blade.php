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
            margin: 10px 0;
            padding: 15px;
            border-radius: 4px;
            border-left: 4px solid #007bff;
        }
        .endpoints code {
            background: #e9ecef;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
        }
        .frontend-options {
            margin-top: 30px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
            border: 1px solid #dee2e6;
        }
        .frontend-options h3 {
            color: #495057;
            margin-top: 0;
        }
        .option-button {
            display: inline-block;
            padding: 12px 24px;
            margin: 10px 10px 10px 0;
            background: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            font-weight: 500;
            transition: background-color 0.3s;
        }
        .option-button:hover {
            background: #0056b3;
            color: white;
            text-decoration: none;
        }
        .option-button.secondary {
            background: #6c757d;
        }
        .option-button.secondary:hover {
            background: #545b62;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 OpenDelivery Validator Dashboard</h1>
        
        <div class="status">
            <strong>✅ Status:</strong> Laravel Package is operational and ready!
        </div>
        
        <div class="info">
            <strong>📦 Package Version:</strong> 2.0.0<br>
            <strong>🔧 Laravel Version:</strong> {{ app()->version() }}<br>
            <strong>📅 Current Time:</strong> {{ now()->format('Y-m-d H:i:s') }}
        </div>

        <div class="frontend-options">
            <h3>🎨 Frontend Interface Options</h3>
            <p>Choose your preferred interface for the OpenDelivery Validator:</p>
            
            <a href="{{ url('/opendelivery/react') }}" class="option-button">
                ⚛️ React Dashboard (Full Interactive UI)
            </a>
            
            <a href="{{ url('/opendelivery/dashboard') }}" class="option-button secondary">
                📄 Simple Dashboard (Current Page)
            </a>
            
            <div style="margin-top: 15px;">
                <small><strong>Recommended:</strong> Use the React Dashboard for the best user experience with interactive validation, real-time feedback, and modern UI components.</small>
            </div>
        </div>

        <div class="endpoints">
            <h3>📡 Available API Endpoints</h3>
            <ul>
                <li>
                    <strong>Health Check:</strong> <code>GET /opendelivery/health</code><br>
                    <small>Check if the validation service is running</small>
                </li>
                <li>
                    <strong>Validate Payload:</strong> <code>POST /opendelivery/validate</code><br>
                    <small>Validate JSON payload against OpenDelivery schema</small>
                </li>
                <li>
                    <strong>Check Compatibility:</strong> <code>POST /opendelivery/compatibility</code><br>
                    <small>Check compatibility between different schema versions</small>
                </li>
                <li>
                    <strong>Certify Implementation:</strong> <code>POST /opendelivery/certify</code><br>
                    <small>Get OpenDelivery Ready certification for your implementation</small>
                </li>
            </ul>
        </div>
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
