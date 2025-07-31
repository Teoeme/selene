# API Endpoints - Sistema de Gestión de Beneficios

## Base URL
```
http://localhost:3000/api/v1
```

## Autenticación
Todas las rutas requieren el header `x-user-id` con el ID del usuario:
```
x-user-id: <userId>
```

## Endpoints

### 1. Health Check
```http
GET /health
```
**Respuesta:**
```json
{
  "status": "ok",
  "service": "benefit-management-api",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 2. Crear Solicitud de Beneficio (Solo empleados)
```http
POST /benefit-requests
```
**Headers:**
```
Content-Type: application/json
x-user-id: <employeeUserId>
```
**Body:**
```json
{
  "benefitId": "benefit-uuid",
  "reason": "Necesito este curso para mejorar mis habilidades técnicas"
}
```
**Respuesta Exitosa (201):**
```json
{
  "success": true,
  "message": "Benefit request created successfully",
  "data": {
    "id": "request-uuid",
    "benefitId": "benefit-uuid",
    "benefitName": "Curso de TypeScript",
    "employee": {
      "id": "user-uuid",
      "name": "Juan Pérez",
      "email": "juan@empresa.com"
    },
    "reason": "Necesito este curso para mejorar mis habilidades técnicas",
    "status": "PENDING",
    "requestDate": "2024-01-01T00:00:00.000Z",
    "companyId": "company-uuid"
  }
}
```

### 3. Listar Solicitudes de Beneficios
```http
GET /benefit-requests?status=pending&startDate=2024-01-01&endDate=2024-12-31&page=1&limit=10
```
**Headers:**
```
x-user-id: <userId>
```
**Query Parameters:**
- `status` (opcional): pending, approved, rejected
- `employeeId` (opcional, solo para admins): filtrar por empleado específico
- `startDate` (opcional): fecha desde (YYYY-MM-DD)
- `endDate` (opcional): fecha hasta (YYYY-MM-DD)
- `page` (opcional): número de página (default: 1)
- `limit` (opcional): elementos por página (default: 10, max: 100)

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Benefit requests retrieved successfully",
  "data": [
    {
      "id": "request-uuid",
      "benefitName": "Curso de TypeScript",
      "employeeName": "Juan Pérez",
      "reason": "Necesito mejorar mis habilidades",
      "status": "PENDING",
      "requestDate": "2024-01-01T00:00:00.000Z",
      "resolutionDate": null,
      "company": {
        "id": "company-uuid",
        "name": "Mi Empresa"
      }
    }
  ]
}
```

### 4. Obtener Solicitud Específica
```http
GET /benefit-requests/:id
```
**Headers:**
```
x-user-id: <userId>
```
**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Benefit request retrieved successfully",
  "data": {
    "id": "request-uuid",
    "benefitName": "Curso de TypeScript",
    "employeeName": "Juan Pérez",
    "reason": "Necesito mejorar mis habilidades",
    "status": "PENDING",
    "requestDate": "2024-01-01T00:00:00.000Z",
    "resolutionDate": null,
    "company": {
      "id": "company-uuid",
      "name": "Mi Empresa"
    }
  }
}
```

### 5. Aprobar Solicitud (Solo administradores)
```http
PATCH /benefit-requests/:id/approve
```
**Headers:**
```
x-user-id: <adminUserId>
```
**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Benefit request approved successfully"
}
```

### 6. Rechazar Solicitud (Solo administradores)
```http
PATCH /benefit-requests/:id/reject
```
**Headers:**
```
x-user-id: <adminUserId>
```
**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Benefit request rejected successfully"
}
```

## Códigos de Estado HTTP

- **200 OK**: Operación exitosa
- **201 Created**: Recurso creado exitosamente
- **400 Bad Request**: Error de validación o lógica de negocio
- **401 Unauthorized**: Falta autenticación
- **403 Forbidden**: Sin permisos suficientes
- **404 Not Found**: Recurso no encontrado
- **500 Internal Server Error**: Error interno del servidor

## Ejemplos de Errores

### Error de Validación (400)
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    "benefitId is required",
    "reason must be at least 10 characters long"
  ]
}
```

### Error de Autenticación (401)
```json
{
  "success": false,
  "error": "Authentication required",
  "message": "x-user-id header is required"
}
```

### Error de Permisos (403)
```json
{
  "success": false,
  "error": "Insufficient permissions",
  "message": "Admin role required"
}
```

### Error de Lógica de Negocio (400)
```json
{
  "success": false,
  "error": "Bad request",
  "message": "Cannot approve a request that is not pending"
}
``` 