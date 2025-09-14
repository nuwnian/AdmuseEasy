# AdmuseEasy API Documentation

## Overview
AdmuseEasy API provides endpoints for AI-powered marketing ad generation with user management and project saving capabilities.

**Base URL:** `http://localhost:5000/api` (development) or `https://your-domain.com/api` (production)

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## Endpoints

### Health Check
**GET** `/health`

Check if the API is running.

**Response:**
```json
{
  "message": "AdmuseEasy API is running!"
}
```

---

### Authentication

#### Register User
**POST** `/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```

#### Login User
**POST** `/auth/login`

Authenticate existing user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```

---

### Projects

#### Get User Projects
**GET** `/projects`
*Requires Authentication*

Get all projects for the authenticated user.

**Response:**
```json
[
  {
    "_id": "project-id",
    "title": "Coffee Campaign",
    "productName": "Amazing Coffee",
    "description": "Best coffee in town",
    "targetAudience": "Coffee lovers",
    "mascot": "hamster",
    "generatedCopy": "Generated ad copy here",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### Save Project
**POST** `/projects`
*Requires Authentication*

Save a new project.

**Request Body:**
```json
{
  "title": "My Campaign",
  "productName": "Amazing Product",
  "description": "Product description",
  "targetAudience": "Target audience",
  "mascot": "hamster",
  "generatedCopy": "Generated copy (optional)"
}
```

**Response:**
```json
{
  "message": "Project saved successfully",
  "project": {
    "_id": "project-id",
    "title": "My Campaign",
    "productName": "Amazing Product",
    // ... other fields
  }
}
```

#### Update Project
**PUT** `/projects/:id`
*Requires Authentication*

Update an existing project.

**Request Body:** (all fields optional)
```json
{
  "title": "Updated Title",
  "productName": "Updated Product",
  "description": "Updated description",
  "targetAudience": "Updated audience",
  "mascot": "parrot",
  "generatedCopy": "Updated copy"
}
```

#### Delete Project
**DELETE** `/projects/:id`
*Requires Authentication*

Delete a project.

**Response:**
```json
{
  "message": "Project deleted successfully"
}
```

---

### Dashboard

#### Get User Dashboard
**GET** `/dashboard`
*Requires Authentication*

Get user statistics and recent projects.

**Response:**
```json
{
  "user": {
    "name": "John Doe",
    "email": "john@example.com",
    "memberSince": "2024-01-01T00:00:00.000Z",
    "lastLogin": "2024-01-01T00:00:00.000Z",
    "usageCount": 15
  },
  "stats": {
    "totalProjects": 5,
    "totalGenerations": 15
  },
  "recentProjects": [
    {
      "_id": "project-id",
      "title": "Recent Project",
      "productName": "Product Name",
      "mascot": "hamster",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### Ad Generation

#### Generate Ad Copy
**POST** `/generate-copy`

Generate AI-powered ad copy. Authentication is optional but recommended for usage tracking.

**Request Body:**
```json
{
  "product": {
    "name": "Amazing Coffee",
    "description": "Premium coffee beans roasted fresh daily",
    "audience": "Coffee enthusiasts"
  },
  "mascot": "hamster"
}
```

**Available Mascots:**
- `capybara` - Calm, zen-like, minimalist
- `hamster` - Energetic, enthusiastic, bold
- `parrot` - Quirky, creative, playful
- `panda` - Focused, balanced, calm

**Response:**
```json
{
  "copy": {
    "headline": "Amazing Coffee - Energize Your Life!",
    "tagline": "Premium beans for premium people",
    "cta": "Get Energized!",
    "blurb": "Premium coffee beans roasted fresh daily for the perfect cup"
  },
  "powered_by": "AI"
}
```

---

## Error Responses

All endpoints return appropriate HTTP status codes and error messages:

**400 Bad Request:**
```json
{
  "message": "Invalid input data",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

**401 Unauthorized:**
```json
{
  "message": "No token, authorization denied"
}
```

**404 Not Found:**
```json
{
  "message": "Project not found"
}
```

**500 Server Error:**
```json
{
  "message": "Server error"
}
```

---

## Database Requirements

The API requires MongoDB for user and project data storage. Set the connection string in your environment variables:

```env
MONGODB_URI=mongodb://localhost:27017/admuse-easy
```

For production, use MongoDB Atlas or another cloud database service.

---

## Environment Variables

Required environment variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/admuse-easy

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key

# AI Integration (optional)
GOOGLE_API_KEY=your-google-gemini-api-key

# Server
NODE_ENV=development
PORT=5000
```

---

## Rate Limiting

Currently no rate limiting is implemented. For production deployment, consider adding rate limiting middleware to prevent abuse.

---

## Testing

Use the provided test script to verify API functionality:

```bash
# Start the server
npm start

# In another terminal, run tests
node test-api.js
```

Or use tools like Postman, Insomnia, or curl to test individual endpoints.

---

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Input validation and sanitization
- CORS protection
- Security headers with Helmet.js
- Environment variable protection

---

## Future Enhancements

Planned features for future versions:
- Rate limiting
- Email verification
- Password reset functionality
- Project sharing
- Team collaboration
- Advanced analytics
- Export functionality