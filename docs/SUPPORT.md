# OpenDelivery API Schema Validator Support Guide

## Table of Contents
1. [Usage Instructions](#usage-instructions)
2. [Maintenance Procedures](#maintenance-procedures)
3. [Troubleshooting](#troubleshooting)
4. [API Documentation](#api-documentation)

## Usage Instructions

### Schema Validation
1. Navigate to the Validator page
2. Select the schema version from the dropdown
3. Enter or paste your JSON payload in the editor
4. Click "Validate" to check your payload
5. Review validation results on the right panel

### Compatibility Checking
1. Navigate to the Compatibility page
2. Select source and target schema versions
3. Enter your JSON payload
4. Click "Check Compatibility"
5. Review compatibility results and breaking changes

### Certification
1. Navigate to the Certification page
2. Select the schema version
3. Enter your JSON payload
4. Click "Certify"
5. Review certification score and detailed checks

## Maintenance Procedures

### Adding New Schema Versions
1. Add schema file to `backend/src/schemas/`
2. Update `SCHEMA_VERSIONS` constant in:
   - `frontend/src/pages/ValidatorPage.tsx`
   - `frontend/src/pages/CompatibilityPage.tsx`
   - `frontend/src/pages/CertificationPage.tsx`
3. Update schema loading logic in `ValidationService`

### Updating Validation Rules
1. Modify schema files in `backend/src/schemas/`
2. Update validation logic in `ValidationService` if needed
3. Add tests for new validation rules

### Updating Compatibility Rules
1. Modify `CompatibilityService.analyzeChanges()`
2. Update breaking changes detection logic
3. Add tests for new compatibility rules

### Updating Certification Checks
1. Modify `CertificationService.runChecks()`
2. Update scoring logic if needed
3. Add tests for new certification checks

## Troubleshooting

### Common Issues

#### Validation Errors
- Check JSON syntax
- Verify schema version compatibility
- Review required fields
- Check data types

#### Compatibility Issues
- Ensure source version is older than target
- Check for breaking changes
- Verify field deprecations

#### Certification Problems
- Validate payload first
- Check security requirements
- Review best practices

### Error Messages

#### Backend Errors
- 400: Invalid request format
- 404: Schema version not found
- 500: Internal server error

#### Frontend Errors
- JSON parsing errors
- Network connectivity issues
- Version selection problems

## API Documentation

### Endpoints

#### POST /validate
```json
{
  "schema_version": "1.0.0",
  "payload": {}
}
```

#### POST /compatibility
```json
{
  "source_version": "1.0.0",
  "target_version": "1.1.0",
  "payload": {}
}
```

#### POST /certify
```json
{
  "schema_version": "1.0.0",
  "payload": {}
}
```

### Response Formats

#### Validation Response
```json
{
  "status": "success|error",
  "errors": [],
  "details": {}
}
```

#### Compatibility Response
```json
{
  "status": "success|error",
  "compatible": true,
  "changes": [],
  "details": {}
}
```

#### Certification Response
```json
{
  "status": "success|error",
  "score": 85,
  "checks": [],
  "details": {
    "certification_level": "GOLD|SILVER|BRONZE|NOT_CERTIFIED"
  }
}
```

## Testing Documentation

### Overview
The OpenDelivery API Schema Validator includes a comprehensive test suite that verifies the core functionality of the validation system. The tests are written using Jest and cover three main components:

1. Validator Tests (`validator.test.ts`)
2. Validation Engine Tests (`validationEngine.test.ts`)
3. Compatibility Checker Tests (`compatibilityChecker.test.ts`)

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- validator.test.ts
```

### Test Coverage

The test suite covers the following key areas:

#### 1. Validator Tests (`validator.test.ts`)

These tests verify the high-level validation functionality:

- **Schema Version Validation**
  - ✓ Validates payloads against correct schema version
  - ✓ Handles non-existent schema versions
  - ✓ Validates against multiple schema versions

- **Payload Validation**
  - ✓ Validates correct payloads successfully
  - ✓ Rejects invalid payloads with proper error messages
  - ✓ Handles missing required fields
  - ✓ Validates data types correctly

- **Security Validation**
  - ✓ Detects sensitive data in payloads
  - ✓ Identifies potential security risks
  - ✓ Validates secure communication requirements

Example test payload:
```json
{
  "id": "123",
  "items": [
    {
      "id": "item1",
      "name": "Item 1",
      "quantity": 1,
      "price": 10.99
    }
  ],
  "status": "PENDING"
}
```

#### 2. Validation Engine Tests (`validationEngine.test.ts`)

These tests focus on the core validation logic:

- **Schema Validation**
  - ✓ Validates against OpenAPI schemas
  - ✓ Handles schema references correctly
  - ✓ Processes validation errors properly

- **Security Requirements**
  - ✓ Detects sensitive data patterns
  - ✓ Identifies potential security vulnerabilities
  - ✓ Validates secure communication patterns

- **Error Handling**
  - ✓ Provides clear error messages
  - ✓ Includes proper error paths
  - ✓ Handles multiple errors correctly

#### 3. Compatibility Checker Tests (`compatibilityChecker.test.ts`)

These tests verify version compatibility checking:

- **Schema Compatibility**
  - ✓ Detects removed required fields
  - ✓ Identifies property removals
  - ✓ Checks enum value changes

- **Breaking Changes**
  - ✓ Detects breaking changes between versions
  - ✓ Identifies backward compatibility issues
  - ✓ Reports detailed compatibility information

Example compatibility test:
```json
{
  "sourceSchema": {
    "type": "object",
    "properties": {
      "status": {
        "type": "string",
        "enum": ["PENDING", "ACTIVE", "COMPLETED"]
      }
    }
  },
  "targetSchema": {
    "type": "object",
    "properties": {
      "status": {
        "type": "string",
        "enum": ["PENDING", "COMPLETED"]
      }
    }
  }
}
```

### Writing New Tests

When adding new functionality, follow these guidelines for test creation:

1. **Test Structure**
   - Group related tests using `describe` blocks
   - Use clear test descriptions with `it` blocks
   - Follow the Arrange-Act-Assert pattern

2. **Test Coverage**
   - Test both valid and invalid cases
   - Include edge cases
   - Test error conditions
   - Verify security implications

3. **Best Practices**
   - Keep tests focused and atomic
   - Use meaningful test data
   - Avoid test interdependencies
   - Clean up after tests

Example test structure:
```typescript
describe('ValidationFeature', () => {
  let validator: Validator;

  beforeEach(() => {
    validator = new Validator();
  });

  it('should handle valid case', async () => {
    // Arrange
    const input = { /* test data */ };

    // Act
    const result = await validator.validate(input);

    // Assert
    expect(result.isValid).toBe(true);
  });

  it('should handle error case', async () => {
    // Arrange
    const invalidInput = { /* invalid test data */ };

    // Act
    const result = await validator.validate(invalidInput);

    // Assert
    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(1);
  });
});
```

### Troubleshooting Tests

Common test issues and solutions:

1. **Failed Schema Validation**
   - Check schema version compatibility
   - Verify payload structure
   - Review required fields

2. **Compatibility Test Failures**
   - Compare schema versions carefully
   - Check for breaking changes
   - Review compatibility rules

3. **Security Test Failures**
   - Review sensitive data patterns
   - Check security requirements
   - Verify encryption requirements

### Continuous Integration

The test suite runs automatically in the CI pipeline:

- On pull requests
- On merges to main branch
- On release tags

Test results and coverage reports are available in the CI/CD dashboard. 