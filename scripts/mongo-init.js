// MongoDB initialization script for AdmuseEasy container setup

// Create database and user
db = db.getSiblingDB('admuse-easy');

// Create collections with validation
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['email', 'password', 'createdAt'],
      properties: {
        email: {
          bsonType: 'string',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
          description: 'must be a valid email address'
        },
        password: {
          bsonType: 'string',
          minLength: 6,
          description: 'must be a string with at least 6 characters'
        },
        name: {
          bsonType: 'string',
          description: 'optional user display name'
        },
        googleId: {
          bsonType: 'string',
          description: 'Google OAuth ID if applicable'
        },
        createdAt: {
          bsonType: 'date',
          description: 'user creation timestamp'
        },
        lastLogin: {
          bsonType: 'date',
          description: 'last login timestamp'
        }
      }
    }
  }
});

db.createCollection('projects', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['userId', 'title', 'mascot', 'createdAt'],
      properties: {
        userId: {
          bsonType: 'objectId',
          description: 'reference to user who owns this project'
        },
        title: {
          bsonType: 'string',
          minLength: 1,
          maxLength: 200,
          description: 'project title'
        },
        description: {
          bsonType: 'string',
          maxLength: 1000,
          description: 'optional project description'
        },
        mascot: {
          bsonType: 'string',
          enum: ['capybara', 'hamster', 'parrot', 'panda'],
          description: 'selected mascot personality'
        },
        businessInfo: {
          bsonType: 'object',
          properties: {
            type: { bsonType: 'string' },
            target_audience: { bsonType: 'string' },
            unique_value: { bsonType: 'string' },
            tone: { bsonType: 'string' }
          }
        },
        generatedCopy: {
          bsonType: 'string',
          description: 'AI-generated marketing copy'
        },
        status: {
          bsonType: 'string',
          enum: ['draft', 'completed', 'archived'],
          description: 'project status'
        },
        createdAt: {
          bsonType: 'date',
          description: 'project creation timestamp'
        },
        updatedAt: {
          bsonType: 'date',
          description: 'last update timestamp'
        }
      }
    }
  }
});

// Create indexes for performance
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ googleId: 1 }, { sparse: true });
db.users.createIndex({ createdAt: -1 });

db.projects.createIndex({ userId: 1 });
db.projects.createIndex({ createdAt: -1 });
db.projects.createIndex({ mascot: 1 });
db.projects.createIndex({ status: 1 });

// Insert sample data for development
const sampleUser = {
  email: 'demo@admuseeasy.com',
  password: '$2a$10$rOzJqBGj7Qpf8K4mFZyHQOL5WF5Km7n8xRtHkQ2vBhJpX3wE9yLqS', // hashed 'demo123'
  name: 'Demo User',
  createdAt: new Date(),
  lastLogin: new Date()
};

const userId = db.users.insertOne(sampleUser).insertedId;

const sampleProjects = [
  {
    userId: userId,
    title: 'Eco-Friendly Water Bottle Campaign',
    description: 'Marketing campaign for sustainable water bottles',
    mascot: 'capybara',
    businessInfo: {
      type: 'Eco-friendly products',
      target_audience: 'Environmentally conscious consumers',
      unique_value: 'Made from 100% recycled materials',
      tone: 'Calm and responsible'
    },
    generatedCopy: 'Stay hydrated while staying mindful of our planet. Our eco-friendly water bottles are crafted from 100% recycled materials, perfect for the conscious consumer who values sustainability without compromising on quality.',
    status: 'completed',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    userId: userId,
    title: 'High-Energy Fitness App Launch',
    description: 'Launch campaign for new fitness tracking app',
    mascot: 'hamster',
    businessInfo: {
      type: 'Fitness app',
      target_audience: 'Fitness enthusiasts and beginners',
      unique_value: 'AI-powered personalized workouts',
      tone: 'Energetic and motivating'
    },
    generatedCopy: 'UNLEASH YOUR POTENTIAL! 💪 Ready to revolutionize your fitness journey? Our AI-powered app creates personalized workouts that adapt to YOU! No more boring routines - just pure, energetic transformation!',
    status: 'completed',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
  },
  {
    userId: userId,
    title: 'Creative Design Studio Branding',
    description: 'Brand positioning for quirky design studio',
    mascot: 'parrot',
    businessInfo: {
      type: 'Design studio',
      target_audience: 'Small businesses and startups',
      unique_value: 'Unique, memorable brand identities',
      tone: 'Creative and playful'
    },
    generatedCopy: 'Why blend in when you can stand out? 🎨 At our design studio, we don\'t just create logos - we craft personalities! Let\'s turn your brand into an unforgettable experience that makes competitors go "Wait, how did they think of that?"',
    status: 'draft',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000)
  }
];

db.projects.insertMany(sampleProjects);

print('AdmuseEasy database initialized successfully!');
print('Sample user created: demo@admuseeasy.com (password: demo123)');
print('Sample projects created for testing and demonstration');
print('Database indexes created for optimal performance');