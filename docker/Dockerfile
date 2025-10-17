# ============================================
# DOCKERFILE PARA PRODUCCIÓN - MULTI-STAGE
# ============================================

# -----------------
# Etapa 1: Builder
# -----------------
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias (incluyendo devDependencies para la compilación)
RUN npm ci

# Copiar archivos de configuración y código fuente
COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY src ./src

# Compilar la aplicación
RUN npm run build

# Limpiar devDependencies
RUN npm prune --production

# -----------------
# Etapa 2: Runner (Producción)
# -----------------
FROM node:20-alpine AS runner

# Instalar dumb-init para manejo correcto de señales
RUN apk add --no-cache dumb-init

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

WORKDIR /app

# Copiar solo lo necesario desde builder
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/package*.json ./

# Cambiar al usuario no-root
USER nestjs

# Exponer puerto
EXPOSE 3000

# Usar dumb-init para manejo correcto de señales (SIGTERM, etc)
ENTRYPOINT ["dumb-init", "--"]

# Comando para iniciar la aplicación
CMD ["node", "dist/main.js"]
