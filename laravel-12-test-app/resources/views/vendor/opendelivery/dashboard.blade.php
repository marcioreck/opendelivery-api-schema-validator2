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
        <h1>🚀 OpenDelivery API Schema Validator 2</h1>
        
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
            
            <a href="{{ url('/opendelivery-api-schema-validator2/react') }}" class="option-button">
                ⚛️ React Dashboard (Full Interactive UI)
            </a>
            
            <a href="{{ url('/opendelivery-api-schema-validator2/blade') }}" class="option-button secondary">
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
                    <strong>Health Check:</strong> <code>GET /opendelivery-api-schema-validator2/health</code><br>
                    <small>Check if the validation service is running</small>
                </li>
                <li>
                    <strong>Validate Payload:</strong> <code>POST /opendelivery-api-schema-validator2/validate</code><br>
                    <small>Validate JSON payload against OpenDelivery schema</small>
                </li>
                <li>
                    <strong>Check Compatibility:</strong> <code>POST /opendelivery-api-schema-validator2/compatibility</code><br>
                    <small>Check compatibility between different schema versions</small>
                </li>
                <li>
                    <strong>Certify Implementation:</strong> <code>POST /opendelivery-api-schema-validator2/certify</code><br>
                    <small>Get OpenDelivery Ready certification for your implementation</small>
                </li>
            </ul>
        </div>

        <div class="endpoints">
            <h3>📊 Available Schemas</h3>
            <p>The following OpenDelivery schema versions are available for validation:</p>
            <ul>
                <li><code>1.0.0</code> - Initial version</li>
                <li><code>1.0.1</code> - Minor improvements</li>
                <li><code>1.1.0</code> - Feature additions</li>
                <li><code>1.1.1</code> - Bug fixes</li>
                <li><code>1.2.0</code> - Enhanced validation</li>
                <li><code>1.2.1</code> - Performance improvements</li>
                <li><code>1.3.0</code> - New field support</li>
                <li><code>1.4.0</code> - Advanced features</li>
                <li><code>1.5.0</code> - Latest stable</li>
                <li><code>1.6.0-rc</code> - Release candidate</li>
                <li><code>beta</code> - Beta version</li>
            </ul>
        </div>

        <div class="endpoints">
            <h3>🔗 Quick Links</h3>
            <ul>
                <li><a href="{{ url('/opendelivery-api-schema-validator2/routes') }}">📋 View all available routes</a></li>
                <li><a href="https://github.com/marcioreck/opendelivery-api-schema-validator2" target="_blank">📚 GitHub Repository</a></li>
                <li><a href="https://www.opendelivery.com.br/" target="_blank">🌐 OpenDelivery Official Website</a></li>
            </ul>
        </div>
    </div>
</body>
</html>
