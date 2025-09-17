# Multi-stage Docker build for AdmuseEasy
# Stage 1: Build React client
FROM node:18-alpine AS client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Stage 2: Setup server with built client
FROM node:18-alpine AS production
WORKDIR /app

# Copy server files
COPY server/package*.json ./
RUN npm install --only=production

# Install wget for health checks
RUN apk add --no-cache wget

# Copy server source
COPY server/ ./

# Copy built client from previous stage
COPY --from=client-build /app/client/build ./client/build

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S admuse -u 1001
USER admuse

# Set production environment
ENV NODE_ENV=production
ENV PORT=5000
ENV WEBSITE_HOSTNAME=admuse-easy.azurewebsites.net

# Expose port
EXPOSE 5000

# Health check using wget
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1

# Start application
CMD ["node", "index.js"]