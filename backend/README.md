# Gatherly Backend

Express.js REST API for the Gatherly club management platform.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** Passport.js with Google OAuth 2.0
- **Security:** JWT, bcryptjs, CORS

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js        # MongoDB connection
│   ├── models/                # Mongoose schemas
│   │   └── User.js
│   ├── routes/                # API routes
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── club.routes.js
│   │   ├── activity.routes.js
│   │   ├── quiz.routes.js
│   │   ├── resource.routes.js
│   │   ├── comment.routes.js
│   │   └── leaderboard.routes.js
│   ├── controllers/           # Route controllers (to be implemented)
│   ├── middleware/            # Custom middleware (to be implemented)
│   └── server.js              # Express app entry point
├── .env.example               # Environment variables template
└── package.json
```

## Getting Started

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start MongoDB:**
   Ensure MongoDB is running locally or use MongoDB Atlas.

4. **Run development server:**
   ```bash
   npm run dev
   ```

5. **API will be available at:**
   [http://localhost:5000](http://localhost:5000)

## Environment Variables

Required variables in `.env`:

```env
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/gatherly

# JWT
JWT_SECRET=your-jwt-secret-key-here
JWT_EXPIRE=7d

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Frontend URL for CORS
FRONTEND_URL=http://localhost:3000
```

## API Endpoints

### Authentication
- `POST /api/auth/google` - Initiate Google OAuth
- `GET /api/auth/google/callback` - OAuth callback
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (admin only)

### Clubs
- `GET /api/clubs` - Get all clubs
- `POST /api/clubs` - Create club (coordinator/faculty)
- `GET /api/clubs/:id` - Get club details
- `PUT /api/clubs/:id` - Update club
- `DELETE /api/clubs/:id` - Delete club
- `POST /api/clubs/:id/join` - Join club
- `POST /api/clubs/:id/leave` - Leave club

### Activities
- `GET /api/activities` - Get all activities
- `POST /api/activities` - Create activity
- `GET /api/activities/:id` - Get activity details
- `PUT /api/activities/:id` - Update activity
- `DELETE /api/activities/:id` - Delete activity

### Quizzes
- `GET /api/quizzes` - Get all quizzes
- `POST /api/quizzes` - Create quiz
- `GET /api/quizzes/:id` - Get quiz details
- `POST /api/quizzes/:id/submit` - Submit quiz answers
- `PUT /api/quizzes/:id` - Update quiz
- `DELETE /api/quizzes/:id` - Delete quiz

### Resources
- `POST /api/resources/upload` - Upload resource
- `GET /api/resources` - Get all resources

### Comments (Anonymous Feedback)
- `POST /api/comments` - Post comment
- `GET /api/comments/:clubId` - Get comments by club

### Leaderboards
- `GET /api/leaderboard` - Get leaderboard rankings

## Database Models

### User Schema
```javascript
{
  name: String,
  email: String (unique),
  googleId: String,
  universityId: String,
  department: String,
  year: Number,
  phone: String,
  role: ['member', 'coordinator', 'faculty', 'admin'],
  profileComplete: Boolean,
  approvalStatus: ['pending', 'approved', 'rejected'],
  timestamps: true
}
```

## Development

```bash
npm run dev       # Start with nodemon
npm start         # Start production server
npm run lint      # Run ESLint (if configured)
```

## Security Features

- 🔒 JWT-based authentication
- 🔐 Password hashing with bcryptjs
- 🛡️ CORS configured for frontend only
- ✅ Input validation (to be implemented)
- 🚫 Rate limiting (to be implemented)

## Next Steps

1. Implement controller functions in `/controllers`
2. Add authentication middleware in `/middleware`
3. Create additional Mongoose models (Club, Activity, Quiz, etc.)
4. Add input validation with express-validator
5. Implement rate limiting with express-rate-limit
6. Add API documentation with Swagger
7. Set up testing with Jest

## Deployment

Can be deployed to:
- Heroku
- AWS EC2
- DigitalOcean
- Railway
- Render

See main README.md for deployment instructions.
