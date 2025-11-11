# ---------- BUILDER ----------
    FROM node:18-alpine AS builder
    WORKDIR /app
    
    # Habilitar pnpm
    RUN corepack enable && corepack prepare pnpm@latest --activate
    
    # Copiar archivos de workspace si existen (importante en monorepos)
    # Ajusta si no tienes pnpm-workspace.yaml
    COPY pnpm-workspace.yaml ./
    COPY package.json pnpm-lock.yaml ./
    
    # Instalar dev deps (necesarios para prisma generate y build)
    RUN pnpm install --frozen-lockfile
    
    # Copiar prisma/schema y código fuente
    COPY prisma ./prisma
    COPY tsconfig*.json ./
    COPY src ./src
    
    # Generar cliente prisma con la configuración local (builder tiene el CLI)
    RUN pnpm exec prisma generate
    
    # Compilar la aplicación
    RUN pnpm run build
    
    
    # ---------- RUNTIME ----------
    FROM node:18-alpine AS runner
    WORKDIR /app
    
    RUN corepack enable && corepack prepare pnpm@latest --activate
    
    # instalar sólo prod deps
    COPY package.json pnpm-lock.yaml ./
    RUN pnpm install --prod --frozen-lockfile
    
    # copiar build
    COPY --from=builder /app/dist ./dist
    
    # copiar el paquete @prisma generado desde el builder (sobrescribe el instalado si existe)
    COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
    
    # opcional: copiar carpeta prisma si la usas en runtime (migrations, schema para introspecciones)
    COPY prisma ./prisma
    
    EXPOSE 3001
    ENV NODE_ENV=production
    
CMD ["node", "dist/src/main.js"]
    