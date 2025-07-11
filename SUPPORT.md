# OpenDelivery Enhanced Validator 2

This document provides comprehensive information about using and maintaining the Enhanced OpenDelivery API Schema Validator 2.

## Features

- Multi-version schema validation (1.0.0 → 1.6.0-rc)
- Compatibility reporting between API versions
- OpenDelivery Ready certification system
- Real-time validation API
- Detailed error reporting
- Security checks

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm 8.x or higher

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd opendelivery-validator

# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env

# Start the server
npm run dev
```

## Usage

### API Endpoints

#### Validate Payload

```http
POST /validate
Content-Type: application/json

{
  "payload": {
    // Your OpenDelivery payload here
  },
  "version": "1.6.0-rc" // Optional - if omitted, validates against all versions
}
```

Response:
```json
{
  "isValid": true,
  "version": "1.6.0-rc"
}
```

Or with errors:
```json
{
  "isValid": false,
  "version": "1.6.0-rc",
  "errors": [
    {
      "path": "/order/items/0",
      "message": "required property 'quantity' missing",
      "schemaPath": "#/required"
    }
  ]
}
```

## Maintenance

### Updating Schemas

The validator automatically checks for new schema versions daily. To manually update:

1. Update schema files in `schemas/` directory
2. Restart the service

### Adding New API Versions

1. Add new version to `ApiVersion` type in `src/types/index.ts`
2. Add schema file in `schemas/` directory
3. Rebuild and restart the service

### Monitoring

- Check `error.log` and `combined.log` for operational issues
- Monitor `/health` endpoint for service status
- Use provided metrics for performance tracking

### Common Issues

1. **Schema Loading Failures**
   - Check schema file format (must be valid YAML)
   - Verify file permissions
   - Check schema version compatibility

2. **Validation Errors**
   - Review error messages in logs
   - Check payload format
   - Verify schema version compatibility

3. **Performance Issues**
   - Monitor memory usage
   - Check rate limiting settings
   - Review payload sizes

## Security Considerations

- Rate limiting is enabled by default
- All endpoints use HTTPS
- Input validation and sanitization
- Regular security updates
- CORS configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## Support

For issues and feature requests:
1. Check existing issues
2. Create a new issue with:
   - Version information
   - Steps to reproduce
   - Expected vs actual behavior

## License

[License Type] - see LICENSE file for details 