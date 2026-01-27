#!/bin/bash

# Gatherly - Automated Setup Script for macOS/Linux
# This script automates the setup process for the Gatherly project

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}================================================${NC}"
echo -e "${CYAN}   Gatherly - Automated Setup Script${NC}"
echo -e "${CYAN}================================================${NC}"
echo ""

# Check if Node.js is installed
echo -e "${YELLOW}Checking prerequisites...${NC}"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓ Node.js $NODE_VERSION is installed${NC}"
else
    echo -e "${RED}✗ Node.js is not installed!${NC}"
    echo -e "${RED}  Please install Node.js from https://nodejs.org/${NC}"
    exit 1
fi

# Check if npm is installed
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✓ npm $NPM_VERSION is installed${NC}"
else
    echo -e "${RED}✗ npm is not installed!${NC}"
    exit 1
fi

# Check if Docker is installed
if command -v docker &> /dev/null; then
    echo -e "${GREEN}✓ Docker is installed${NC}"
    USE_DOCKER=true
else
    echo -e "${YELLOW}⚠ Docker is not installed. You'll need to set up PostgreSQL and Redis manually.${NC}"
    USE_DOCKER=false
fi

echo ""
echo -e "${CYAN}================================================${NC}"
echo -e "${CYAN}Step 1: Setting up Backend${NC}"
echo -e "${CYAN}================================================${NC}"
echo ""

# Navigate to backend directory
cd backend || exit 1

# Install backend dependencies
echo -e "${YELLOW}Installing backend dependencies...${NC}"
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Failed to install backend dependencies${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Backend dependencies installed successfully${NC}"

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}Creating backend .env file...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✓ Backend .env file created from .env.example${NC}"
    echo -e "${YELLOW}⚠ Please update the .env file with your credentials!${NC}"
else
    echo -e "${GREEN}✓ Backend .env file already exists${NC}"
fi

echo ""
echo -e "${CYAN}================================================${NC}"
echo -e "${CYAN}Step 2: Setting up Frontend${NC}"
echo -e "${CYAN}================================================${NC}"
echo ""

# Navigate to frontend directory
cd ../frontend || exit 1

# Install frontend dependencies
echo -e "${YELLOW}Installing frontend dependencies...${NC}"
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Failed to install frontend dependencies${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Frontend dependencies installed successfully${NC}"

# Create .env.local file if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}Creating frontend .env.local file...${NC}"
    cp .env.example .env.local
    echo -e "${GREEN}✓ Frontend .env.local file created from .env.example${NC}"
    echo -e "${YELLOW}⚠ Please update the .env.local file with your credentials!${NC}"
else
    echo -e "${GREEN}✓ Frontend .env.local file already exists${NC}"
fi

# Navigate back to root
cd .. || exit 1

echo ""
echo -e "${CYAN}================================================${NC}"
echo -e "${CYAN}Step 3: Setting up Database${NC}"
echo -e "${CYAN}================================================${NC}"
echo ""

if [ "$USE_DOCKER" = true ]; then
    echo -e "${YELLOW}Starting Docker containers (PostgreSQL + Redis)...${NC}"
    docker-compose up -d
    if [ $? -ne 0 ]; then
        echo -e "${RED}✗ Failed to start Docker containers${NC}"
        echo -e "${RED}  Please ensure Docker is running${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Docker containers started successfully${NC}"
    
    # Wait for PostgreSQL to be ready
    echo -e "${YELLOW}Waiting for PostgreSQL to be ready...${NC}"
    sleep 5
else
    echo -e "${YELLOW}⚠ Docker not available. Please ensure PostgreSQL and Redis are running manually.${NC}"
    echo -e "${YELLOW}  PostgreSQL should be on port 5432${NC}"
    echo -e "${YELLOW}  Redis should be on port 6379${NC}"
    echo ""
    read -p "Are your databases running? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}Please start your databases and run this script again.${NC}"
        exit 0
    fi
fi

echo ""
echo -e "${CYAN}================================================${NC}"
echo -e "${CYAN}Step 4: Running Database Migrations${NC}"
echo -e "${CYAN}================================================${NC}"
echo ""

cd backend || exit 1

# Generate Prisma client
echo -e "${YELLOW}Generating Prisma client...${NC}"
npm run prisma:generate
if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Failed to generate Prisma client${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Prisma client generated successfully${NC}"

# Run migrations
echo -e "${YELLOW}Running database migrations...${NC}"
npm run prisma:migrate
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}⚠ Database migrations may have failed. This is normal for first-time setup.${NC}"
    echo -e "${YELLOW}  You can run 'npm run prisma:migrate' manually later.${NC}"
else
    echo -e "${GREEN}✓ Database migrations completed successfully${NC}"
fi

# Seed database
echo -e "${YELLOW}Seeding database with initial data...${NC}"
npm run prisma:seed
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}⚠ Database seeding may have failed. You can run 'npm run prisma:seed' manually later.${NC}"
else
    echo -e "${GREEN}✓ Database seeded successfully${NC}"
fi

cd .. || exit 1

echo ""
echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}   Setup Complete! 🎉${NC}"
echo -e "${GREEN}================================================${NC}"
echo ""
echo -e "${CYAN}Next steps:${NC}"
echo -e "${NC}1. Update backend/.env with your credentials:${NC}"
echo -e "${NC}   - Google OAuth credentials${NC}"
echo -e "${NC}   - Cloudinary credentials (for file uploads)${NC}"
echo -e "${NC}   - JWT secrets (for production)${NC}"
echo ""
echo -e "${NC}2. Update frontend/.env.local with:${NC}"
echo -e "${NC}   - Google OAuth Client ID${NC}"
echo ""
echo -e "${NC}3. Start the development servers:${NC}"
echo -e "${YELLOW}   Terminal 1: cd backend && npm run dev${NC}"
echo -e "${YELLOW}   Terminal 2: cd frontend && npm run dev${NC}"
echo ""
echo -e "${NC}4. Access the application:${NC}"
echo -e "${YELLOW}   Frontend:  http://localhost:3000${NC}"
echo -e "${YELLOW}   Backend:   http://localhost:5000${NC}"
if [ "$USE_DOCKER" = true ]; then
    echo -e "${YELLOW}   Adminer:   http://localhost:8080${NC}"
fi
echo ""
echo -e "${CYAN}For detailed documentation, see SETUP.md${NC}"
echo ""
echo -e "${GREEN}Happy coding! 🚀${NC}"
echo ""
