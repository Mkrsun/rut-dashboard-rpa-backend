# Docker Configuration para RUT Dashboard RPA Backend

## MongoDB Container

Este proyecto incluye una configuración de Docker Compose para ejecutar MongoDB localmente.

### Configuración

El contenedor MongoDB (`rut-proc-mongodb`) está configurado con:

- **Imagen**: MongoDB 7.0
- **Puerto**: 27018 (mapeado al host, internamente usa 27017)
- **Base de datos inicial**: `rut-dashboard`
- **Usuario admin**: `admin`
- **Contraseña admin**: `password123`

### Comandos útiles

#### Iniciar MongoDB
```bash
docker-compose up -d rut-proc-mongodb
```

#### Detener MongoDB
```bash
docker-compose down
```

#### Ver logs del contenedor
```bash
docker-compose logs rut-proc-mongodb
```

#### Acceder al shell de MongoDB
```bash
docker exec -it rut-proc-mongodb mongosh
```

#### Conectar como admin
```bash
docker exec -it rut-proc-mongodb mongosh -u admin -p password123 --authenticationDatabase admin
```

### Configuración de conexión

Para conectar tu aplicación al contenedor MongoDB, asegúrate de que tu archivo `.env` tenga:

```env
MONGODB_URI=mongodb://localhost:27018/rut-dashboard
```

O si necesitas autenticación:

```env
MONGODB_URI=mongodb://admin:password123@localhost:27018/rut-dashboard?authSource=admin
```

### Persistencia de datos

Los datos de MongoDB se persisten en volúmenes Docker nombrados:
- `rut_proc_mongodb_data`: Datos de la base de datos
- `rut_proc_mongodb_config`: Configuración de MongoDB

### Limpieza completa

Para eliminar completamente el contenedor y sus datos:

```bash
docker-compose down -v
docker volume rm rut-dashboard-rpa-backend_rut_proc_mongodb_data
docker volume rm rut-dashboard-rpa-backend_rut_proc_mongodb_config
```

### Troubleshooting

#### Puerto ocupado
Si el puerto 27018 está ocupado, puedes cambiarlo en `docker-compose.yml`:
```yaml
ports:
  - "27019:27017"  # Usa puerto 27019 en el host
```

Y actualiza tu `MONGODB_URI`:
```env
MONGODB_URI=mongodb://localhost:27019/rut-dashboard
```

#### Problemas de permisos
En algunos sistemas, puede ser necesario ajustar los permisos:
```bash
sudo chown -R 999:999 ./mongodb_data
```
