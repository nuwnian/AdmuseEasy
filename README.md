# AdmuseEasy - AI-Powered Marketing Platform

AdmuseEasy is a professional SaaS platform that generates emotionally resonant marketing ads using AI-powered mascot personalities. Create compelling ad copy with just a few clicks - no marketing expertise required.

## ✨ Features

### Core Features
- **AI-Powered Copy Generation** - Google Gemini integration with personality-driven prompts
- **4 Unique Mascot Personalities** - Each with distinct messaging styles
- **Responsive Design** - Works perfectly on desktop and mobile
- **Fallback System** - Reliable operation even without AI

### Business Features (NEW)
- **User Authentication** - Secure registration and login system
- **Project Management** - Save, edit, and organize your ad campaigns
- **Usage Analytics** - Track your generation history and statistics
- **User Dashboard** - Overview of projects and account activity
- **Cloud Database** - MongoDB integration for data persistence

## 🎭 Mascot Personalities

- **Cozy Capybara** - Calm, zen-like messaging for mindful brands
- **Hype Hamster** - Energetic, bold copy for dynamic products
- **Pixel Parrot** - Quirky, creative messaging for unique brands
- **Zen Panda** - Focused, balanced copy for professional services

## 🚀 Tech Stack

**Frontend:**
- React.js with modern hooks
- Responsive CSS design
- Component-based architecture

**Backend:**
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT authentication
- Google Gemini AI integration

**Security & Production:**
- bcryptjs password hashing
- Helmet.js security headers
- CORS protection
- Input validation and sanitization
- Environment variable protection

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud)
- Google Gemini API key (optional, has fallbacks)

## 🛠️ Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/nuwnian/AdmuseEasy.git
   cd AdmuseEasy
   ```

2. **Install dependencies:**
   ```bash
   # Install root dependencies
   npm install
   
   # Install server dependencies
   cd server && npm install
   
   # Install client dependencies
   cd ../client && npm install
   ```

3. **Environment Setup:**
   ```bash
   # Copy environment template
   cp server/.env.example server/.env
   
   # Edit server/.env with your configuration:
   # MONGODB_URI=mongodb://localhost:27017/admuse-easy
   # JWT_SECRET=your-super-secret-jwt-key
   # GOOGLE_API_KEY=your-google-gemini-api-key (optional)
   ```

4. **Database Setup:**
   ```bash
   # Make sure MongoDB is running locally, or use MongoDB Atlas
   # The app will create the database automatically
   ```

5. **Start the application:**
   ```bash
   # Development mode (from root directory)
   npm start
   
   # Or start components separately:
   # Backend: cd server && npm start
   # Frontend: cd client && npm start
   ```

6. **Open your browser:**
   - Frontend: http://localhost:3000
   - API: http://localhost:5000/api/health

## 📚 API Documentation

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete API reference including:
- Authentication endpoints
- Project management
- User dashboard
- Ad generation
- Error handling

## 🧪 Testing

Test the API endpoints:
```bash
# Start the server first
npm start

# In another terminal, run API tests
cd server && node test-api.js
```

## 🌐 Live Deployments

- **Production (Azure):** https://admuse-easy.azurewebsites.net/
- **Staging (Railway):** https://admuseeasy-production.up.railway.app/

## 📁 Project Structure

```
AdmuseEasy/
├── client/                 # React frontend
│   ├── src/
│   │   ├── App.js         # Main application component
│   │   ├── QADocs.js      # QA documentation component
│   │   └── About.js       # About page component
│   └── public/            # Static assets
├── server/                # Node.js backend
│   ├── models/            # Database models
│   │   ├── User.js        # User model
│   │   └── Project.js     # Project model
│   ├── routes/            # API routes
│   │   ├── auth.js        # Authentication routes
│   │   ├── projects.js    # Project management routes
│   │   └── dashboard.js   # Dashboard routes
│   ├── middleware/        # Custom middleware
│   │   └── auth.js        # JWT authentication middleware
│   └── index.js           # Main server file
├── docs/                  # Documentation
└── API_DOCUMENTATION.md   # Complete API reference
```

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcryptjs
- Input validation and sanitization
- CORS protection
- Security headers with Helmet.js
- Environment variable protection
- Rate limiting ready (configurable)

## 🚀 Deployment

### Azure App Service
1. Configure environment variables in Azure portal
2. Set up MongoDB Atlas or Azure Cosmos DB
3. Deploy using GitHub Actions (workflow included)

### Railway
1. Connect GitHub repository
2. Add environment variables
3. Deploy automatically on push

### Manual Deployment
```bash
# Build the application
npm run build

# Start in production mode
NODE_ENV=production npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎯 What's Next?

- Email verification system
- Password reset functionality
- Project sharing and collaboration
- Advanced analytics dashboard
- Export functionality (PDF, PNG)
- Team management features
- API rate limiting
- Webhook integrations

---

**Built with ❤️ for marketers, agencies, and entrepreneurs who want to create compelling ads without the complexity.**
