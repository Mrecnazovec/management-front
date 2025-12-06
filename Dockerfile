# syntax=docker/dockerfile:1

FROM node:22-bookworm-slim AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

FROM base AS deps
ENV NODE_ENV=development
COPY package.json yarn.lock ./
RUN corepack enable \
	&& yarn install --frozen-lockfile

FROM base AS build
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN corepack enable \
	&& yarn build

FROM base AS runner
ENV NODE_ENV=production
COPY package.json yarn.lock ./
RUN corepack enable \
	&& yarn install --frozen-lockfile --production=true
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY next.config.ts ./next.config.ts
EXPOSE 3001
CMD ["yarn", "start"]
