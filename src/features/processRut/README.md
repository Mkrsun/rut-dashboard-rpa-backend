# Process RUT Feature

Esta feature implementa el procesamiento de RUT a través de un servicio externo siguiendo los principios de Clean Architecture.

## Estructura

```
src/features/processRut/
├── domain/
│   └── processRut.entity.ts          # Entidades y interfaces de dominio
├── application/
│   └── processRut.usecase.ts         # Casos de uso (lógica de negocio)
└── infrastructure/
    ├── processRut.controller.ts      # Controlador HTTP
    ├── processRut.controller.interface.ts
    ├── processRut.routes.ts          # Configuración de rutas
    ├── processRut.schema.ts          # Validación de esquemas
    └── service/
        └── processRut.service.ts     # Servicio para consultar API externa
```

## Endpoint

### POST `/api/v1/process-rut`

Procesa un RUT utilizando un servicio externo.

**Headers requeridos:**
- `Authorization: Bearer <token>`
- `Content-Type: application/json`

**Body:**
```json
{
  "rut": "12345678-9"
}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "RUT processed successfully",
  "data": {
    "success": true,
    "rut": "123456789",
    "data": {
      // Datos devueltos por el servicio externo
    },
    "message": "RUT processed successfully",
    "processedAt": "2025-07-24T10:30:00.000Z"
  }
}
```

**Respuesta de error (400):**
```json
{
  "success": false,
  "message": "Invalid RUT format. Expected format: XXXXXXXX-X"
}
```

## Configuración

Agregar las siguientes variables de entorno:

```env
# URL del servicio externo para procesar RUT
EXTERNAL_RUT_PROCESS_API_URL=https://api.external-service.com/process-rut

# Token de autenticación para el servicio externo (opcional)
EXTERNAL_API_TOKEN=your-external-api-token

# Timeout para requests al servicio externo en milisegundos (default: 30000)
EXTERNAL_API_TIMEOUT=30000
```

## Características

### Validación de RUT
- Valida formato básico de RUT chileno
- Acepta RUT con o sin puntos y guión
- Normaliza el RUT antes de enviarlo al servicio externo

### Manejo de errores
- Timeout configurable para requests externos
- Manejo de errores de red y HTTP
- Validación de entrada con mensajes descriptivos

### Arquitectura
- **Domain Layer**: Define las entidades y interfaces del dominio
- **Application Layer**: Contiene la lógica de negocio en los casos de uso
- **Infrastructure Layer**: Implementa los detalles técnicos (HTTP, servicios externos)

### Seguridad
- Requiere autenticación JWT
- Valida entrada para prevenir inyecciones
- Logs de errores sin exponer información sensible

## Uso del servicio externo

El servicio `ProcessRutService` encapsula la comunicación con la API externa:

```typescript
// El servicio se inyecta automáticamente en el caso de uso
const service = new ProcessRutService();
const result = await service.request("123456789");
```

El servicio maneja:
- Timeouts configurables
- Autenticación con tokens
- Retry logic (puede agregarse en futuras versiones)
- Validación de respuestas

## Testing

Para probar el endpoint:

```bash
# Con curl
curl -X POST http://localhost:3000/api/v1/process-rut \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"rut": "12345678-9"}'
```

## Extensiones futuras

- Implementar cache para resultados frecuentes
- Agregar retry logic con backoff exponencial
- Implementar rate limiting
- Agregar métricas y monitoreo
- Soporte para procesamiento en lotes
