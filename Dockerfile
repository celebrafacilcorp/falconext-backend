## ---------- SINGLE STAGE ----------
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

# Instalar pnpm
RUN corepack enable && corepack prepare pnpm@9.12.2 --activate

# Copiar package files y prisma schema
COPY package.json pnpm-lock.yaml* ./
COPY prisma ./prisma

# Instalar dependencias (incluye postinstall que genera Prisma Client)
RUN pnpm install --no-frozen-lockfile

# Copiar código fuente
COPY tsconfig*.json ./
COPY src ./src

# Build de la aplicación
RUN pnpm run build

# Usuario no root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN chown -R appuser:appgroup /app

USER appuser
EXPOSE 4000

# Ejecutar migraciones y iniciar aplicación
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main.js"]
