# Gatherly - Quick Reference Cheat Sheet

Quick reference guide for common tasks and commands.

## 🚀 Getting Started

```bash
# First time setup
git clone <repo-url>
cd Gatherly
./setup.sh           # or setup.ps1 on Windows

# Start development
cd backend && npm run dev    # Terminal 1
cd frontend && npm run dev   # Terminal 2
```

## 📝 Common Commands

### Development Servers

```bash
# Backend
cd backend
npm run dev              # Start with hot reload
npm run start:debug      # Start with debugging

# Frontend  
cd frontend
npm run dev              # Start with hot reload
npm run build            # Production build
npm run start            # Start production server
```

### Database Operations

```bash
cd backend

# Migrations
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run migrations
npm run prisma:studio    # Open database GUI

# Data Management
npm run prisma:seed      # Seed test data
npx prisma migrate reset # Reset database (⚠️ deletes data)
```

### Docker

```bash
# Start services
docker-compose up -d              # Start in background
docker-compose up                 # Start with logs

# Stop services
docker-compose down               # Stop containers
docker-compose down -v            # Stop and remove volumes

# Maintenance
docker-compose restart postgres   # Restart PostgreSQL
docker-compose logs -f            # Follow logs
docker-compose ps                 # List running containers
```

## 🔌 Default Ports

| Service       | Port | URL                          |
|---------------|------|------------------------------|
| Frontend      | 3000 | http://localhost:3000        |
| Backend       | 5000 | http://localhost:5000        |
| PostgreSQL    | 5433 | localhost:5433               |
| Redis         | 6379 | localhost:6379               |
| Adminer       | 8080 | http://localhost:8080        |
| Prisma Studio | 5555 | http://localhost:5555        |

## 🗄️ Database Access

### Prisma Studio (Recommended)
```bash
cd backend
npm run prisma:studio
# Opens at http://localhost:5555
```

### Adminer (Web UI)
```
URL: http://localhost:8080
System: PostgreSQL
Server: postgres
Username: gatherly_user
Password: gatherly_password
Database: gatherly
```

### psql (Command Line)
```bash
docker exec -it gatherly_postgres psql -U gatherly_user -d gatherly
```

## 🔧 Environment Setup

### Backend (.env)
```bash
cd backend
cp .env.example .env
# Edit with your credentials
```

Key variables:
- `DATABASE_URL` - PostgreSQL connection
- `JWT_SECRET` - JWT signing key
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET` - OAuth
- `CLOUDINARY_*` - File uploads

### Frontend (.env.local)
```bash
cd frontend
cp .env.example .env.local
# Edit with your credentials
```

Key variables:
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` - OAuth
- `NEXT_PUBLIC_API_URL` - Backend URL

## 🐛 Quick Fixes

### Port Already in Use

**Windows:**
```powershell
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**macOS/Linux:**
```bash
lsof -ti:5000 | xargs kill -9
```

### Database Connection Failed

```bash
# Check if PostgreSQL is running
docker-compose ps

# Restart PostgreSQL
docker-compose restart postgres

# Fresh start
docker-compose down -v
docker-compose up -d
```

### Clear Node Modules

```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Reset Database

```bash
cd backend
npm run prisma:migrate reset
# This will:
# 1. Drop all tables
# 2. Run all migrations
# 3. Seed database
```

## 📦 Git Workflow

### Branch Naming
```bash
feature/quiz-timer      # New feature
fix/login-redirect      # Bug fix
refactor/auth-service   # Code refactoring
docs/setup-guide        # Documentation
```

### Commit Messages
```bash
git commit -m "feat: add quiz timer functionality"
git commit -m "fix: resolve OAuth redirect issue"
git commit -m "docs: update setup instructions"
```

### Daily Workflow
```bash
# Start of day
git checkout main
git pull upstream main
git checkout -b feature/my-feature

# During development
git add .
git commit -m "feat: implement feature"

# End of day / before PR
git fetch upstream
git rebase upstream/main
git push origin feature/my-feature
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run specific test
npm test -- user.service.spec.ts

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage
```

## 🔍 Debugging

### Backend Debugging

```bash
# Start with debugger
npm run start:debug

# VS Code launch.json
{
  "type": "node",
  "request": "attach",
  "name": "Attach NestJS",
  "port": 9229
}
```

### View Logs

```bash
# Docker logs
docker-compose logs -f postgres
docker-compose logs -f redis

# Application logs
cd backend && npm run dev      # Shows backend logs
cd frontend && npm run dev     # Shows frontend logs
```

## 📊 Database Queries

### Common Prisma Queries

```typescript
// Find user by email
await prisma.user.findUnique({ where: { email: 'user@example.com' } });

// Create user
await prisma.user.create({ data: { name: 'John', email: 'john@example.com' } });

// Update user
await prisma.user.update({ where: { id: 1 }, data: { name: 'Jane' } });

// Delete user
await prisma.user.delete({ where: { id: 1 } });

// Count records
await prisma.user.count();
```

## 🔐 Get OAuth Credentials

### Google OAuth
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create project → Enable Google+ API
3. Create OAuth Client ID (Web application)
4. Add redirect URI: `http://localhost:5000/api/auth/google/callback`
5. Copy Client ID and Client Secret

### Cloudinary
1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Go to Dashboard
3. Copy Cloud Name, API Key, and API Secret

## 📖 Useful Links

- [Prisma Docs](https://www.prisma.io/docs/)
- [NestJS Docs](https://docs.nestjs.com/)
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🆘 Getting Help

1. Check [SETUP.md](./SETUP.md) for detailed setup
2. Check [CONTRIBUTING.md](./CONTRIBUTING.md) for development guide
3. Open a GitHub issue
4. Ask in team chat

## 💡 Pro Tips

- Use Prisma Studio for quick database inspection
- Use `docker-compose logs -f` to debug connection issues
- Run `npm run prisma:generate` after schema changes
- Commit `.env.example` files, never `.env` files
- Use feature branches for all changes
- Test both light and dark themes
- Clear browser cache if styles don't update

---

Keep this file handy for quick reference! 🚀
