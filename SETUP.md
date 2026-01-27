# 🚀 Gatherly - Complete Setup Guide

Welcome to Gatherly! This guide will help you set up the project on your local machine in under 10 minutes.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Setup (Automated)](#quick-setup-automated)
3. [Manual Setup](#manual-setup)
4. [Docker Setup](#docker-setup)
5. [Troubleshooting](#troubleshooting)
6. [Next Steps](#next-steps)

---

## Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** (comes with Node.js)
- **Git** - [Download](https://git-scm.com/)

### Database Options (Choose ONE)

**Option 1: Docker (Recommended for beginners)**
- **Docker Desktop** - [Download](https://www.docker.com/products/docker-desktop/)

**Option 2: Local Installation**
- **PostgreSQL** (v14+) - [Download](https://www.postgresql.org/download/)
- **Redis** (v7+) - [Download](https://redis.io/download/)

### Verify Installation

Run these commands to verify your installations:

```bash
node --version    # Should show v18+
npm --version     # Should show 8+
git --version     # Should show 2+
docker --version  # (If using Docker) Should show 20+
```

---

## 🎯 Quick Setup (Automated)

The fastest way to get started:

### Windows

```powershell
# 1. Clone the repository
git clone <your-repository-url>
cd Gatherly

# 2. Run the setup script
.\setup.ps1
```

### macOS / Linux

```bash
# 1. Clone the repository
git clone <your-repository-url>
cd Gatherly

# 2. Make the script executable and run it
chmod +x setup.sh
./setup.sh
```

The script will:
- ✅ Install all dependencies (frontend + backend)
- ✅ Set up environment files
- ✅ Start Docker containers (PostgreSQL + Redis)
- ✅ Run database migrations
- ✅ Seed initial data
- ✅ Verify the setup

---

## 🔧 Manual Setup

If you prefer to set up manually or the automated script doesn't work:

### Step 1: Clone the Repository

```bash
git clone <your-repository-url>
cd Gatherly
```

### Step 2: Set Up Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file with your configuration
# Use your preferred text editor (notepad, vim, vscode, etc.)
```

**Configure Backend `.env` file:**

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# PostgreSQL Database (Update if not using Docker)
DATABASE_URL="postgresql://gatherly_user:gatherly_password@localhost:5433/gatherly?schema=public"

# Redis Cache (Update if not using Docker)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# JWT Authentication (Generate secure keys for production!)
JWT_SECRET=your_dev_jwt_secret_change_in_production
JWT_REFRESH_SECRET=your_dev_refresh_secret_change_in_production
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Google OAuth (Get from Google Cloud Console)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Cloudinary (Get from Cloudinary Dashboard)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Rate Limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=100

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

### Step 3: Set Up Frontend

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Edit .env.local file with your configuration
```

**Configure Frontend `.env.local` file:**

```env
# Google OAuth (Same client ID as backend)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000

# Feature Flags (Optional)
ENABLE_ANONYMOUS_COMMENTS=true
ENABLE_QUIZ_IMAGES=true
```

### Step 4: Start Services

#### Option A: Using Docker (Recommended)

```bash
# From project root
docker-compose up -d

# This will start:
# - PostgreSQL on port 5433
# - Redis on port 6379
# - Adminer (DB UI) on port 8080
```

#### Option B: Using Local Installations

**Start PostgreSQL:**
```bash
# Windows (if installed as service)
# Should start automatically

# macOS
brew services start postgresql@14

# Linux
sudo systemctl start postgresql
```

**Start Redis:**
```bash
# Windows
# Download from https://github.com/microsoftarchive/redis/releases
# Run redis-server.exe

# macOS
brew services start redis

# Linux
sudo systemctl start redis
```

**Create Database:**
```bash
# Using psql
psql -U postgres
CREATE DATABASE gatherly;
CREATE USER gatherly_user WITH PASSWORD 'gatherly_password';
GRANT ALL PRIVILEGES ON DATABASE gatherly TO gatherly_user;
\q
```

### Step 5: Initialize Database

```bash
# From backend directory
cd backend

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database with initial data
npm run prisma:seed
```

### Step 6: Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev

# Backend will run on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev

# Frontend will run on http://localhost:3000
```

### Step 7: Verify Installation

Open your browser and navigate to:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Adminer (DB UI)**: http://localhost:8080 (if using Docker)

---

## 🐳 Docker Setup

For the most consistent development environment:

### Full Stack with Docker

```bash
# Start all services (PostgreSQL + Redis + Adminer)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove volumes (clean slate)
docker-compose down -v
```

### Access Docker Services

- **PostgreSQL**: `localhost:5433`
  - Username: `gatherly_user`
  - Password: `gatherly_password`
  - Database: `gatherly`

- **Redis**: `localhost:6379`

- **Adminer**: http://localhost:8080
  - System: `PostgreSQL`
  - Server: `postgres`
  - Username: `gatherly_user`
  - Password: `gatherly_password`
  - Database: `gatherly`

---

## 🔍 Troubleshooting

### Port Already in Use

**Error**: `Port 5000 is already in use`

**Solution**:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

### Database Connection Failed

**Error**: `Can't reach database server`

**Solutions**:
1. Ensure PostgreSQL is running: `docker-compose ps` or check service status
2. Verify DATABASE_URL in `.env` matches your setup
3. Check if port 5433 (Docker) or 5432 (local) is accessible
4. Try restarting Docker: `docker-compose restart postgres`

### Redis Connection Failed

**Solutions**:
1. Check if Redis is running: `docker-compose ps` or `redis-cli ping`
2. Verify REDIS_HOST and REDIS_PORT in `.env`
3. Try restarting Redis: `docker-compose restart redis`

### Prisma Migration Errors

```bash
# Reset database (⚠️ This will delete all data!)
npm run prisma:migrate reset

# If that fails, manually drop and recreate
docker-compose down -v
docker-compose up -d
npm run prisma:migrate
npm run prisma:seed
```

### Module Not Found Errors

```bash
# Clear node_modules and reinstall
cd backend
rm -rf node_modules package-lock.json
npm install

cd ../frontend
rm -rf node_modules package-lock.json
npm install
```

### Google OAuth Not Working

1. Ensure you have created OAuth credentials in [Google Cloud Console](https://console.cloud.google.com/)
2. Add authorized redirect URIs:
   - `http://localhost:5000/api/auth/google/callback`
   - `http://localhost:3000`
3. Verify GOOGLE_CLIENT_ID matches in both backend `.env` and frontend `.env.local`

### Docker Permission Errors (Linux)

```bash
# Add your user to docker group
sudo usermod -aG docker $USER

# Log out and log back in, or run:
newgrp docker
```

---

## 🎓 Next Steps

After successful setup:

1. **Read the Documentation**
   - [README.md](./README.md) - Project overview and features
   - [CONTRIBUTING.md](./CONTRIBUTING.md) - Development workflow and guidelines

2. **Explore the Application**
   - Create a test account with Google OAuth
   - Browse clubs, create quizzes, and test features

3. **Database Management**
   - Use Prisma Studio: `cd backend && npm run prisma:studio`
   - Or Adminer at http://localhost:8080

4. **API Documentation**
   - View Swagger docs at http://localhost:5000/api/docs (when implemented)

5. **Development Tools**
   - Install recommended VS Code extensions (see `.vscode/extensions.json`)
   - Run linting: `npm run lint`
   - Run tests: `npm test` (when implemented)

---

## 🔑 Getting Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth Client ID**
5. Configure OAuth consent screen
6. Create OAuth 2.0 Client ID:
   - Application type: **Web application**
   - Authorized redirect URIs: `http://localhost:5000/api/auth/google/callback`
7. Copy **Client ID** and **Client Secret**

## 🎨 Getting Cloudinary Credentials

1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Go to Dashboard
3. Copy:
   - Cloud Name
   - API Key
   - API Secret

---

## 🆘 Need Help?

- **Issues?** Open a GitHub issue with details
- **Questions?** Ask in team chat or documentation
- **Contributions?** See [CONTRIBUTING.md](./CONTRIBUTING.md)

---

## 📝 Quick Reference

### Essential Commands

```bash
# Start everything (Docker)
docker-compose up -d
cd backend && npm run dev     # Terminal 1
cd frontend && npm run dev    # Terminal 2

# Database operations
npm run prisma:migrate        # Run migrations
npm run prisma:studio         # Open DB GUI
npm run prisma:seed           # Seed data

# Maintenance
npm run lint                  # Check code style
npm run format                # Format code
docker-compose down -v        # Clean reset
```

### Default Ports

- Frontend: **3000**
- Backend: **5000**
- PostgreSQL: **5433** (Docker) or **5432** (Local)
- Redis: **6379**
- Adminer: **8080**

---

**Happy Coding! 🎉**
