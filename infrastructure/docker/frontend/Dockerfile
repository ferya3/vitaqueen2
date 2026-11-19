# Next.js 16 frontend — standalone output.

FROM node:22-alpine AS deps
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json ./
# Optional npm mirror for networks where registry.npmjs.org is slow or blocked.
ARG NPM_REGISTRY=https://registry.npmjs.org/
RUN npm ci --no-audit --no-fund --registry="$NPM_REGISTRY"

FROM node:22-alpine AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
# Public values are inlined at build time.
ARG NEXT_PUBLIC_SITE_URL=https://example.com
ARG NEXT_PUBLIC_API_URL=/api/v1
ARG NEXT_PUBLIC_MEDIA_URL=https://example.com
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL NEXT_PUBLIC_MEDIA_URL=$NEXT_PUBLIC_MEDIA_URL
# During the image build the API is usually not reachable: pages are prerendered
# from data/snapshot and refreshed from the live API at runtime.
ARG API_INTERNAL_URL=http://backend-unavailable.invalid/api/v1
ENV API_INTERNAL_URL=$API_INTERNAL_URL
COPY --from=deps /app/node_modules ./node_modules
COPY frontend/ ./
RUN npm run build

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
RUN addgroup -S nextjs && adduser -S nextjs -G nextjs
COPY --from=build --chown=nextjs:nextjs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nextjs /app/.next/static ./.next/static
COPY --from=build --chown=nextjs:nextjs /app/public ./public
USER nextjs
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD wget -qO- http://127.0.0.1:3000/robots.txt >/dev/null || exit 1
CMD ["node", "server.js"]
