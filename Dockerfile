## ---------- BUILDER ----------
FROM node:20-alpine AS builder
WORKDIR /app

# Pin pnpm para builds reproducibles
RUN corepack enable && corepack prepare pnpm@9.12.2 --activate

# Copiar manifiestos y prisma antes de instalar (postinstall prisma necesita schema)
COPY package.json pnpm-lock.yaml* ./
COPY prisma ./prisma

# Instalar dependencias (no usar frozen para evitar fallas por lockfile desfasado en CI)
RUN pnpm install --no-frozen-lockfile

# Copiar código y configs
COPY tsconfig*.json ./
COPY src ./src

# Generar Prisma Client y compilar
RUN pnpm exec prisma generate
RUN pnpm run build

## ---------- RUNTIME ----------
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Instalar pnpm en runtime para comandos Prisma
RUN corepack enable && corepack prepare pnpm@9.12.2 --activate

# Usuario no root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copiar archivos necesarios del builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json

# Asegurar que el usuario tenga permisos sobre los archivos copiados
RUN chown -R appuser:appgroup /app

USER appuser
EXPOSE 4000

# Regenerar Prisma Client, ejecutar migraciones y levantar app
CMD ["sh", "-c", "pnpm exec prisma generate && npx prisma migrate deploy && node dist/src/main.js"]
