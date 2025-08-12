# API Documentation

This directory contains the API documentation for the CRM application.

## Files

- **openapi.json** - OpenAPI 3.0 specification defining all API endpoints, schemas, and responses
- **swagger-config.js** - Configuration for Swagger UI customization
- **README.md** - This file

## Accessing the Documentation

### Interactive Documentation (Swagger UI)
Navigate to `/docs` in your browser when the application is running:
- Development: http://localhost:3000/docs
- Production: https://your-domain.com/docs

### Programmatic Access (JSON)
The raw OpenAPI specification is available at:
- Development: http://localhost:3000/api/docs
- Production: https://your-domain.com/api/docs

## Updating the Documentation

### Adding/Modifying Endpoints

1. Open `openapi.json`
2. Add your endpoint under the `paths` section
3. Define request/response schemas under `components.schemas`
4. Add appropriate tags for grouping

Example:
```json
"/api/new-endpoint": {
  "get": {
    "tags": ["Category"],
    "summary": "Short description",
    "description": "Detailed description",
    "operationId": "uniqueOperationId",
    "security": [{"bearerAuth": []}],
    "responses": {
      "200": {
        "description": "Success response",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/YourSchema"
            }
          }
        }
      }
    }
  }
}
```

### Adding New Schemas

Add new data models under `components.schemas`:

```json
"YourSchema": {
  "type": "object",
  "required": ["field1"],
  "properties": {
    "field1": {
      "type": "string",
      "example": "value"
    },
    "field2": {
      "type": "integer",
      "example": 123
    }
  }
}
```

## Authentication

The API uses JWT Bearer token authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

In Swagger UI, click the "Authorize" button and enter your JWT token to test authenticated endpoints.

## Customization

### Swagger UI Theme

Modify `swagger-config.js` to customize:
- UI appearance
- Request/response interceptors
- Authentication handling
- Display options

### Environment-Specific Servers

Update the `servers` array in `openapi.json` to add environment-specific base URLs:

```json
"servers": [
  {
    "url": "http://localhost:3000/api",
    "description": "Development"
  },
  {
    "url": "https://staging.example.com/api",
    "description": "Staging"
  },
  {
    "url": "https://api.example.com/api",
    "description": "Production"
  }
]
```

## Validation

The OpenAPI specification follows the OpenAPI 3.0.3 standard. You can validate the spec using:

1. Online validators: https://editor.swagger.io/
2. CLI tools: `npx @apidevtools/swagger-cli validate openapi.json`

## Export Options

The API documentation can be exported in various formats:

1. **Postman Collection**: Import the OpenAPI spec directly into Postman
2. **Client SDKs**: Generate client libraries using OpenAPI Generator
3. **PDF Documentation**: Use tools like Spectacle or ReDoc

## Best Practices

1. **Keep it Updated**: Update documentation when API changes
2. **Use Examples**: Provide realistic examples in schemas
3. **Document Errors**: Include all possible error responses
4. **Version Control**: Track changes to openapi.json in git
5. **Test Endpoints**: Use "Try it out" in Swagger UI to verify endpoints

## Tools & Resources

- [OpenAPI Specification](https://swagger.io/specification/)
- [Swagger Editor](https://editor.swagger.io/)
- [OpenAPI Generator](https://openapi-generator.tech/)
- [ReDoc](https://github.com/Redocly/redoc) - Alternative documentation UI
- [Spectacle](https://github.com/sourcey/spectacle) - PDF/HTML generation