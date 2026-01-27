# Contributing to Gatherly

Thank you for your interest in contributing to Gatherly! This document provides guidelines and instructions for contributing to the project.

## 📋 Table of Contents

1. [Getting Started](#getting-started)
2. [Development Workflow](#development-workflow)
3. [Code Standards](#code-standards)
4. [Git Workflow](#git-workflow)
5. [Testing Guidelines](#testing-guidelines)
6. [Pull Request Process](#pull-request-process)
7. [Project Structure](#project-structure)

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you've completed the setup process:

1. Follow the [SETUP.md](./SETUP.md) guide to set up your local environment
2. Ensure all tests pass: `npm test` (when implemented)
3. Ensure the application runs without errors

### First-Time Setup

```bash
# 1. Fork the repository on GitHub
# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/Gatherly.git
cd Gatherly

# 3. Add upstream remote
git remote add upstream https://github.com/ORIGINAL_OWNER/Gatherly.git

# 4. Run the setup script
./setup.sh  # or setup.ps1 on Windows

# 5. Create a new branch for your work
git checkout -b feature/your-feature-name
```

---

## 💻 Development Workflow

### Running the Development Environment

You'll need **3 terminals** running simultaneously:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Backend runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:3000
```

**Terminal 3 - Database (if using Docker):**
```bash
docker-compose up
# Or run in detached mode: docker-compose up -d
```

### Hot Reloading

- **Frontend**: Next.js hot reloads automatically on file changes
- **Backend**: NestJS watches for changes and restarts automatically
- **Database**: Use Prisma Studio to view/edit data: `npm run prisma:studio`

---

## 📝 Code Standards

### TypeScript

- Use TypeScript for all new code
- Enable strict mode
- Use interfaces for object types
- Use enums for fixed sets of values
- Avoid `any` type; use `unknown` if type is truly unknown

**Example:**
```typescript
// Good
interface User {
  id: number;
  email: string;
  role: UserRole;
}

// Avoid
const user: any = { ... };
```

### Naming Conventions

- **Files**: Use kebab-case: `user-service.ts`, `club-controller.ts`
- **Classes**: Use PascalCase: `UserService`, `ClubController`
- **Functions**: Use camelCase: `getUserById()`, `createClub()`
- **Constants**: Use UPPER_SNAKE_CASE: `MAX_FILE_SIZE`, `DEFAULT_ROLE`
- **Interfaces**: Use PascalCase with no prefix: `User`, `Club` (not `IUser`)

### Code Formatting

We use Prettier for consistent code formatting:

```bash
# Format all files
cd backend && npm run format
cd frontend && npm run lint

# Auto-fix linting issues
npm run lint -- --fix
```

### Comments

- Write clear, concise comments
- Use JSDoc for functions and classes
- Explain **why**, not **what** (code should be self-explanatory)

**Example:**
```typescript
/**
 * Calculates user's quiz score based on time taken and correct answers
 * Uses exponential decay for time bonus to reward quick responses
 */
function calculateQuizScore(correctAnswers: number, timeTaken: number): number {
  // Implementation
}
```

---

## 🌿 Git Workflow

### Branch Naming

Use descriptive branch names with prefixes:

- `feature/` - New features: `feature/quiz-timer`
- `fix/` - Bug fixes: `fix/login-redirect`
- `refactor/` - Code refactoring: `refactor/user-service`
- `docs/` - Documentation: `docs/api-endpoints`
- `test/` - Adding tests: `test/quiz-service`

### Commit Messages

Follow the Conventional Commits specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```bash
git commit -m "feat(quiz): add timer functionality to quiz questions"
git commit -m "fix(auth): resolve Google OAuth redirect issue"
git commit -m "docs(readme): update installation instructions"
```

### Keeping Your Fork Updated

```bash
# Fetch upstream changes
git fetch upstream

# Merge upstream changes into your main branch
git checkout main
git merge upstream/main

# Push to your fork
git push origin main
```

---

## 🧪 Testing Guidelines

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# Run specific test file
npm test -- user.service.spec.ts

# Watch mode
npm test -- --watch

# Coverage report
npm test -- --coverage
```

### Writing Tests

- Write tests for all new features
- Maintain at least 70% code coverage
- Use descriptive test names
- Follow AAA pattern: Arrange, Act, Assert

**Example:**
```typescript
describe('UserService', () => {
  describe('createUser', () => {
    it('should create a new user with valid data', async () => {
      // Arrange
      const userData = { email: 'test@example.com', name: 'Test User' };
      
      // Act
      const user = await userService.createUser(userData);
      
      // Assert
      expect(user).toBeDefined();
      expect(user.email).toBe(userData.email);
    });
  });
});
```

---

## 🔄 Pull Request Process

### Before Submitting

1. **Update your branch** with the latest main:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run all checks**:
   ```bash
   npm run lint        # Check code style
   npm test           # Run tests
   npm run build      # Ensure build succeeds
   ```

3. **Test your changes**:
   - Test manually in the browser
   - Test edge cases
   - Test on different browsers (if frontend changes)

### Creating a Pull Request

1. **Push your branch** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Open a PR** on GitHub with:
   - Clear title describing the change
   - Description of what changed and why
   - Screenshots/videos for UI changes
   - Reference related issues: "Closes #123"

3. **PR Template**:
   ```markdown
   ## Description
   Brief description of changes
   
   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update
   
   ## Testing
   - [ ] Tests added/updated
   - [ ] Manual testing completed
   
   ## Screenshots (if applicable)
   
   ## Related Issues
   Closes #123
   ```

### Review Process

- Address reviewer feedback promptly
- Update your PR with requested changes
- Keep discussions professional and constructive
- Once approved, a maintainer will merge your PR

---

## 📁 Project Structure

### Backend Structure

```
backend/
├── src/
│   ├── modules/              # Feature modules
│   │   ├── auth/            # Authentication
│   │   ├── users/           # User management
│   │   ├── clubs/           # Club management
│   │   ├── quizzes/         # Quiz system
│   │   └── ...
│   ├── common/              # Shared code
│   │   ├── decorators/      # Custom decorators
│   │   ├── guards/          # Auth guards
│   │   ├── interceptors/    # Interceptors
│   │   └── pipes/           # Validation pipes
│   ├── prisma/              # Database
│   │   └── prisma.service.ts
│   └── main.ts              # Entry point
├── prisma/
│   ├── schema.prisma        # Database schema
│   ├── migrations/          # Database migrations
│   └── seed.ts              # Seed data
└── test/                    # Tests
```

### Frontend Structure

```
frontend/
├── src/
│   ├── app/                 # Next.js pages
│   │   ├── (auth)/         # Auth pages
│   │   ├── dashboard/      # Dashboard
│   │   ├── clubs/          # Club pages
│   │   └── ...
│   ├── components/          # React components
│   │   ├── ui/             # Reusable UI components
│   │   ├── forms/          # Form components
│   │   └── ...
│   ├── context/            # Zustand stores
│   │   ├── authStore.ts
│   │   ├── themeStore.ts
│   │   └── ...
│   ├── lib/                # Utilities
│   │   ├── api.ts          # API client
│   │   ├── utils.ts        # Helper functions
│   │   └── ...
│   └── styles/             # Global styles
└── public/                 # Static assets
```

---

## 🐛 Reporting Bugs

### Before Reporting

1. Check if the bug has already been reported
2. Try to reproduce the bug in a clean environment
3. Gather relevant information (browser, OS, steps to reproduce)

### Bug Report Template

```markdown
**Description:**
Clear description of the bug

**Steps to Reproduce:**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior:**
What should happen

**Actual Behavior:**
What actually happens

**Screenshots:**
If applicable

**Environment:**
- OS: [e.g., Windows 11]
- Browser: [e.g., Chrome 120]
- Node.js: [e.g., v18.17.0]
```

---

## 💡 Suggesting Features

We welcome feature suggestions! Please:

1. Check if the feature has been suggested before
2. Clearly describe the feature and its use case
3. Explain why it would be valuable
4. Provide examples or mockups if possible

---

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs/)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

## 🤝 Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Accept feedback gracefully
- Focus on what's best for the project and community

---

## 📞 Getting Help

- **Questions?** Open a GitHub Discussion
- **Bugs?** Open a GitHub Issue
- **Security?** Email security@gatherly.com (if applicable)

---

Thank you for contributing to Gatherly! 🎉
