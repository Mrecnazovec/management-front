# syntax=docker/dockerfile:1

FROM node:22-bookworm-slim AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

ARG APP_ENV=production
ARG APP_URL=http://localhost:3001
ARG APP_DOMAIN=localhost
ARG SERVER_URL=http://localhost:4200
ARG PORT=3001

FROM base AS deps
ENV NODE_ENV=development
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS build
ENV NODE_ENV=production
ENV APP_ENV=${APP_ENV}
ENV APP_URL=${APP_URL}
ENV APP_DOMAIN=${APP_DOMAIN}
ENV SERVER_URL=${SERVER_URL}
ENV PORT=${PORT}
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
ENV APP_ENV=${APP_ENV}
ENV APP_URL=${APP_URL}
ENV APP_DOMAIN=${APP_DOMAIN}
ENV SERVER_URL=${SERVER_URL}
ENV PORT=${PORT}
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY next.config.ts ./next.config.ts
EXPOSE 3001
CMD ["npm", "start"]
