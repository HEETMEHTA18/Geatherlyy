# New Team Member Onboarding Checklist

Welcome to the Gatherly team! This checklist will guide you through the onboarding process.

## 📋 Before You Start

- [ ] Receive repository access from team lead
- [ ] Join team communication channels (Slack, Discord, etc.)
- [ ] Get Google OAuth credentials from project admin
- [ ] Get Cloudinary credentials from project admin (or create your own)

## 🔧 Environment Setup

### Step 1: Install Prerequisites

- [ ] Install [Node.js](https://nodejs.org/) (v18 or higher)
- [ ] Install [Git](https://git-scm.com/)
- [ ] Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) (recommended)
- [ ] Install [VS Code](https://code.visualstudio.com/) (or your preferred IDE)

### Step 2: Clone and Setup

- [ ] Fork the repository (if contributing as external developer)
- [ ] Clone the repository to your local machine
  ```bash
  git clone <repository-url>
  cd Gatherly
  ```
- [ ] Run the automated setup script
  - Windows: `.\setup.ps1`
  - macOS/Linux: `./setup.sh`

### Step 3: Configure Environment

- [ ] Update `backend/.env` with your credentials
  - Database URL (use Docker defaults or your local setup)
  - JWT secrets
  - Google OAuth credentials
  - Cloudinary credentials
  - Redis configuration
  
- [ ] Update `frontend/.env.local` with your credentials
  - Google OAuth Client ID
  - API URL (usually http://localhost:5000)

### Step 4: Verify Installation

- [ ] Start Docker containers: `docker-compose up -d`
- [ ] Start backend: `cd backend && npm run dev`
- [ ] Start frontend: `cd frontend && npm run dev`
- [ ] Open http://localhost:3000 in browser
- [ ] Verify you can see the login page
- [ ] Open Prisma Studio: `cd backend && npm run prisma:studio`
- [ ] Open Adminer: http://localhost:8080

## 📚 Read Documentation

- [ ] Read [README.md](./README.md) for project overview
- [ ] Read [SETUP.md](./SETUP.md) for detailed setup instructions
- [ ] Read [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines
- [ ] Bookmark [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) for daily use
- [ ] Review [QUIZ_LEADERBOARD_SYSTEM.md](./QUIZ_LEADERBOARD_SYSTEM.md) for feature docs

## 💻 IDE Setup

- [ ] Install recommended VS Code extensions (prompted automatically)
  - ESLint
  - Prettier
  - Prisma
  - Tailwind CSS IntelliSense
  - Docker
  - GitLens
  
- [ ] Verify auto-formatting works on save
- [ ] Set up debugging configuration (optional)

## 🎓 Learn the Codebase

### Backend

- [ ] Explore `backend/src` directory structure
- [ ] Review Prisma schema: `backend/prisma/schema.prisma`
- [ ] Understand authentication flow in `backend/src/auth`
- [ ] Review API modules: users, clubs, quizzes, etc.

### Frontend

- [ ] Explore `frontend/src/app` directory (Next.js App Router)
- [ ] Review component structure in `frontend/src/components`
- [ ] Understand state management in `frontend/src/context`
- [ ] Review theming in `frontend/src/styles/globals.css`

## 🧪 Test Your Setup

- [ ] Create a test user via Google OAuth
- [ ] Complete profile setup
- [ ] Browse clubs
- [ ] Create a test club (if coordinator role)
- [ ] Take a quiz
- [ ] View leaderboard
- [ ] Test dark mode toggle

## 🌿 Git Workflow

- [ ] Set up Git user configuration
  ```bash
  git config user.name "Your Name"
  git config user.email "your.email@example.com"
  ```
  
- [ ] Add upstream remote (if forked)
  ```bash
  git remote add upstream <original-repo-url>
  ```
  
- [ ] Create your first branch
  ```bash
  git checkout -b feature/your-first-feature
  ```
  
- [ ] Make a test commit
  ```bash
  git commit -m "docs: update onboarding checklist"
  ```

## 🔐 Security Setup

- [ ] Never commit `.env` files
- [ ] Use strong JWT secrets in `.env`
- [ ] Keep OAuth credentials confidential
- [ ] Review `.gitignore` to understand what's excluded

## 🤝 Team Communication

- [ ] Introduce yourself to the team
- [ ] Join daily standups / team meetings
- [ ] Set up notifications for GitHub/repository
- [ ] Ask questions! No question is too small

## 📝 First Contribution

- [ ] Pick a "good first issue" from GitHub Issues
- [ ] Assign the issue to yourself
- [ ] Create a feature branch
- [ ] Make your changes following [CONTRIBUTING.md](./CONTRIBUTING.md)
- [ ] Test your changes thoroughly
- [ ] Create a Pull Request
- [ ] Respond to code review feedback

## ✅ Final Checklist

- [ ] Development environment is fully functional
- [ ] Can start all services without errors
- [ ] Familiar with project structure
- [ ] Know where to find documentation
- [ ] Understand Git workflow
- [ ] Ready to pick up first task!

## 🆘 Having Issues?

If you're stuck:

1. Check [SETUP.md](./SETUP.md#troubleshooting) troubleshooting section
2. Search existing GitHub issues
3. Ask in team chat
4. Create a GitHub issue with details
5. Reach out to your mentor/team lead

## 🎉 Welcome Aboard!

Congratulations on completing the onboarding! You're now ready to contribute to Gatherly.

**Pro Tips:**
- Keep [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) handy
- Use Prisma Studio for quick database inspection
- Test in both light and dark themes
- Write meaningful commit messages
- Ask for code reviews often

**Next Steps:**
- Attend the next team meeting
- Review the current sprint goals
- Pick your first task
- Start coding! 🚀

---

**Onboarded by:** _________________  
**Date:** _________________  
**Questions/Notes:** _________________
