## ---------- SINGLE STAGE WITH PUPPETEER SUPPORT ----------
FROM node:20-slim
WORKDIR /app

# Instalar dependencias de Chromium para Puppeteer
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgbm1 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libxcomposite1 \
    libxdamage1 \
    libxkbcommon0 \
    libxrandr2 \
    xdg-utils \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Configurar Puppeteer para usar Chromium del sistema
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Instalar pnpm
RUN corepack enable && corepack prepare pnpm@9.12.2 --activate

# Copiar package files y prisma schema
COPY package.json pnpm-lock.yaml* ./
COPY prisma ./prisma

# Instalar TODAS las dependencias (incluye devDependencies para build)
RUN pnpm install --no-frozen-lockfile

# Copiar código fuente
COPY tsconfig*.json ./
COPY src ./src

# Build de la aplicación (usar pnpm exec para asegurar que nest esté disponible)
RUN pnpm exec nest build

# Ahora configurar para producción
ENV NODE_ENV=production

# Usuario no root
RUN groupadd -r appgroup && useradd -r -g appgroup appuser
RUN chown -R appuser:appgroup /app

USER appuser
EXPOSE 4000

# Ejecutar migraciones y iniciar aplicación (regenerar client justo antes de iniciar)
CMD ["sh", "-c", "pnpm exec prisma generate && npx prisma migrate deploy && node dist/src/main.js"]
