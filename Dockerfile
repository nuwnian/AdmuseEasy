# Multi-stage Docker build for AdmuseEasy - Azure Web Apps Compatible
# Stage 1: Build React client
FROM node:20-alpine AS client-build
WORKDIR /app/client

# Copy package files first for better caching
COPY client/package*.json ./
RUN npm ci --only=production

# Copy source and build
COPY client/ ./
RUN npm run build

# Stage 2: Setup production server - Azure Web Apps Compatible
FROM node:20-alpine AS production

# Set platform labels for Azure runtime detection
LABEL com.microsoft.azure.appservice.runtime="node"
LABEL com.microsoft.azure.appservice.version="20"
LABEL com.microsoft.azure.appservice.platform="linux"

WORKDIR /app

# Install system dependencies for Azure Web Apps
RUN apk add --no-cache \
    wget \
    curl \
    dumb-init \
    bash \
    && rm -rf /var/cache/apk/*

# Copy package files and install dependencies
COPY server/package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy server source
COPY server/ ./

# Copy built client from previous stage
COPY --from=client-build /app/client/build ./client/build

# Set production environment variables
ENV NODE_ENV=production
ENV PORT=8080
ENV DEMO_MODE=false
ENV WEBSITE_HOSTNAME=localhost
ENV GOOGLE_API_KEY=dummy-key-for-startup

# Azure Web Apps specific environment variables
ENV WEBSITES_ENABLE_APP_SERVICE_STORAGE=false
ENV WEBSITES_PORT=8080

# Create logs directory
RUN mkdir -p /app/logs && chmod 755 /app/logs

# Create startup script for Railway/Azure compatibility
RUN printf '#!/bin/bash\necho "🚀 Starting AdmuseEasy..."\necho "Environment: $NODE_ENV"\necho "Demo Mode: $DEMO_MODE"\necho "Port: $PORT"\necho "Node Version: $(node --version)"\necho "Starting server..."\nexec "$@"\n' > /app/start.sh && \
    chmod +x /app/start.sh

# Expose the port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=60s --timeout=30s --start-period=90s --retries=5 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/api/health || exit 1

# Use dumb-init for proper signal handling
ENTRYPOINT ["/usr/bin/dumb-init", "--"]

# Start with direct node command for Railway compatibility
CMD ["node", "index.js"]