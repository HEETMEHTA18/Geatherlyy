# Quiz & Leaderboard System Implementation

## Overview
A comprehensive quiz and leaderboard system with three-tier ranking, role-based access, and advanced tiebreaker logic.

## Features Implemented

### 1. Quiz Module (Available to All Users)

#### For All Users (Student, Coordinator, Faculty, Admin)
- **Browse Quizzes**: View all active quizzes from any club
  - Location: `/dashboard/quizzes`
  - Shows quiz title, club name, question count, and time limit
  - Only active (published) quizzes are visible

- **Take Quizzes**: Complete quizzes with timer and progress tracking
  - Location: `/dashboard/quizzes/[id]`
  - Features:
    - Timer countdown with auto-submit
    - Progress bar showing completion
    - Question navigation grid
    - Image support for questions
    - Answer selection with visual feedback

- **View Results**: Immediate feedback after quiz completion
  - Score, correct answers, and percentage
  - Quiz-specific leaderboard (top 10)
  - Links to global and club leaderboards

#### For Coordinators Only
- **Create Quizzes**: Full quiz creation interface
  - Location: `/dashboard/manage` → Quizzes tab
  - Add multiple questions with options
  - Set time limits and descriptions
  - Upload images for questions
  - Publish/unpublish quizzes

- **Manage Quizzes**: Control quiz lifecycle
  - Start/stop quizzes (toggle isActive status)
  - Delete quizzes
  - View quiz statistics

---

## 2. Three-Tier Leaderboard System

### Tier 1: Quiz-Specific Leaderboard
**Location**: After completing a quiz (`/dashboard/quizzes/[id]` results page)

**Ranking Logic**:
1. **Primary**: Higher score
2. **Tiebreaker 1**: Faster completion time (timeTaken ASC)
3. **Tiebreaker 2**: Earlier submission (attemptedAt ASC)

**Features**:
- Top 10 participants displayed
- Shows score, percentage, and time taken
- Highlights top 3 with special styling (gold, silver, bronze)
- Auto-fetches after quiz submission

**API Endpoint**: `GET /api/quizzes/:id/leaderboard?limit=10`

---

### Tier 2: Club Leaderboard
**Location**: `/dashboard/leaderboard` → Club Leaderboards tab

**Ranking Logic**:
1. **Primary**: Total score from all quizzes in this club
2. **Tiebreaker 1**: More quizzes completed
3. **Tiebreaker 2**: Higher average percentage
4. **Tiebreaker 3**: Earlier join date

**Features**:
- Only shows members of the selected club
- Aggregates performance across all club quizzes
- Club selector dropdown for multi-club members
- Shows total score, quizzes completed, and average percentage

**API Endpoint**: `GET /api/leaderboards/club/:clubId?limit=30`

**Data Aggregation**:
```sql
- SUM(quiz_score) for quizzes WHERE quiz.clubId = selected_club
- COUNT(DISTINCT quiz_attempts) in this club
- AVG(percentage) for all attempts in this club
```

---

### Tier 3: Global Leaderboard
**Location**: `/dashboard/leaderboard` → Global Leaderboard tab

**Ranking Logic** (with special tiebreaker):
1. **Primary**: Total score across ALL quizzes
2. **Tiebreaker (Critical)**: FEWER clubs joined ranks HIGHER ⭐
3. **Tiebreaker 2**: More quizzes completed
4. **Tiebreaker 3**: Higher average percentage

**Features**:
- Shows top 50 participants platform-wide
- Highlights current user's row
- Displays total score, clubs joined, quizzes completed, and average percentage
- User's personal rank card at the top

**API Endpoint**: `GET /api/leaderboards/global?limit=50`

**Why "Fewer Clubs" Tiebreaker?**
This rewards focused excellence. If two users have the same total score:
- User A: 100 points from 2 clubs (50 points/club average)
- User B: 100 points from 5 clubs (20 points/club average)
→ User A ranks higher as they demonstrate deeper engagement

**Data Aggregation**:
```sql
SELECT 
  u.id, u.name, u.email, u.avatar, u.role,
  SUM(qa.score) as total_score,
  COUNT(DISTINCT cm.id) as clubs_joined,
  COUNT(DISTINCT qa.id) as quizzes_completed,
  AVG(qa.percentage) as avg_percentage
FROM User u
LEFT JOIN QuizAttempt qa ON u.id = qa.userId
LEFT JOIN ClubMember cm ON u.id = cm.userId
WHERE u.role IN ('STUDENT', 'COORDINATOR')
GROUP BY u.id
ORDER BY 
  total_score DESC,
  clubs_joined ASC,  -- FEWER clubs ranks higher
  quizzes_completed DESC,
  avg_percentage DESC
```

---

## 3. User Rank Tracking

**My Rank Card**: Displayed at top of leaderboard page
- Shows current global rank
- Total score, quizzes completed, and clubs joined
- Visual gradient design for motivation

**API Endpoint**: `GET /api/leaderboards/my-rank`

---

## 4. Role-Based Access Control

### Access Matrix

| Feature | Student | Coordinator | Faculty | Admin |
|---------|---------|-------------|---------|-------|
| View Quizzes | ✅ | ✅ | ✅ | ✅ |
| Take Quizzes | ✅ | ✅ | ✅ | ✅ |
| Create Quizzes | ❌ | ✅ | ❌ | ✅ |
| Manage Quizzes | ❌ | ✅ (own clubs) | ❌ | ✅ |
| Quiz Leaderboard | ✅ | ✅ | ✅ | ✅ |
| Club Leaderboard | ✅ (if member) | ✅ | ✅ | ✅ |
| Global Leaderboard | ✅ | ✅ | ✅ | ✅ |

---

## 5. Navigation & UX

### Sidebar Updates
- **New Item**: "Leaderboard" added for all users
- Icon: Trophy/BarChart icon
- Position: After "Quizzes", before role-specific items

### Quiz Flow
1. **Browse** → `/dashboard/quizzes` (all users)
2. **Start Quiz** → `/dashboard/quizzes/[id]` (timer begins)
3. **Submit** → Results page with quiz leaderboard
4. **Navigate** → Global leaderboard or club leaderboard

### Leaderboard Navigation
```
Leaderboard Page
├── Tab 1: Global Leaderboard
│   ├── My Rank Card (top)
│   └── Top 50 Users Table
└── Tab 2: Club Leaderboards
    ├── Club Selector Dropdown
    └── Club-Specific Rankings Table
```

---

## 6. Backend Enhancements

### Updated Services

#### `leaderboards.service.ts`
- `getGlobalLeaderboard()`: Implements advanced ranking with fewer clubs tiebreaker
- `getClubLeaderboard()`: Club-specific aggregation
- `getUserRank()`: Personal rank retrieval

#### `quizzes.service.ts`
- `getQuizLeaderboard()`: Quiz-specific rankings with time consideration
- Enhanced with better sorting logic

### Caching Strategy
- **Global Leaderboard**: 5 minutes (Redis)
- **Club Leaderboard**: 5 minutes (Redis)
- **Quiz Leaderboard**: 5 minutes (Redis)
- Cache invalidation on new quiz attempts

---

## 7. Database Schema Usage

### Key Tables
- **Quiz**: Stores quiz metadata (clubId, title, timeLimit, isActive)
- **Question**: Quiz questions with options and correct answers
- **QuizAttempt**: User quiz submissions (score, percentage, timeTaken, answers)
- **ClubMember**: Tracks club memberships for club leaderboards
- **User**: User profiles with roles

### Important Fields
- `QuizAttempt.attemptedAt`: Must be NOT NULL to count as completed
- `Quiz.isActive`: Controls quiz visibility to students
- `QuizAttempt.timeTaken`: Used for quiz leaderboard tiebreaker
- `ClubMember.joinedAt`: Used for club leaderboard tiebreaker

---

## 8. Testing Scenarios

### Scenario 1: Equal Scores, Different Club Counts
- User A: 150 points, 2 clubs
- User B: 150 points, 5 clubs
- **Result**: User A ranks higher

### Scenario 2: Quiz Leaderboard with Same Score
- User C: 10/10, 2 minutes
- User D: 10/10, 3 minutes
- **Result**: User C ranks higher (faster)

### Scenario 3: Club Leaderboard
- Only includes members of selected club
- Aggregates only quizzes from that club
- Sorted by total club quiz score

---

## 9. Future Enhancements (Optional)

1. **Quiz Categories/Tags**: Filter quizzes by topic
2. **Achievements/Badges**: Award for leaderboard positions
3. **Time-Based Leaderboards**: Weekly/monthly resets
4. **Quiz History**: View past attempts and improvement
5. **Difficulty Levels**: Weight scores by quiz difficulty
6. **Team Quizzes**: Collaborative quiz-taking
7. **Real-Time Updates**: WebSocket for live leaderboard changes

---

## 10. Summary

### What Works Now
✅ All users can browse and take quizzes  
✅ Coordinators can create and manage quizzes  
✅ Three-tier leaderboard system fully functional  
✅ Advanced ranking logic with multiple tiebreakers  
✅ Special "fewer clubs" tiebreaker for global leaderboard  
✅ Quiz-specific leaderboards shown after completion  
✅ Club leaderboards for members  
✅ Personal rank tracking  
✅ Role-based access control  
✅ Responsive UI with top 3 highlighting  

### Key Files Modified/Created
**Backend**:
- `src/leaderboards/leaderboards.service.ts` - Enhanced ranking logic
- `src/quizzes/quizzes.service.ts` - Quiz leaderboard improvements

**Frontend**:
- `src/app/dashboard/leaderboard/page.tsx` - Complete rewrite with 3 tiers
- `src/app/dashboard/quizzes/[id]/page.tsx` - Added leaderboard display
- `src/components/Sidebar.tsx` - Added leaderboard navigation

---

## 11. API Endpoints Summary

```
Quizzes:
GET    /api/quizzes                      - List all active quizzes
GET    /api/quizzes/:id                  - Get quiz details
POST   /api/quizzes                      - Create quiz (Coordinator only)
PUT    /api/quizzes/:id                  - Update quiz (Coordinator only)
DELETE /api/quizzes/:id                  - Delete quiz (Coordinator only)
POST   /api/quizzes/:id/submit           - Submit quiz attempt
GET    /api/quizzes/:id/leaderboard      - Quiz leaderboard (top 10)
GET    /api/quizzes/:id/stats            - Quiz statistics (Coordinator only)

Leaderboards:
GET    /api/leaderboards/global          - Global leaderboard (top 50)
GET    /api/leaderboards/club/:clubId    - Club leaderboard (top 30)
GET    /api/leaderboards/my-rank         - Current user's rank
```

---

## End of Documentation
