# Gatherly - Automated Setup Script for Windows
# This script automates the setup process for the Gatherly project

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   Gatherly - Automated Setup Script" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking prerequisites..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js $nodeVersion is installed" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js is not installed!" -ForegroundColor Red
    Write-Host "  Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "✓ npm $npmVersion is installed" -ForegroundColor Green
} catch {
    Write-Host "✗ npm is not installed!" -ForegroundColor Red
    exit 1
}

# Check if Docker is installed
try {
    $dockerVersion = docker --version
    Write-Host "✓ Docker is installed" -ForegroundColor Green
    $useDocker = $true
} catch {
    Write-Host "⚠ Docker is not installed. You'll need to set up PostgreSQL and Redis manually." -ForegroundColor Yellow
    $useDocker = $false
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Step 1: Setting up Backend" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Navigate to backend directory
Set-Location backend

# Install backend dependencies
Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to install backend dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Backend dependencies installed successfully" -ForegroundColor Green

# Create .env file if it doesn't exist
if (-not (Test-Path ".env")) {
    Write-Host "Creating backend .env file..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✓ Backend .env file created from .env.example" -ForegroundColor Green
    Write-Host "⚠ Please update the .env file with your credentials!" -ForegroundColor Yellow
} else {
    Write-Host "✓ Backend .env file already exists" -ForegroundColor Green
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Step 2: Setting up Frontend" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Navigate to frontend directory
Set-Location ../frontend

# Install frontend dependencies
Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to install frontend dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Frontend dependencies installed successfully" -ForegroundColor Green

# Create .env.local file if it doesn't exist
if (-not (Test-Path ".env.local")) {
    Write-Host "Creating frontend .env.local file..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env.local"
    Write-Host "✓ Frontend .env.local file created from .env.example" -ForegroundColor Green
    Write-Host "⚠ Please update the .env.local file with your credentials!" -ForegroundColor Yellow
} else {
    Write-Host "✓ Frontend .env.local file already exists" -ForegroundColor Green
}

# Navigate back to root
Set-Location ..

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Step 3: Setting up Database" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

if ($useDocker) {
    Write-Host "Starting Docker containers (PostgreSQL + Redis)..." -ForegroundColor Yellow
    docker-compose up -d
    if ($LASTEXITCODE -ne 0) {
        Write-Host "✗ Failed to start Docker containers" -ForegroundColor Red
        Write-Host "  Please ensure Docker Desktop is running" -ForegroundColor Red
        exit 1
    }
    Write-Host "✓ Docker containers started successfully" -ForegroundColor Green
    
    # Wait for PostgreSQL to be ready
    Write-Host "Waiting for PostgreSQL to be ready..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5
} else {
    Write-Host "⚠ Docker not available. Please ensure PostgreSQL and Redis are running manually." -ForegroundColor Yellow
    Write-Host "  PostgreSQL should be on port 5432" -ForegroundColor Yellow
    Write-Host "  Redis should be on port 6379" -ForegroundColor Yellow
    Write-Host ""
    $continue = Read-Host "Are your databases running? (y/n)"
    if ($continue -ne "y") {
        Write-Host "Please start your databases and run this script again." -ForegroundColor Yellow
        exit 0
    }
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Step 4: Running Database Migrations" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

Set-Location backend

# Generate Prisma client
Write-Host "Generating Prisma client..." -ForegroundColor Yellow
npm run prisma:generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to generate Prisma client" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Prisma client generated successfully" -ForegroundColor Green

# Run migrations
Write-Host "Running database migrations..." -ForegroundColor Yellow
npm run prisma:migrate
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠ Database migrations may have failed. This is normal for first-time setup." -ForegroundColor Yellow
    Write-Host "  You can run 'npm run prisma:migrate' manually later." -ForegroundColor Yellow
} else {
    Write-Host "✓ Database migrations completed successfully" -ForegroundColor Green
}

# Seed database
Write-Host "Seeding database with initial data..." -ForegroundColor Yellow
npm run prisma:seed
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠ Database seeding may have failed. You can run 'npm run prisma:seed' manually later." -ForegroundColor Yellow
} else {
    Write-Host "✓ Database seeded successfully" -ForegroundColor Green
}

Set-Location ..

Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host "   Setup Complete! 🎉" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Update backend/.env with your credentials:" -ForegroundColor White
Write-Host "   - Google OAuth credentials" -ForegroundColor White
Write-Host "   - Cloudinary credentials (for file uploads)" -ForegroundColor White
Write-Host "   - JWT secrets (for production)" -ForegroundColor White
Write-Host ""
Write-Host "2. Update frontend/.env.local with:" -ForegroundColor White
Write-Host "   - Google OAuth Client ID" -ForegroundColor White
Write-Host ""
Write-Host "3. Start the development servers:" -ForegroundColor White
Write-Host "   Terminal 1: cd backend && npm run dev" -ForegroundColor Yellow
Write-Host "   Terminal 2: cd frontend && npm run dev" -ForegroundColor Yellow
Write-Host ""
Write-Host "4. Access the application:" -ForegroundColor White
Write-Host "   Frontend:  http://localhost:3000" -ForegroundColor Yellow
Write-Host "   Backend:   http://localhost:5000" -ForegroundColor Yellow
if ($useDocker) {
    Write-Host "   Adminer:   http://localhost:8080" -ForegroundColor Yellow
}
Write-Host ""
Write-Host "For detailed documentation, see SETUP.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "Happy coding! 🚀" -ForegroundColor Green
Write-Host ""
