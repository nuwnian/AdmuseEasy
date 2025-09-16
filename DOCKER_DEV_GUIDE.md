# Docker Development vs Production Setup

## Current Production Setup (Rebuild Required)
Your current Dockerfile copies code INTO the container:
```dockerfile
COPY server/ ./
COPY client/ ./
```
**Result:** Code changes require rebuild

## Better Development Setup (Live Reloading)
Use volumes to mount your code into the container:

### docker-compose.dev.yml
```yaml
version: '3.8'

services:
  # Development version with live reloading
  admuse-app:
    build: .
    ports:
      - "5000:5000"
      - "3000:3000"  # For React dev server
    environment:
      - NODE_ENV=development
      - PORT=5000
      - MONGODB_URI=mongodb://admin:password123@mongodb:27017/admuse?authSource=admin
      - JWT_SECRET=development-secret-key
    volumes:
      # Mount your code for live reloading
      - ./server:/app/server
      - ./client:/app/client
      - /app/server/node_modules  # Exclude node_modules
      - /app/client/node_modules  # Exclude node_modules
    depends_on:
      - mongodb
    command: npm run dev  # Use nodemon for auto-restart

  mongodb:
    image: mongo:7.0
    ports:
      - "27017:27017"
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=password123
    volumes:
      - mongodb-data:/data/db

volumes:
  mongodb-data:
```

### Usage:
```bash
# Development (live reloading)
docker compose -f docker-compose.dev.yml up

# Production (rebuild required)
docker compose -f docker-compose.yml up --build
```