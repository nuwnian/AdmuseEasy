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

# Set production environment variables for Azure Web Apps
ENV NODE_ENV=production
ENV PORT=8080
ENV DEMO_MODE=false
ENV WEBSITE_HOSTNAME=admuse-easy.azurewebsites.net
ENV GOOGLE_API_KEY=dummy-key-for-startup

# Azure Web Apps specific environment variables
ENV WEBSITES_ENABLE_APP_SERVICE_STORAGE=false
ENV WEBSITES_PORT=8080

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

# Create logs directory with proper permissions
RUN mkdir -p /app/logs && chmod 755 /app/logs && chown nodejs:nodejs /app/logs

# Add a startup script optimized for Azure Web Apps
RUN echo '#!/bin/bash\necho "🚀 Starting AdmuseEasy on Azure Web Apps..."\necho "Environment: $NODE_ENV"\necho "Demo Mode: $DEMO_MODE"\necho "Port: $PORT"\necho "Platform: Azure Web Apps (Linux Container)"\necho "Node Version: $(node --version)"\necho "Starting server..."\nexec "$@"' > /app/start.sh && \
    chmod +x /app/start.sh && \
    chown nodejs:nodejs /app/start.sh

# Change ownership to nodejs user
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose the port Azure Web Apps expects
EXPOSE 8080

# Health check optimized for Azure Web Apps
HEALTHCHECK --interval=60s --timeout=30s --start-period=90s --retries=5 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/api/health || exit 1

# Use dumb-init to handle signals properly in Azure containers
ENTRYPOINT ["/usr/bin/dumb-init", "--"]

# Start with the Azure-optimized startup script
CMD ["/app/start.sh", "node", "index.js"]