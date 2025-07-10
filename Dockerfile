FROM node:20-alpine AS base

ENV FORCE_COLOR=0

RUN corepack enable

RUN apk update && apk upgrade && rm -rf /var/cache/apk/*

RUN npm i -g npm@latest

################################# LOCKFILE GENERATOR #########################################
FROM base AS lockfile
WORKDIR /app/studio

# Copy package.json to generate pnpm-lock.yaml
COPY app/package.json ./

# Run pnpm install to generate pnpm-lock.yaml
RUN pnpm install

################################# STUDIO #########################################
FROM base AS studio
WORKDIR /app/studio

# Build arguments for Next.js config - MOVED TO TOP OF STAGE
ARG DASHBOARD_API_URL
ARG TOPIC_API_URL
ARG AUTH_DOMAIN
ARG ADMIN_AGENT
ARG ADMIN_FLOW_DASHBOARD_API

# Set environment variables for build - MOVED BEFORE COPYING SOURCE
ENV DASHBOARD_API_URL=$DASHBOARD_API_URL
ENV TOPIC_API_URL=$TOPIC_API_URL
ENV AUTH_DOMAIN=$AUTH_DOMAIN
ENV ADMIN_AGENT=$ADMIN_AGENT
ENV ADMIN_FLOW_DASHBOARD_API=$ADMIN_FLOW_DASHBOARD_API

# Copy package.json and pnpm-lock.yaml (generated or from source)
COPY app/package.json ./
COPY --from=lockfile /app/studio/pnpm-lock.yaml ./

# Install dependencies using the lockfile
RUN pnpm install --frozen-lockfile

# Install additional dev dependencies
RUN pnpm add -D @parcel/watcher @tailwindcss/oxide lightningcss sharp

# Disable Next.js telemetry
RUN npx next telemetry disable

# Copy source code AFTER setting environment variables
COPY app/. .

# Build the application
RUN pnpm run build

################################### APP #######################################
FROM base AS app

# Create user and group with specific IDs
RUN addgroup -g 1001 -S nodejs && \
    adduser -S insight -u 1001 -G nodejs

# Set working directory
WORKDIR /app

# Create studio directory with proper ownership
RUN mkdir -p /app/studio && \
    chown -R insight:nodejs /app

# Copy built application from studio stage
COPY --from=studio --chown=insight:nodejs /app/studio/.next /app/studio/.next
COPY --from=studio --chown=insight:nodejs /app/studio/next.config.js /app/studio/next.config.js
COPY --from=studio --chown=insight:nodejs /app/studio/package.json /app/studio/package.json
COPY --from=studio --chown=insight:nodejs /app/studio/pnpm-lock.yaml /app/studio/pnpm-lock.yaml
COPY --from=studio --chown=insight:nodejs /app/studio/public /app/studio/public

# Install only production dependencies in final stage
WORKDIR /app/studio
RUN pnpm install --frozen-lockfile --prod

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080
ENV NEXT_TELEMETRY_DISABLED=1

# Switch to non-root user
USER insight

# Expose port
EXPOSE 8080

# Start the application
CMD ["pnpm", "start"]