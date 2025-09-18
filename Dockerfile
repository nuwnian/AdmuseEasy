# Multi-stage Docker build for AdmuseEasy - Azure Optimized
# Stage 1: Build React client
FROM node:20-alpine AS client-build
WORKDIR /app/client

# Copy package files first for better caching
COPY client/package*.json ./
RUN npm ci --only=production

# Copy source and build
COPY client/ ./
RUN npm run build

# Stage 2: Setup production server
FROM node:20-alpine AS production
WORKDIR /app

# Install system dependencies for Azure
RUN apk add --no-cache \
    wget \
    curl \
    dumb-init \
    && rm -rf /var/cache/apk/*

# Copy package files and install dependencies
COPY server/package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy server source
COPY server/ ./

# Copy built client from previous stage
COPY --from=client-build /app/client/build ./client/build

# Set production environment variables for Azure
ENV NODE_ENV=production
ENV PORT=5000
ENV DEMO_MODE=false
ENV WEBSITE_HOSTNAME=admuse-easy.azurewebsites.net
ENV GOOGLE_API_KEY=dummy-key-for-startup

# Add a startup script for better Azure compatibility
RUN echo '#!/bin/sh\necho "🚀 Starting AdmuseEasy on Azure..."\necho "Environment: $NODE_ENV"\necho "Demo Mode: $DEMO_MODE"\necho "Port: $PORT"\nexec "$@"' > /app/start.sh && \
    chmod +x /app/start.sh

# Create logs directory
RUN mkdir -p /app/logs && chmod 755 /app/logs

# Expose port
EXPOSE 5000

# Health check optimized for Azure
HEALTHCHECK --interval=60s --timeout=30s --start-period=60s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1

# Use dumb-init to handle signals properly in containers
ENTRYPOINT ["/usr/bin/dumb-init", "--"]

# Start with the startup script
CMD ["/app/start.sh", "node", "index.js"]