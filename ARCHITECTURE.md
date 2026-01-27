# Gatherly - Project Architecture Overview

## 🏛️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Next.js 14 Frontend (Port 3000)                     │  │
│  │  - Server-Side Rendering (SSR)                       │  │
│  │  - React Components                                  │  │
│  │  - Zustand State Management                          │  │
│  │  - Tailwind CSS Styling                              │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↓ HTTP/REST API
┌─────────────────────────────────────────────────────────────┐
│                      Application Layer                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  NestJS Backend (Port 5000)                          │  │
│  │  - RESTful API Endpoints                             │  │
│  │  - JWT Authentication                                │  │
│  │  - Google OAuth 2.0                                  │  │
│  │  - File Upload (Cloudinary)                          │  │
│  │  - Business Logic & Validation                       │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↓ Prisma ORM
┌─────────────────────────────────────────────────────────────┐
│                        Data Layer                            │
│  ┌─────────────────────┐       ┌─────────────────────────┐ │
│  │  PostgreSQL         │       │  Redis Cache            │ │
│  │  (Port 5433)        │       │  (Port 6379)            │ │
│  │  - Primary Database │       │  - Session Storage      │ │
│  │  - Relational Data  │       │  - Caching Layer        │ │
│  └─────────────────────┘       └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 📦 Technology Stack

### Frontend Technologies

| Technology | Purpose | Why We Use It |
|------------|---------|---------------|
| **Next.js 14** | React Framework | SSR, App Router, optimized performance |
| **TypeScript** | Type Safety | Catch errors early, better IDE support |
| **Tailwind CSS** | Styling | Utility-first, responsive, customizable |
| **Zustand** | State Management | Simple, lightweight, no boilerplate |
| **next-themes** | Theme Management | Light/dark mode with system detection |

### Backend Technologies

| Technology | Purpose | Why We Use It |
|------------|---------|---------------|
| **NestJS** | Node.js Framework | Modular, scalable, enterprise-ready |
| **Prisma** | ORM | Type-safe database access, migrations |
| **PostgreSQL** | Database | Reliable, ACID compliant, powerful |
| **Redis** | Cache | Fast session storage, improved performance |
| **Passport.js** | Authentication | OAuth 2.0 integration |
| **Cloudinary** | File Storage | Image/video hosting, transformations |

## 🔄 Data Flow

### Authentication Flow

```
1. User clicks "Sign In with Google"
   ↓
2. Frontend redirects to Backend OAuth endpoint
   ↓
3. Backend redirects to Google OAuth
   ↓
4. User authorizes on Google
   ↓
5. Google redirects to Backend callback
   ↓
6. Backend validates, creates/updates user
   ↓
7. Backend generates JWT token
   ↓
8. Frontend receives token, stores in Zustand
   ↓
9. Frontend redirects to dashboard
```

### API Request Flow

```
1. Frontend Component makes API request
   ↓
2. API Client adds JWT token to headers
   ↓
3. Backend validates JWT token (AuthGuard)
   ↓
4. Backend validates request data (ValidationPipe)
   ↓
5. Controller receives request
   ↓
6. Service processes business logic
   ↓
7. Prisma queries database
   ↓
8. Service transforms data
   ↓
9. Controller returns response
   ↓
10. Frontend updates state and UI
```

## 📂 Project Structure Explained

### Backend Structure

```
backend/
├── src/
│   ├── auth/                    # Authentication module
│   │   ├── strategies/          # Passport strategies (JWT, Google)
│   │   ├── guards/              # Route protection
│   │   ├── auth.controller.ts   # Auth endpoints
│   │   └── auth.service.ts      # Auth logic
│   │
│   ├── users/                   # User management
│   │   ├── users.controller.ts  # User CRUD endpoints
│   │   └── users.service.ts     # User business logic
│   │
│   ├── clubs/                   # Club management
│   ├── quizzes/                 # Quiz system
│   ├── leaderboards/            # Scoring & rankings
│   ├── activities/              # Activity management
│   ├── comments/                # Comment system
│   ├── approvals/               # Role approvals
│   │
│   ├── prisma/                  # Database module
│   │   ├── prisma.module.ts     # Prisma module
│   │   └── prisma.service.ts    # Prisma client wrapper
│   │
│   ├── cloudinary/              # File upload module
│   ├── cache/                   # Redis cache module
│   │
│   ├── common/                  # Shared code
│   │   ├── decorators/          # Custom decorators (@User, etc.)
│   │   ├── guards/              # Shared guards (RoleGuard)
│   │   ├── interceptors/        # Response transformation
│   │   └── pipes/               # Custom validation
│   │
│   ├── app.module.ts            # Root module
│   └── main.ts                  # Application entry point
│
└── prisma/
    ├── schema.prisma            # Database schema definition
    ├── migrations/              # Database migrations
    └── seed.ts                  # Seed data script
```

### Frontend Structure

```
frontend/
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── (auth)/             # Auth group (login, register)
│   │   │   └── login/          # Login page
│   │   │
│   │   ├── dashboard/          # Main dashboard
│   │   │   ├── page.tsx        # Member dashboard
│   │   │   ├── clubs/          # Club pages
│   │   │   ├── quizzes/        # Quiz pages
│   │   │   ├── leaderboard/    # Leaderboard page
│   │   │   ├── profile/        # User profile
│   │   │   └── manage/         # Coordinator panel
│   │   │
│   │   ├── layout.tsx          # Root layout (navbar, providers)
│   │   └── page.tsx            # Landing page
│   │
│   ├── components/             # React components
│   │   ├── ui/                 # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Input.tsx
│   │   │
│   │   ├── Navbar.tsx          # Navigation bar
│   │   ├── Sidebar.tsx         # Dashboard sidebar
│   │   ├── ThemeToggle.tsx     # Light/dark mode toggle
│   │   └── [other components]
│   │
│   ├── context/                # State management (Zustand)
│   │   ├── authStore.ts        # Auth state (user, token)
│   │   ├── themeStore.ts       # Theme state
│   │   └── clubStore.ts        # Club state
│   │
│   ├── lib/                    # Utilities & helpers
│   │   ├── api.ts              # API client wrapper
│   │   ├── utils.ts            # Helper functions
│   │   └── constants.ts        # App constants
│   │
│   └── styles/
│       └── globals.css         # Global styles & theme variables
│
└── public/                     # Static assets
    ├── images/
    └── icons/
```

## 🗄️ Database Schema Overview

### Core Entities

```
User
├── Basic Info (id, email, name, avatar)
├── Authentication (googleId, password)
├── Profile (department, year, phone)
├── Role & Status (role, approvalStatus)
└── Relationships
    ├── memberOfClubs (many ClubMember)
    ├── coordinatedClubs (many ClubCoordinator)
    ├── quizAttempts (many QuizAttempt)
    └── comments (many Comment)

Club
├── Basic Info (id, name, description, logo)
├── Relationships
    ├── creator (User)
    ├── members (many ClubMember)
    ├── coordinators (many ClubCoordinator)
    ├── activities (many Activity)
    └── quizzes (many Quiz)

Quiz
├── Basic Info (title, description, duration)
├── Questions (many QuizQuestion)
├── Attempts (many QuizAttempt)
└── Leaderboard (QuizLeaderboard)

Activity
├── Basic Info (title, description, date)
├── Club (belongs to one Club)
└── Photos (many EventPhoto)
```

### Relationships

- User ↔ Club (many-to-many through ClubMember)
- User ↔ Quiz (many-to-many through QuizAttempt)
- Club ↔ Activity (one-to-many)
- Quiz ↔ Question (one-to-many)
- User ↔ Comment (one-to-many)

## 🔐 Security Architecture

### Authentication & Authorization

1. **Google OAuth 2.0**
   - Users sign in with institutional email
   - Backend validates with Google
   - JWT tokens issued for subsequent requests

2. **JWT Tokens**
   - Access token (15 min expiry)
   - Refresh token (7 days expiry)
   - Stored securely in httpOnly cookies

3. **Role-Based Access Control (RBAC)**
   - Member: Read-only access to clubs/quizzes
   - Coordinator: Manage own clubs
   - Faculty: Approve requests, view analytics
   - Admin: Full system access

### Security Features

- **Helmet.js**: HTTP headers security
- **Rate Limiting**: Prevent abuse (100 req/min)
- **Input Validation**: class-validator on all inputs
- **SQL Injection**: Prevented by Prisma ORM
- **XSS Protection**: React auto-escapes content
- **CORS**: Configured for frontend origin only

## 🚀 Performance Optimizations

### Frontend

- **Server-Side Rendering (SSR)**: Fast initial page load
- **Code Splitting**: Lazy load routes
- **Image Optimization**: Next.js Image component
- **Static Generation**: Pre-render when possible

### Backend

- **Redis Caching**: Session data, frequently accessed data
- **Database Indexing**: Indexed columns for fast queries
- **Connection Pooling**: Prisma connection pool
- **Compression**: Gzip response compression

### Database

- **Indexes**: Created on foreign keys and search columns
- **Pagination**: Limit query results
- **Selective Loading**: Only fetch needed columns
- **Batch Operations**: Bulk inserts/updates

## 🔄 Development Workflow

### Local Development

1. Developer runs `docker-compose up -d` (databases)
2. Backend runs on port 5000 with hot reload
3. Frontend runs on port 3000 with hot reload
4. Changes trigger automatic recompilation
5. Prisma Studio available for DB inspection

### Code Changes

1. Create feature branch
2. Make changes following guidelines
3. Test locally
4. Run linting: `npm run lint`
5. Commit with conventional commits
6. Push and create PR

### Database Changes

1. Modify `prisma/schema.prisma`
2. Run `npm run prisma:generate`
3. Run `npm run prisma:migrate`
4. Test migrations locally
5. Commit schema + migration files

## 📊 Monitoring & Debugging

### Available Tools

- **Prisma Studio**: Visual database browser
- **Adminer**: Web-based DB admin
- **Docker Logs**: `docker-compose logs -f`
- **VS Code Debugger**: Attach to NestJS
- **React DevTools**: Component inspection
- **Network Tab**: API request monitoring

### Logging

- Backend: NestJS built-in logger
- Frontend: Console logging (remove in production)
- Database: Prisma query logging (dev only)

## 🔮 Future Enhancements

### Planned Features

- [ ] Real-time notifications (WebSocket)
- [ ] Email notifications
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] CI/CD pipeline
- [ ] Automated testing suite
- [ ] Performance monitoring (APM)
- [ ] Error tracking (Sentry)

### Scalability Considerations

- Horizontal scaling with load balancer
- Database read replicas
- CDN for static assets
- Microservices architecture (future)
- Message queue for async tasks

## 📚 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Next.js Documentation](https://nextjs.org/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

This document provides a high-level overview of the Gatherly architecture. For specific implementation details, refer to the code and inline documentation.
