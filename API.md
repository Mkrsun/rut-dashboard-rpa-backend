# 📚 RUT Dashboard RPA Backend - API Documentation

## 🌟 Introducción

Esta documentación describe la API REST del RUT Dashboard RPA Backend, diseñada para integración con aplicaciones frontend. La API sigue principios de arquitectura limpia y proporciona endpoints seguros para gestión de administradores, procesamiento de RUTs y manejo de resultados.

## 🔗 URL Base

```
http://localhost:3000
```

## 🔐 Autenticación

La API utiliza autenticación JWT (JSON Web Tokens). Para acceder a endpoints protegidos, incluye el token en el header Authorization:

```
Authorization: Bearer <your-jwt-token>
```

### Obtener Token de Autenticación

Usa el endpoint de login para obtener un token válido:

```bash
POST /api/v1/admin/login
```

## 📋 Formato de Respuestas

Todas las respuestas de la API siguen un formato consistente:

### Respuesta Exitosa
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Respuesta de Error
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

## 🏥 Health Check

### GET /health
Verifica el estado del servidor.

**Respuesta:**
```json
{
  "success": true,
  "message": "Server is running successfully",
  "data": {
    "status": "OK",
    "timestamp": "2025-07-24T10:30:00.000Z",
    "environment": "development",
    "version": "1.0.0"
  }
}
```

---

## 👤 Administradores (Admin)

### 🔑 Autenticación

#### POST /api/v1/admin/login
Autenticar un administrador y obtener token JWT.

**Body:**
```json
{
  "email": "admin@rutdashboard.com",
  "password": "admin123456"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "admin": {
      "_id": "64a7b123456789abcdef1234",
      "name": "Super Administrator",
      "email": "admin@rutdashboard.com",
      "role": "super_admin",
      "isActive": true,
      "createdAt": "2025-07-24T10:30:00.000Z",
      "updatedAt": "2025-07-24T10:30:00.000Z",
      "lastLogin": "2025-07-24T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Errores:**
- `401`: Credenciales inválidas
- `401`: Cuenta desactivada

---

### 👤 Perfil del Usuario

#### GET /api/v1/admin/profile
Obtener información del perfil del usuario autenticado.

**Headers:**
```
Authorization: Bearer <token>
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "_id": "64a7b123456789abcdef1234",
    "name": "Super Administrator",
    "email": "admin@rutdashboard.com",
    "role": "super_admin",
    "isActive": true,
    "createdAt": "2025-07-24T10:30:00.000Z",
    "updatedAt": "2025-07-24T10:30:00.000Z",
    "lastLogin": "2025-07-24T10:30:00.000Z"
  }
}
```

#### PUT /api/v1/admin/change-password
Cambiar la contraseña del usuario autenticado.

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "currentPassword": "currentPassword123",
  "newPassword": "newPassword456",
  "confirmPassword": "newPassword456"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Password changed successfully",
  "data": null
}
```

---

### 👥 Gestión de Administradores

#### GET /api/v1/admin
Listar todos los administradores (requiere rol Admin o Super Admin).

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Elementos por página (default: 10)
- `sortBy` (opcional): Campo para ordenar (default: 'createdAt')
- `sortOrder` (opcional): Orden 'asc' o 'desc' (default: 'desc')

**Ejemplo:**
```
GET /api/v1/admin?page=1&limit=10&sortBy=createdAt&sortOrder=desc
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Admins retrieved successfully",
  "data": {
    "data": [
      {
        "_id": "64a7b123456789abcdef1234",
        "name": "Super Administrator",
        "email": "admin@rutdashboard.com",
        "role": "super_admin",
        "isActive": true,
        "createdAt": "2025-07-24T10:30:00.000Z",
        "updatedAt": "2025-07-24T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1,
      "hasNext": false,
      "hasPrev": false
    }
  }
}
```

#### GET /api/v1/admin/active
Obtener administradores activos (requiere rol Admin o Super Admin).

**Headers:**
```
Authorization: Bearer <token>
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Active admins retrieved successfully",
  "data": [
    {
      "_id": "64a7b123456789abcdef1234",
      "name": "Super Administrator",
      "email": "admin@rutdashboard.com",
      "role": "super_admin",
      "isActive": true
    }
  ]
}
```

#### GET /api/v1/admin/:id
Obtener un administrador por ID (requiere rol Admin o Super Admin).

**Headers:**
```
Authorization: Bearer <token>
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Admin retrieved successfully",
  "data": {
    "_id": "64a7b123456789abcdef1234",
    "name": "Super Administrator",
    "email": "admin@rutdashboard.com",
    "role": "super_admin",
    "isActive": true,
    "createdAt": "2025-07-24T10:30:00.000Z",
    "updatedAt": "2025-07-24T10:30:00.000Z"
  }
}
```

#### POST /api/v1/admin
Crear un nuevo administrador (requiere rol Super Admin).

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "name": "Nuevo Admin",
  "email": "nuevo@admin.com",
  "password": "password123",
  "role": "admin"
}
```

**Roles disponibles:**
- `super_admin`: Super Administrador
- `admin`: Administrador

**Respuesta:**
```json
{
  "success": true,
  "message": "Admin created successfully",
  "data": {
    "_id": "64a7b987654321fedcba4321",
    "name": "Nuevo Admin",
    "email": "nuevo@admin.com",
    "role": "admin",
    "isActive": true,
    "createdAt": "2025-07-24T10:35:00.000Z",
    "updatedAt": "2025-07-24T10:35:00.000Z"
  }
}
```

#### PUT /api/v1/admin/:id
Actualizar un administrador (requiere rol Super Admin).

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "name": "Nombre Actualizado",
  "email": "email@actualizado.com",
  "role": "admin",
  "isActive": true
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Admin updated successfully",
  "data": {
    "_id": "64a7b987654321fedcba4321",
    "name": "Nombre Actualizado",
    "email": "email@actualizado.com",
    "role": "admin",
    "isActive": true,
    "updatedAt": "2025-07-24T10:40:00.000Z"
  }
}
```

#### DELETE /api/v1/admin/:id
Eliminar un administrador (requiere rol Super Admin).

**Headers:**
```
Authorization: Bearer <token>
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Admin deleted successfully",
  "data": null
}
```

#### PATCH /api/v1/admin/:id/toggle-status
Activar/Desactivar un administrador (requiere rol Super Admin).

**Headers:**
```
Authorization: Bearer <token>
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Admin status updated successfully",
  "data": {
    "_id": "64a7b987654321fedcba4321",
    "isActive": false
  }
}
```

---

## 🔄 Procesamiento de RUT

### POST /api/v1/process-rut
Procesar un RUT a través del servicio externo.

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "rut": "12345678-9"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "RUT processed successfully",
  "data": {
    "success": true,
    "rut": "12345678-9",
    "data": {
      "rut": "12345678-9",
      "name": "Juan Pérez",
      "status": "active",
      "lastUpdate": "2025-07-24T10:30:00.000Z"
    },
    "processedAt": "2025-07-24T10:30:00.000Z"
  }
}
```

**Errores:**
- `400`: RUT inválido o malformado
- `401`: Token de autenticación requerido
- `500`: Error del servicio externo
- `408`: Timeout de la solicitud

---

## 📊 Resultados de Procesamiento RUT

### POST /api/v1/rut-results
Crear un nuevo resultado de procesamiento RUT.

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "rut": "12345678-9",
  "data": {
    "name": "Juan Pérez",
    "status": "active",
    "customField": "valor personalizado"
  }
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Result created successfully",
  "data": {
    "_id": "64a7c123456789abcdef5678",
    "rut": "12345678-9",
    "createdBy": "64a7b123456789abcdef1234",
    "data": {
      "name": "Juan Pérez",
      "status": "active",
      "customField": "valor personalizado"
    },
    "createdAt": "2025-07-24T10:30:00.000Z",
    "updatedAt": "2025-07-24T10:30:00.000Z"
  }
}
```

### GET /api/v1/rut-results/my-results
Obtener los resultados del usuario autenticado.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Elementos por página (default: 10)

**Respuesta:**
```json
{
  "success": true,
  "message": "My results retrieved successfully",
  "data": {
    "data": [
      {
        "_id": "64a7c123456789abcdef5678",
        "rut": "12345678-9",
        "createdBy": "64a7b123456789abcdef1234",
        "data": {
          "name": "Juan Pérez",
          "status": "active"
        },
        "createdAt": "2025-07-24T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1,
      "hasNext": false,
      "hasPrev": false
    }
  }
}
```

### GET /api/v1/rut-results
Obtener todos los resultados (requiere rol Admin o Super Admin).

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Elementos por página (default: 10)
- `sortBy` (opcional): Campo para ordenar (default: 'createdAt')
- `sortOrder` (opcional): Orden 'asc' o 'desc' (default: 'desc')

### GET /api/v1/rut-results/search
Buscar resultados por término.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `q`: Término de búsqueda (busca en RUT y datos)
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Elementos por página (default: 10)

**Ejemplo:**
```
GET /api/v1/rut-results/search?q=12345678&page=1&limit=10
```

### GET /api/v1/rut-results/by-rut/:rut
Obtener resultados por RUT específico.

**Headers:**
```
Authorization: Bearer <token>
```

**Ejemplo:**
```
GET /api/v1/rut-results/by-rut/12345678-9
```

### GET /api/v1/rut-results/stats
Obtener estadísticas de resultados.

**Headers:**
```
Authorization: Bearer <token>
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Result statistics retrieved successfully",
  "data": {
    "totalResults": 150,
    "totalUniqueRuts": 120,
    "resultsByUser": [
      {
        "userId": "64a7b123456789abcdef1234",
        "userName": "Super Administrator",
        "count": 75
      }
    ],
    "recentActivity": [
      {
        "date": "2025-07-24",
        "count": 25
      }
    ]
  }
}
```

### GET /api/v1/rut-results/:id
Obtener un resultado específico por ID.

**Headers:**
```
Authorization: Bearer <token>
```

### PUT /api/v1/rut-results/:id
Actualizar un resultado específico.

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "rut": "12345678-9",
  "data": {
    "name": "Juan Pérez Actualizado",
    "status": "inactive"
  }
}
```

### DELETE /api/v1/rut-results/:id
Eliminar un resultado específico.

**Headers:**
```
Authorization: Bearer <token>
```

---

## 🧪 Endpoints de Testing

### POST /api/v1/test/process-rut
Simular el servicio externo de procesamiento RUT (solo para desarrollo).

**Body:**
```json
{
  "rut": "12345678-9"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "External RUT processing simulation completed",
  "data": {
    "success": true,
    "data": {
      "rut": "12345678-9",
      "name": "Usuario Simulado",
      "status": "active",
      "processedAt": "2025-07-24T10:30:00.000Z"
    },
    "message": "RUT processing completed successfully"
  }
}
```

---

## 🚨 Códigos de Estado HTTP

| Código | Descripción |
|--------|-------------|
| 200 | OK - Solicitud exitosa |
| 201 | Created - Recurso creado exitosamente |
| 400 | Bad Request - Datos de entrada inválidos |
| 401 | Unauthorized - Token de autenticación requerido o inválido |
| 403 | Forbidden - Permisos insuficientes |
| 404 | Not Found - Recurso no encontrado |
| 409 | Conflict - Conflicto de datos (ej: email duplicado) |
| 500 | Internal Server Error - Error interno del servidor |

---

## 👨‍💻 Ejemplos de Integración Frontend

### JavaScript/TypeScript

```typescript
// Configuración base de la API
const API_BASE_URL = 'http://localhost:3000';

class RutDashboardAPI {
  private token: string | null = null;

  // Configurar token de autenticación
  setToken(token: string) {
    this.token = token;
  }

  // Realizar solicitud HTTP
  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  }

  // Autenticación
  async login(email: string, password: string) {
    const response = await this.request('/api/v1/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    this.setToken(response.data.token);
    return response.data;
  }

  // Obtener perfil
  async getProfile() {
    return this.request('/api/v1/admin/profile');
  }

  // Procesar RUT
  async processRut(rut: string) {
    return this.request('/api/v1/process-rut', {
      method: 'POST',
      body: JSON.stringify({ rut }),
    });
  }

  // Obtener mis resultados
  async getMyResults(page = 1, limit = 10) {
    return this.request(`/api/v1/rut-results/my-results?page=${page}&limit=${limit}`);
  }

  // Buscar resultados
  async searchResults(query: string, page = 1, limit = 10) {
    return this.request(`/api/v1/rut-results/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
  }
}

// Uso de la API
const api = new RutDashboardAPI();

// Ejemplo de autenticación y uso
async function ejemplo() {
  try {
    // Login
    const loginResult = await api.login('admin@rutdashboard.com', 'admin123456');
    console.log('Login exitoso:', loginResult.admin.name);

    // Procesar RUT
    const processingResult = await api.processRut('12345678-9');
    console.log('RUT procesado:', processingResult.data);

    // Obtener resultados
    const myResults = await api.getMyResults();
    console.log('Mis resultados:', myResults.data);

  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

### React Hook Personalizado

```typescript
// hooks/useRutDashboardAPI.ts
import { useState, useEffect } from 'react';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export const useRutDashboardAPI = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: localStorage.getItem('auth_token'),
    isAuthenticated: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Inicializar autenticación desde localStorage
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      // Verificar token válido obteniendo perfil
      getProfile();
    }
  }, []);

  const request = async (endpoint: string, options: RequestInit = {}) => {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (authState.token) {
      headers.Authorization = `Bearer ${authState.token}`;
    }

    const response = await fetch(`http://localhost:3000${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await request('/api/v1/admin/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      const { admin, token } = response.data;
      
      localStorage.setItem('auth_token', token);
      setAuthState({
        user: admin,
        token,
        isAuthenticated: true,
      });

      return admin;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  };

  const getProfile = async () => {
    try {
      const response = await request('/api/v1/admin/profile');
      setAuthState(prev => ({
        ...prev,
        user: response.data,
        isAuthenticated: true,
      }));
      return response.data;
    } catch (err) {
      logout(); // Token inválido
      throw err;
    }
  };

  const processRut = async (rut: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await request('/api/v1/process-rut', {
        method: 'POST',
        body: JSON.stringify({ rut }),
      });
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    // Estado
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    loading,
    error,

    // Métodos
    login,
    logout,
    getProfile,
    processRut,
    request, // Para llamadas personalizadas
  };
};
```

---

## 🔒 Consideraciones de Seguridad

1. **Tokens JWT**: Los tokens tienen una duración limitada. Implementa renovación automática.
2. **HTTPS**: En producción, siempre usa HTTPS.
3. **Manejo de Errores**: No expongas información sensible en mensajes de error.
4. **Rate Limiting**: Considera implementar límites de velocidad en tu frontend.
5. **Validación**: Siempre valida datos en el frontend antes de enviarlos.

---

## 🚀 Configuración de Desarrollo

### Variables de Entorno Necesarias

```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27018/rut-dashboard
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h
CORS_ORIGIN=http://localhost:3000
EXTERNAL_RUT_PROCESS_API_URL=http://localhost:3000/api/v1/test/process-rut
EXTERNAL_RUT_PROCESS_API_TOKEN=optional-api-token
```

### Cuenta de Administrador por Defecto

- **Email**: `admin@rutdashboard.com`
- **Password**: `admin123456`
- **Rol**: `super_admin`

⚠️ **Importante**: Cambia estas credenciales después del primer login.

---

## 📞 Soporte

Para soporte técnico o preguntas sobre la integración:

1. Verifica que MongoDB esté ejecutándose
2. Confirma las variables de entorno en `.env`
3. Revisa los logs del servidor para errores detallados
4. Asegúrate de que todas las dependencias estén instaladas

---

Esta documentación te proporciona todo lo necesario para integrar tu frontend con el backend RUT Dashboard RPA. ¡Feliz desarrollo! 🎉
