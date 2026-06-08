# ── Build stage ────────────────────────────────────────────────
FROM node:22-slim AS build
WORKDIR /app

# Install all deps (incl. dev) for the TypeScript build
COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# Drop dev dependencies for the runtime image
RUN npm prune --omit=dev

# ── Runtime stage ──────────────────────────────────────────────
FROM node:22-slim AS runtime
ENV NODE_ENV=production
WORKDIR /app

# Non-root user
RUN useradd --user-group --create-home --shell /bin/false app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./

# uploads dir (mounted as a volume in compose) — owned by app user
RUN mkdir -p uploads && chown -R app:app /app
USER app

EXPOSE 4000
CMD ["node", "dist/index.js"]
