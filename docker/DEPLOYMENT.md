# 🚀 Guía de Deployment - MediLink API

## 📋 Prerequisitos en el Servidor

1. **Docker** y **Docker Compose** instalados
2. **Git** instalado
3. Puerto **3000** disponible (o el que configures)
4. Servidor de Base de Datos PostgreSQL en otro servidor

---

## 🔧 Configuración Inicial en el Servidor

### 1. Clonar el repositorio

```bash
cd /opt
git clone <url-del-repo> medilink
cd medilink
```

### 2. Crear el archivo .env.production

```bash
cp .env.production.example .env.production
nano .env.production
```

**Configurar las siguientes variables críticas:**

```env
# Base de datos (servidor externo)
DATABASE_HOST=ip-o-dominio-del-servidor-db
DATABASE_PORT=5432
DATABASE_NAME=medilink_prod
DATABASE_USER=medilink_user
DATABASE_PASSWORD=password-super-seguro-aqui

# JWT Secret (generar uno nuevo)
JWT_SECRET=generar-con-comando-de-abajo

# CORS (tus dominios frontend)
CORS_ORIGIN=https://tudominio.com,https://app.tudominio.com
```

**Para generar JWT_SECRET seguro:**

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 🐳 Deployment con Docker

### Opción 1: Build y Deploy en un solo paso

```bash
# Construir la imagen
npm run docker:build:prod

# Iniciar el contenedor (asegúrate que .env.production esté configurado)
cd docker
docker-compose --env-file ../.env.production -f docker-compose.prod.yml up -d
```

### Opción 2: Comandos manuales paso a paso

```bash
# 1. Construir la imagen
docker build -f docker/Dockerfile -t medilink-api:latest .

# 2. Verificar que la imagen se creó
docker images | grep medilink

# 3. Iniciar con docker-compose
cd docker
docker-compose --env-file ../.env.production -f docker-compose.prod.yml up -d

# 4. Ver logs
docker-compose -f docker-compose.prod.yml logs -f api
```

---

## 📊 Comandos Útiles de Mantenimiento

### Ver logs en tiempo real

```bash
npm run docker:logs
# o
cd docker && docker-compose -f docker-compose.prod.yml logs -f api
```

### Detener el servicio

```bash
npm run docker:stop:prod
# o
cd docker && docker-compose -f docker-compose.prod.yml down
```

### Reiniciar el servicio

```bash
cd docker
docker-compose -f docker-compose.prod.yml restart api
```

### Ver estado del contenedor

```bash
docker ps | grep medilink
```

### Entrar al contenedor (debugging)

```bash
docker exec -it medilink_api_prod sh
```

### Ver recursos usados

```bash
docker stats medilink_api_prod
```

---

## 🔄 Actualizar la Aplicación (Nuevas Versiones)

```bash
# 1. Ir al directorio del proyecto
cd /opt/medilink

# 2. Hacer pull de los cambios
git pull origin main

# 3. Detener el contenedor actual
cd docker
docker-compose -f docker-compose.prod.yml down

# 4. Reconstruir la imagen
cd ..
docker build -f docker/Dockerfile -t medilink-api:latest .

# 5. Iniciar con la nueva versión
cd docker
docker-compose --env-file ../.env.production -f docker-compose.prod.yml up -d

# 6. Verificar logs
docker-compose -f docker-compose.prod.yml logs -f api
```

---

## 🏥 Health Check

El contenedor tiene un health check automático. Puedes verificarlo manualmente:

```bash
# Desde el servidor
curl http://localhost:3000/health

# Desde fuera (si está expuesto)
curl http://tu-dominio.com:3000/health
```

Respuesta esperada:

```json
{
  "status": "ok",
  "timestamp": "2025-10-04T12:00:00.000Z",
  "uptime": 123.456
}
```

---

## 🔒 Configuración de Nginx (Reverse Proxy)

Si usas Nginx como reverse proxy:

```nginx
server {
    listen 80;
    server_name api.tudominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Para HTTPS con Let's Encrypt:

```bash
sudo certbot --nginx -d api.tudominio.com
```

---

## 🔥 Firewall (UFW)

```bash
# Permitir puerto de la API (si es necesario acceso directo)
sudo ufw allow 3000/tcp

# Si usas Nginx, solo necesitas:
sudo ufw allow 'Nginx Full'
```

---

## 📦 Backup y Restore

### Backup de la imagen Docker

```bash
docker save medilink-api:latest | gzip > medilink-api-backup-$(date +%Y%m%d).tar.gz
```

### Restore de la imagen

```bash
docker load < medilink-api-backup-20250104.tar.gz
```

---

## 🐛 Troubleshooting

### El contenedor no inicia

```bash
# Ver logs detallados
docker-compose -f docker-compose.prod.yml logs api

# Ver últimas 100 líneas
docker-compose -f docker-compose.prod.yml logs --tail=100 api
```

### Error de conexión a la base de datos

```bash
# Verificar que las variables de entorno están correctas
docker exec medilink_api_prod env | grep DATABASE

# Probar conexión desde el contenedor
docker exec -it medilink_api_prod sh
nc -zv $DATABASE_HOST $DATABASE_PORT
```

### Puerto ya en uso

```bash
# Ver qué está usando el puerto 3000
sudo netstat -tulpn | grep 3000

# Cambiar el puerto en .env.production
PORT=3001
```

---

## 📈 Monitoring (Recomendaciones)

Para producción, considera implementar:

1. **PM2** o **Supervisor** para gestión de procesos
2. **Prometheus** + **Grafana** para métricas
3. **ELK Stack** o **Loki** para logs centralizados
4. **Sentry** para tracking de errores
5. **Uptime Robot** o **Pingdom** para monitoreo externo

---

## ✅ Checklist de Deployment

- [ ] Servidor con Docker instalado
- [ ] Base de datos PostgreSQL configurada en servidor separado
- [ ] Archivo `.env.production` configurado correctamente
- [ ] JWT_SECRET generado de forma segura
- [ ] CORS_ORIGIN configurado con dominios reales
- [ ] Puertos correctos abiertos en el firewall
- [ ] Nginx configurado como reverse proxy (recomendado)
- [ ] SSL/TLS configurado con Let's Encrypt
- [ ] Health check funcionando correctamente
- [ ] Logs accesibles y monitoreados
- [ ] Backup strategy definida

---

## 📞 Soporte

Para problemas o dudas, revisar:
- Logs del contenedor: `docker-compose logs -f api`
- Health check: `curl http://localhost:3000/health`
- Estado del contenedor: `docker ps`
