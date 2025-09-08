# AdmuseEasy - Backend (Node.js)

This is the Node.js backend for AdmuseEasy, handling API requests and AI integration.

## Features
- Express.js REST API
- Google Gemini AI integration
- Smart fallback system (works without AI)
- Personality-driven prompt engineering
- Security middleware (CORS, Helmet)
- Input validation and sanitization
- Professional error handling

## API Endpoints
- `POST /api/generate-copy` - Generate ad copy with mascot personality
- `GET /api/health` - Health check endpoint
- `GET /*` - Serve React frontend (production)

## AI Integration
- **Google Gemini API** support
- **Personality-based prompts** for each mascot
- **Structured JSON responses**
- **Graceful fallbacks** if AI unavailable
- **Error handling** and recovery

## Installation
1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment (optional):
   ```bash
   cp .env.example .env
   # Add GOOGLE_API_KEY for AI features
   ```

3. Start server:
   ```bash
   npm start
   ```

## Environment Variables
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `GOOGLE_API_KEY` - Google Gemini API key (optional)

## Security Features
- CORS protection
- Input validation
- Rate limiting ready
- Security headers (Helmet.js)
- Environment variable protection

## Deployment
- Railway ready
- Heroku compatible
- Azure App Service ready
- Docker support available

---

**Part of AdmuseEasy - Professional Marketing Ad Generator**