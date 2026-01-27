# Gatherly Frontend

Modern Next.js 14 frontend for the Gatherly club management platform.

## Tech Stack

- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS with custom theming
- **State Management:** Zustand
- **Theme:** next-themes for light/dark mode

## Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── login/             # Authentication
│   │   ├── complete-profile/  # Profile completion
│   │   ├── member/            # Member dashboard
│   │   ├── coordinator/       # Coordinator dashboard
│   │   ├── faculty/           # Faculty dashboard
│   │   ├── admin/             # Admin dashboard
│   │   └── clubs/             # Club pages
│   ├── components/            # Reusable React components
│   ├── context/               # Zustand stores
│   └── styles/                # Global styles
├── public/                    # Static assets
└── package.json
```

## Getting Started

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   ```

3. **Open in browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Features

- 🔐 Google OAuth authentication (mock implementation)
- 👤 Role-based dashboards (Member, Coordinator, Faculty, Admin)
- 🎯 Club management and discovery
- 📊 Interactive quiz system with timers
- 🏆 Leaderboards with filtering
- 💬 Anonymous feedback system
- 📚 Resource management
- 🌓 Light/dark theme toggle

## Environment Variables

Create `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Pages

| Path | Role | Description |
|------|------|-------------|
| `/login` | Public | Authentication with Google OAuth |
| `/complete-profile` | All | Profile completion after first login |
| `/member` | Member | Member dashboard with clubs and quizzes |
| `/coordinator` | Coordinator | Manage clubs, activities, quizzes |
| `/faculty` | Faculty | Approve clubs and view reports |
| `/admin` | Admin | User management and system settings |

## Connecting to Backend

The frontend expects the backend API to be running on `http://localhost:5000`. Update `NEXT_PUBLIC_API_URL` if your backend runs on a different port.

## Deployment

This frontend can be deployed to:
- Vercel (recommended for Next.js)
- Netlify
- Any Node.js hosting platform

See main README.md for deployment instructions.
