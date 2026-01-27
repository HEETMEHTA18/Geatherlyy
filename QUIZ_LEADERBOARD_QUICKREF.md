# Quiz & Leaderboard System - Quick Reference

## 🎯 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         QUIZ SYSTEM                              │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│   ALL USERS      │      │  COORDINATORS    │      │  QUIZ RESULTS    │
│  Browse Quizzes  │──────▶│  Create Quizzes  │──────▶│  + Leaderboard   │
│  Take Quizzes    │      │  Manage Quizzes  │      │  + Navigation    │
└──────────────────┘      └──────────────────┘      └──────────────────┘


┌─────────────────────────────────────────────────────────────────┐
│                    LEADERBOARD TIERS                             │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ TIER 1: Quiz Leaderboard (After Quiz Completion)                │
│ ─────────────────────────────────────────────────────────────── │
│ Ranking Logic:                                                   │
│   1. Score (DESC)        ← Primary                              │
│   2. Time Taken (ASC)    ← Faster = Better                      │
│   3. Attempted At (ASC)  ← Earlier = Better                     │
│                                                                  │
│ Shows: Top 10 participants in this specific quiz                │
│ Display: Gold 🥇, Silver 🥈, Bronze 🥉 for top 3                │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ TIER 2: Club Leaderboard (/dashboard/leaderboard → Clubs Tab)   │
│ ─────────────────────────────────────────────────────────────── │
│ Ranking Logic:                                                   │
│   1. Total Score in Club (DESC)    ← Primary                    │
│   2. Quizzes Completed (DESC)      ← More quizzes = Better      │
│   3. Avg Percentage (DESC)         ← Higher accuracy = Better   │
│   4. Joined Date (ASC)             ← Earlier join = Better      │
│                                                                  │
│ Shows: Top 30 members of selected club                          │
│ Filter: Club dropdown selector                                  │
│ Access: Only members of the club                                │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ TIER 3: Global Leaderboard (/dashboard/leaderboard → Global)    │
│ ─────────────────────────────────────────────────────────────── │
│ Ranking Logic (SPECIAL TIEBREAKER):                             │
│   1. Total Score (DESC)            ← Primary                    │
│   2. Clubs Joined (ASC) ⭐         ← FEWER clubs ranks HIGHER  │
│   3. Quizzes Completed (DESC)      ← More quizzes = Better      │
│   4. Avg Percentage (DESC)         ← Higher accuracy = Better   │
│                                                                  │
│ Shows: Top 50 participants platform-wide                        │
│ Highlights: Current user's row in blue                          │
│ My Rank Card: Displayed at top with user's position             │
└─────────────────────────────────────────────────────────────────┘
```

## 🎮 User Flow Diagrams

### Student Journey
```
1. Login → Dashboard
2. Click "Quizzes" in Sidebar
3. Browse Active Quizzes
4. Click "Start Quiz" on a quiz card
5. Complete Quiz (timer running)
6. Submit Quiz
7. View Results + Quiz Leaderboard (Top 10)
8. Click "View Global Leaderboard"
9. See Rankings:
   - Global Tab: All participants
   - Clubs Tab: Select club → See club rankings
```

### Coordinator Journey
```
1. Login → Dashboard
2. Click "Manage Club" in Sidebar
3. Select "Quizzes" Tab
4. Click "Create New Quiz"
5. Add Quiz Details:
   - Title & Description
   - Time Limit
   - Questions with Options
   - Images (optional)
6. Click "Create Quiz"
7. Quiz appears in list (Published = Active)
8. Toggle Start/Stop button to control visibility
9. Students can now see and take the quiz
```

## 📊 Ranking Examples

### Example 1: Global Leaderboard with Tiebreaker
```
┌──────┬─────────────────┬───────┬────────┬──────────┬───────────┐
│ Rank │ Name            │ Score │ Clubs  │ Quizzes  │ Avg %     │
├──────┼─────────────────┼───────┼────────┼──────────┼───────────┤
│  1   │ Alice Chen      │  150  │   2    │    15    │  95.2%    │
│  2   │ Bob Smith       │  150  │   5    │    18    │  92.8%    │ ← Same score but MORE clubs
│  3   │ Carol Johnson   │  145  │   1    │    14    │  96.1%    │
└──────┴─────────────────┴───────┴────────┴──────────┴───────────┘

Explanation:
- Alice and Bob have the same score (150)
- Alice joined 2 clubs, Bob joined 5 clubs
- Alice ranks HIGHER because she has FEWER clubs
- This rewards focused excellence over spreading thin
```

### Example 2: Quiz Leaderboard with Time Tiebreaker
```
┌──────┬─────────────────┬───────┬─────────┬────────────────────┐
│ Rank │ Name            │ Score │ Time    │ Percentage         │
├──────┼─────────────────┼───────┼─────────┼────────────────────┤
│  1   │ David Lee       │  10   │  1m 45s │  100%              │
│  2   │ Emma Wilson     │  10   │  2m 15s │  100%              │ ← Same score but slower
│  3   │ Frank Brown     │   9   │  1m 30s │   90%              │
└──────┴─────────────────┴───────┴─────────┴────────────────────┘

Explanation:
- David and Emma have perfect scores
- David completed faster (1m 45s vs 2m 15s)
- David ranks HIGHER due to faster time
```

### Example 3: Club Leaderboard
```
Club: Tech Innovators

┌──────┬─────────────────┬───────┬──────────┬───────────┐
│ Rank │ Member          │ Score │ Quizzes  │ Avg %     │
├──────┼─────────────────┼───────┼──────────┼───────────┤
│  1   │ Grace Park      │   85  │    8     │  94.5%    │
│  2   │ Henry Liu       │   82  │    9     │  91.2%    │
│  3   │ Iris Chang      │   80  │    7     │  95.8%    │
└──────┴─────────────────┴───────┴──────────┴───────────┘

Note: Only shows members who joined "Tech Innovators" club
Scores: Only from quizzes created by "Tech Innovators"
```

## 🔐 Access Control Matrix

```
┌─────────────────────────┬─────────┬─────────────┬─────────┬───────┐
│ Action                  │ Student │ Coordinator │ Faculty │ Admin │
├─────────────────────────┼─────────┼─────────────┼─────────┼───────┤
│ Browse Quizzes          │    ✅   │      ✅     │    ✅   │   ✅  │
│ Take Quizzes            │    ✅   │      ✅     │    ✅   │   ✅  │
│ Create Quizzes          │    ❌   │      ✅     │    ❌   │   ✅  │
│ Manage Quizzes          │    ❌   │      ✅     │    ❌   │   ✅  │
│ View Quiz Leaderboard   │    ✅   │      ✅     │    ✅   │   ✅  │
│ View Club Leaderboard   │    ✅*  │      ✅     │    ✅   │   ✅  │
│ View Global Leaderboard │    ✅   │      ✅     │    ✅   │   ✅  │
└─────────────────────────┴─────────┴─────────────┴─────────┴───────┘

* Students can only view leaderboards for clubs they are members of
```

## 🎨 UI Highlights

### Top 3 Styling
```
🥇 Rank 1: Gold gradient (yellow-400 to yellow-600)
🥈 Rank 2: Silver gradient (gray-300 to gray-500)
🥉 Rank 3: Bronze gradient (amber-600 to amber-800)
   Rank 4+: Gray background
```

### My Rank Card (Top of Leaderboard Page)
```
┌──────────────────────────────────────────────────────────┐
│  Your Global Rank                              🔥        │
│                                                           │
│  #12         150 Points                                  │
│              15 Quizzes • 3 Clubs                        │
└──────────────────────────────────────────────────────────┘
Background: Blue-to-purple gradient with white text
```

### Quiz Results Layout
```
┌─────────────────────────────┬─────────────────────────────┐
│  🎉 Quiz Completed!         │   🏆 Quiz Leaderboard       │
│                             │                             │
│  Your Score: 8/10           │   1. Alice Chen - 10pts     │
│  Percentage: 80%            │   2. Bob Smith - 9pts       │
│  Time: 2m 15s               │   3. You - 8pts             │
│                             │   ...                       │
│  [More Quizzes] [Global →] │   [View Club Leaderboard]   │
└─────────────────────────────┴─────────────────────────────┘
```

## 🚀 Quick Testing Guide

### Test Case 1: Create & Take Quiz
1. Login as Coordinator
2. Go to Manage Club → Quizzes
3. Create a quiz with 3 questions
4. Logout, login as Student
5. Go to Quizzes → Take the new quiz
6. Complete and check leaderboard

### Test Case 2: Verify Tiebreaker
1. Have 2 students score the same points
2. Student A: Member of 1 club
3. Student B: Member of 3 clubs
4. Check Global Leaderboard
5. ✅ Student A should rank higher

### Test Case 3: Club Leaderboard
1. Join a specific club as Student
2. Take quizzes from that club
3. Go to Leaderboard → Clubs Tab
4. Select the club from dropdown
5. ✅ Should see only members of that club

## 📱 Mobile Responsiveness
- Tables scroll horizontally on mobile
- Rank badges remain circular and visible
- Tab navigation stacks on small screens
- Leaderboard cards adjust to single column

## 🎯 Performance Notes
- Leaderboards cached for 5 minutes (Redis)
- Top 50 global, Top 30 club, Top 10 quiz
- Cache invalidated on new quiz attempts
- Efficient SQL queries with proper indexing

---

**Status**: ✅ Fully Implemented & Ready to Use
**Documentation**: See QUIZ_LEADERBOARD_SYSTEM.md for detailed specs
