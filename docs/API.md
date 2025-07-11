# OpenDelivery API Schema Validator API Documentation

## Base URL
```
http://localhost:8000
```

## Authentication
Currently, the API does not require authentication. However, rate limiting is applied to prevent abuse.

## Endpoints

### Schema Validation

#### POST /validate
Validates a JSON payload against a specific schema version.

##### Request
```json
{
  "schema_version": "1.0.0",
  "payload": {
    // Your JSON payload here
  }
}
```

##### Response
```json
{
  "status": "success",
  "message": "Payload is valid",
  "details": {
    "schema_version": "1.0.0",
    "validated_at": "2024-01-01T12:00:00Z"
  }
}
```

##### Error Response
```json
{
  "status": "error",
  "errors": [
    {
      "path": "/field",
      "message": "Required field is missing",
      "params": {}
    }
  ]
}
```

### Compatibility Check

#### POST /compatibility
Checks compatibility of a JSON payload between two schema versions.

##### Request
```json
{
  "source_version": "1.0.0",
  "target_version": "1.1.0",
  "payload": {
    // Your JSON payload here
  }
}
```

##### Response
```json
{
  "status": "success",
  "compatible": true,
  "changes": [
    {
      "type": "added",
      "path": "/newField",
      "description": "New required field added"
    },
    {
      "type": "modified",
      "path": "/existingField",
      "description": "Field type changed"
    }
  ],
  "details": {
    "source_version": "1.0.0",
    "target_version": "1.1.0",
    "checked_at": "2024-01-01T12:00:00Z"
  }
}
```

### Certification

#### POST /certify
Performs OpenDelivery Ready certification checks on a JSON payload.

##### Request
```json
{
  "schema_version": "1.0.0",
  "payload": {
    // Your JSON payload here
  }
}
```

##### Response
```json
{
  "status": "success",
  "score": 85,
  "checks": [
    {
      "name": "Schema Validation",
      "status": "success",
      "message": "Payload is valid",
      "score": 100
    },
    {
      "name": "Security",
      "status": "warning",
      "message": "Some fields need encryption",
      "score": 70
    }
  ],
  "details": {
    "schema_version": "1.0.0",
    "certified_at": "2024-01-01T12:00:00Z",
    "certification_level": "SILVER"
  }
}
```

### Health Check

#### GET /health
Returns the health status of the service.

##### Response
```json
{
  "status": "ok"
}
```

## Error Codes

### HTTP Status Codes
- 200: Success
- 400: Bad Request (invalid input)
- 404: Not Found (schema version not found)
- 429: Too Many Requests (rate limit exceeded)
- 500: Internal Server Error

### Error Response Format
```json
{
  "status": "error",
  "message": "Error description",
  "code": "ERROR_CODE"
}
```

## Rate Limiting
- 100 requests per minute per IP
- Rate limit headers included in response:
  - X-RateLimit-Limit
  - X-RateLimit-Remaining
  - X-RateLimit-Reset

## Versioning
API versioning is handled through the schema version parameter in requests. The API itself is currently at v1. 