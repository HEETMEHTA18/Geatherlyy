# Gatherly Database Structure

## Database Overview

**Database Type:** PostgreSQL 14  
**ORM:** Prisma Client v5.8.0  
**Total Tables:** 11  
**Architecture:** Relational with proper foreign keys and cascading deletes

---

## Entity Relationship Diagram

```mermaid
erDiagram
    User ||--o{ ClubMember : "joins"
    User ||--o{ ClubCoordinator : "coordinates"
    User ||--o{ Club : "creates"
    User ||--o{ Club : "mentors"
    User ||--o{ QuizAttempt : "attempts"
    User ||--o{ Comment : "posts"
    User ||--o{ Resource : "uploads"
    User ||--o{ ApprovalRequest : "requests"
    User ||--o{ ApprovalRequest : "reviews"
    User ||--o{ ClubMemberRemovalRequest : "requests_removal"
    User ||--o{ ClubMemberRemovalRequest : "is_removed"
    
    Club ||--o{ ClubMember : "has"
    Club ||--o{ ClubCoordinator : "has"
    Club ||--o{ Activity : "hosts"
    Club ||--o{ Quiz : "creates"
    Club ||--o{ Resource : "contains"
    Club ||--o{ Comment : "receives"
    Club ||--o{ ApprovalRequest : "relates_to"
    Club ||--o{ ClubMemberRemovalRequest : "has"
    
    Quiz ||--o{ Question : "contains"
    Quiz ||--o{ QuizAttempt : "has"
    
    User {
        int id PK
        string email UK
        string password
        string googleId UK
        string name
        string universityId UK
        string department
        string year
        string phone
        string avatar
        enum role
        enum approvalStatus
        boolean profileComplete
        boolean coordinatorDisclaimer
        datetime createdAt
        datetime updatedAt
        datetime lastLogin
    }
    
    Club {
        int id PK
        string name UK
        string description
        string category
        int createdBy FK
        int mentorId FK
        enum approvalStatus
        string rejectionReason
        datetime reviewedAt
        string imageUrl
        string[] eventPhotos
        boolean isActive
        int memberCount
        int maxMembers
        datetime createdAt
        datetime updatedAt
    }
    
    ClubMember {
        int id PK
        int clubId FK
        int userId FK
        datetime joinedAt
    }
    
    ClubCoordinator {
        int id PK
        int clubId FK
        int userId FK
        datetime assignedAt
    }
    
    Activity {
        int id PK
        int clubId FK
        string title
        string description
        enum type
        enum status
        datetime startDate
        datetime endDate
        string location
        string imageUrl
        int maxParticipants
        datetime createdAt
        datetime updatedAt
    }
    
    Quiz {
        int id PK
        int clubId FK
        string title
        string description
        int timeLimit
        int totalMarks
        int passingMarks
        int maxAttempts
        boolean isActive
        datetime startDate
        datetime endDate
        datetime createdAt
        datetime updatedAt
    }
    
    Question {
        int id PK
        int quizId FK
        string text
        enum type
        string[] options
        string[] correctAnswer
        int marks
        string imageUrl
        int order
        datetime createdAt
        datetime updatedAt
    }
    
    QuizAttempt {
        int id PK
        int quizId FK
        int userId FK
        int score
        int totalMarks
        float percentage
        int timeTaken
        json answers
        boolean isPassed
        datetime attemptedAt
    }
    
    Resource {
        int id PK
        int clubId FK
        int uploadedBy FK
        string title
        string description
        enum type
        string url
        int fileSize
        int downloads
        datetime createdAt
        datetime updatedAt
    }
    
    Comment {
        int id PK
        int clubId FK
        int userId FK
        string content
        boolean isAnonymous
        datetime createdAt
        datetime updatedAt
    }
    
    ApprovalRequest {
        int id PK
        int userId FK
        enum requestedRole
        string requestedFor
        int clubId FK
        enum status
        string reason
        int reviewedById FK
        datetime reviewedAt
        datetime createdAt
        datetime updatedAt
    }
    
    ClubMemberRemovalRequest {
        int id PK
        int clubId FK
        int memberId FK
        int requestedBy FK
        string reason
        enum mentorApproval
        enum adminApproval
        int mentorReviewedBy
        int adminReviewedBy
        datetime mentorReviewedAt
        datetime adminReviewedAt
        string mentorReviewNotes
        string adminReviewNotes
        enum status
        datetime finalizedAt
        boolean mentorEmailSent
        boolean adminEmailSent
        boolean coordinatorEmailSent
        boolean memberEmailSent
        datetime createdAt
        datetime updatedAt
    }
```

---

## Detailed Table Structures

### 1. **users** - User Accounts & Authentication

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTO INCREMENT | Unique user identifier |
| `email` | VARCHAR | UNIQUE, NOT NULL | User email address |
| `password` | VARCHAR | NULLABLE | Hashed password (null for OAuth) |
| `googleId` | VARCHAR | UNIQUE, NULLABLE | Google OAuth ID |
| `name` | VARCHAR | NOT NULL | Full name |
| `universityId` | VARCHAR | UNIQUE, NULLABLE | Student/Staff ID |
| `department` | VARCHAR | NOT NULL | Department name |
| `year` | VARCHAR | NULLABLE | Academic year |
| `phone` | VARCHAR | NULLABLE | Contact number |
| `avatar` | VARCHAR | NULLABLE | Profile picture URL |
| `role` | ENUM | DEFAULT 'MEMBER' | MEMBER, COORDINATOR, FACULTY, ADMIN |
| `approvalStatus` | ENUM | DEFAULT 'APPROVED' | PENDING, APPROVED, REJECTED |
| `profileComplete` | BOOLEAN | DEFAULT false | Profile completion status |
| `coordinatorDisclaimer` | BOOLEAN | DEFAULT false | Coordinator terms accepted |
| `createdAt` | TIMESTAMP | DEFAULT now() | Account creation time |
| `updatedAt` | TIMESTAMP | AUTO UPDATE | Last update time |
| `lastLogin` | TIMESTAMP | NULLABLE | Last login timestamp |

**Indexes:**
- `email` (unique)
- `googleId` (unique)
- `role`
- `approvalStatus`

---

### 2. **clubs** - Club Entities

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTO INCREMENT | Unique club identifier |
| `name` | VARCHAR | UNIQUE, NOT NULL | Club name |
| `description` | TEXT | NOT NULL | Club description |
| `category` | VARCHAR | NOT NULL | Club category |
| `createdBy` | INTEGER | FOREIGN KEY → users(id) | Creator user ID |
| `mentorId` | INTEGER | FOREIGN KEY → users(id), NULLABLE | Faculty mentor ID |
| `approvalStatus` | ENUM | DEFAULT 'PENDING' | PENDING, APPROVED, REJECTED |
| `rejectionReason` | TEXT | NULLABLE | Reason for rejection |
| `reviewedAt` | TIMESTAMP | NULLABLE | Review timestamp |
| `imageUrl` | VARCHAR | NULLABLE | Club logo/image |
| `eventPhotos` | VARCHAR[] | DEFAULT [] | Event photo URLs |
| `isActive` | BOOLEAN | DEFAULT true | Active status |
| `memberCount` | INTEGER | DEFAULT 0 | Current member count |
| `maxMembers` | INTEGER | DEFAULT 100 | Maximum members allowed |
| `createdAt` | TIMESTAMP | DEFAULT now() | Creation time |
| `updatedAt` | TIMESTAMP | AUTO UPDATE | Last update time |

**Indexes:**
- `createdBy`
- `mentorId`
- `approvalStatus`
- `category`
- `isActive`
- `createdAt`

---

### 3. **club_members** - Club Membership (Junction Table)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTO INCREMENT | Unique membership ID |
| `clubId` | INTEGER | FOREIGN KEY → clubs(id), CASCADE DELETE | Club reference |
| `userId` | INTEGER | FOREIGN KEY → users(id), CASCADE DELETE | User reference |
| `joinedAt` | TIMESTAMP | DEFAULT now() | Join timestamp |

**Unique Constraint:** [(clubId, userId)](file:///e:/Heet/Gatherly/backend/src/resources/resources.service.ts#107-117) - Prevents duplicate memberships  
**Indexes:**
- `clubId`
- `userId`

---

### 4. **club_coordinators** - Club Coordinators (Junction Table)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTO INCREMENT | Unique coordinator assignment ID |
| `clubId` | INTEGER | FOREIGN KEY → clubs(id), CASCADE DELETE | Club reference |
| `userId` | INTEGER | FOREIGN KEY → users(id), CASCADE DELETE | User reference |
| `assignedAt` | TIMESTAMP | DEFAULT now() | Assignment timestamp |

**Unique Constraint:** [(clubId, userId)](file:///e:/Heet/Gatherly/backend/src/resources/resources.service.ts#107-117) - Prevents duplicate coordinator assignments  
**Indexes:**
- `clubId`
- `userId`

---

### 5. **activities** - Events & Workshops

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTO INCREMENT | Unique activity ID |
| `clubId` | INTEGER | FOREIGN KEY → clubs(id), CASCADE DELETE | Club reference |
| `title` | VARCHAR | NOT NULL | Activity title |
| `description` | TEXT | NOT NULL | Activity description |
| `type` | ENUM | DEFAULT 'EVENT' | EVENT, WORKSHOP, MEETING, COMPETITION |
| `status` | ENUM | DEFAULT 'UPCOMING' | UPCOMING, ONGOING, COMPLETED, CANCELLED |
| `startDate` | TIMESTAMP | NOT NULL | Start date/time |
| `endDate` | TIMESTAMP | NULLABLE | End date/time |
| `location` | VARCHAR | NULLABLE | Venue/location |
| `imageUrl` | VARCHAR | NULLABLE | Activity poster/image |
| `maxParticipants` | INTEGER | NULLABLE | Maximum participants |
| `createdAt` | TIMESTAMP | DEFAULT now() | Creation time |
| `updatedAt` | TIMESTAMP | AUTO UPDATE | Last update time |

**Indexes:**
- `clubId`
- `startDate`
- `status`

---

### 6. **quizzes** - Quiz System

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTO INCREMENT | Unique quiz ID |
| `clubId` | INTEGER | FOREIGN KEY → clubs(id), CASCADE DELETE | Club reference |
| `title` | VARCHAR | NOT NULL | Quiz title |
| `description` | TEXT | NULLABLE | Quiz description |
| `timeLimit` | INTEGER | NOT NULL | Time limit in minutes |
| `totalMarks` | INTEGER | DEFAULT 0 | Total marks |
| `passingMarks` | INTEGER | DEFAULT 0 | Passing threshold |
| `maxAttempts` | INTEGER | DEFAULT 1 | Maximum attempts allowed |
| `isActive` | BOOLEAN | DEFAULT true | Active status |
| `startDate` | TIMESTAMP | NULLABLE | Quiz start time |
| `endDate` | TIMESTAMP | NULLABLE | Quiz end time |
| `createdAt` | TIMESTAMP | DEFAULT now() | Creation time |
| `updatedAt` | TIMESTAMP | AUTO UPDATE | Last update time |

**Indexes:**
- `clubId`
- `isActive`
- `startDate`

---

### 7. **questions** - Quiz Questions

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTO INCREMENT | Unique question ID |
| `quizId` | INTEGER | FOREIGN KEY → quizzes(id), CASCADE DELETE | Quiz reference |
| `text` | TEXT | NOT NULL | Question text |
| `type` | ENUM | DEFAULT 'MCQ' | MCQ, TRUE_FALSE, MULTIPLE_ANSWER |
| `options` | VARCHAR[] | NOT NULL | Answer options array |
| `correctAnswer` | VARCHAR[] | NOT NULL | Correct answer(s) array |
| `marks` | INTEGER | DEFAULT 1 | Marks for this question |
| `imageUrl` | VARCHAR | NULLABLE | Question image |
| `order` | INTEGER | DEFAULT 0 | Display order |
| `createdAt` | TIMESTAMP | DEFAULT now() | Creation time |
| `updatedAt` | TIMESTAMP | AUTO UPDATE | Last update time |

**Indexes:**
- `quizId`
- `order`

---

### 8. **quiz_attempts** - User Quiz Submissions

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTO INCREMENT | Unique attempt ID |
| `quizId` | INTEGER | FOREIGN KEY → quizzes(id), CASCADE DELETE | Quiz reference |
| `userId` | INTEGER | FOREIGN KEY → users(id), CASCADE DELETE | User reference |
| `score` | INTEGER | DEFAULT 0 | Score obtained |
| `totalMarks` | INTEGER | NOT NULL | Total marks |
| `percentage` | FLOAT | DEFAULT 0 | Percentage score |
| `timeTaken` | INTEGER | NOT NULL | Time taken in seconds |
| `answers` | JSON | NOT NULL | User's answers |
| `isPassed` | BOOLEAN | DEFAULT false | Pass/fail status |
| `attemptedAt` | TIMESTAMP | DEFAULT now() | Attempt timestamp |

**Unique Constraint:** [(quizId, userId)](file:///e:/Heet/Gatherly/backend/src/resources/resources.service.ts#107-117) - One attempt per user per quiz  
**Indexes:**
- `quizId`
- `userId`
- `attemptedAt`
- `score`

---

### 9. **resources** - File Sharing

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTO INCREMENT | Unique resource ID |
| `clubId` | INTEGER | FOREIGN KEY → clubs(id), CASCADE DELETE | Club reference |
| `uploadedBy` | INTEGER | FOREIGN KEY → users(id) | Uploader user ID |
| `title` | VARCHAR | NOT NULL | Resource title |
| `description` | TEXT | NULLABLE | Resource description |
| `type` | ENUM | DEFAULT 'PDF' | PDF, IMAGE, LINK, VIDEO |
| `url` | VARCHAR | NOT NULL | File URL |
| `fileSize` | INTEGER | NULLABLE | File size in bytes |
| `downloads` | INTEGER | DEFAULT 0 | Download count |
| `createdAt` | TIMESTAMP | DEFAULT now() | Upload time |
| `updatedAt` | TIMESTAMP | AUTO UPDATE | Last update time |

**Indexes:**
- `clubId`
- `uploadedBy`
- `type`
- `createdAt`

---

### 10. **comments** - Anonymous Feedback

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTO INCREMENT | Unique comment ID |
| `clubId` | INTEGER | FOREIGN KEY → clubs(id), CASCADE DELETE | Club reference |
| `userId` | INTEGER | FOREIGN KEY → users(id), CASCADE DELETE | User reference |
| `content` | TEXT | NOT NULL | Comment text |
| `isAnonymous` | BOOLEAN | DEFAULT true | Anonymous flag |
| `createdAt` | TIMESTAMP | DEFAULT now() | Creation time |
| `updatedAt` | TIMESTAMP | AUTO UPDATE | Last update time |

**Indexes:**
- `clubId`
- `userId`
- `createdAt`

---

### 11. **approval_requests** - Role Approval Workflow

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTO INCREMENT | Unique request ID |
| `userId` | INTEGER | FOREIGN KEY → users(id), CASCADE DELETE | Requesting user |
| `requestedRole` | ENUM | NOT NULL | MEMBER, COORDINATOR, FACULTY, ADMIN |
| `requestedFor` | VARCHAR | NULLABLE | Additional context |
| `clubId` | INTEGER | FOREIGN KEY → clubs(id), CASCADE DELETE, NULLABLE | Related club |
| `status` | ENUM | DEFAULT 'PENDING' | PENDING, APPROVED, REJECTED |
| `reason` | TEXT | NULLABLE | Request reason |
| `reviewedById` | INTEGER | FOREIGN KEY → users(id), SET NULL, NULLABLE | Reviewer user ID |
| `reviewedAt` | TIMESTAMP | NULLABLE | Review timestamp |
| `createdAt` | TIMESTAMP | DEFAULT now() | Request time |
| `updatedAt` | TIMESTAMP | AUTO UPDATE | Last update time |

**Indexes:**
- `userId`
- `clubId`
- `status`
- `createdAt`

---

### 12. **club_member_removal_requests** - Member Removal Workflow

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTO INCREMENT | Unique request ID |
| `clubId` | INTEGER | FOREIGN KEY → clubs(id), CASCADE DELETE | Club reference |
| `memberId` | INTEGER | FOREIGN KEY → users(id), CASCADE DELETE | Member to remove |
| `requestedBy` | INTEGER | FOREIGN KEY → users(id), CASCADE DELETE | Coordinator requesting |
| `reason` | TEXT | NOT NULL | Removal reason |
| `mentorApproval` | ENUM | DEFAULT 'PENDING' | PENDING, APPROVED, REJECTED |
| `adminApproval` | ENUM | DEFAULT 'PENDING' | PENDING, APPROVED, REJECTED |
| `mentorReviewedBy` | INTEGER | NULLABLE | Mentor reviewer ID |
| `adminReviewedBy` | INTEGER | NULLABLE | Admin reviewer ID |
| `mentorReviewedAt` | TIMESTAMP | NULLABLE | Mentor review time |
| `adminReviewedAt` | TIMESTAMP | NULLABLE | Admin review time |
| `mentorReviewNotes` | TEXT | NULLABLE | Mentor notes |
| `adminReviewNotes` | TEXT | NULLABLE | Admin notes |
| `status` | ENUM | DEFAULT 'PENDING' | Final status |
| `finalizedAt` | TIMESTAMP | NULLABLE | Finalization time |
| `mentorEmailSent` | BOOLEAN | DEFAULT false | Email tracking |
| `adminEmailSent` | BOOLEAN | DEFAULT false | Email tracking |
| `coordinatorEmailSent` | BOOLEAN | DEFAULT false | Email tracking |
| `memberEmailSent` | BOOLEAN | DEFAULT false | Email tracking |
| `createdAt` | TIMESTAMP | DEFAULT now() | Request time |
| `updatedAt` | TIMESTAMP | AUTO UPDATE | Last update time |

**Indexes:**
- `clubId`
- `memberId`
- `requestedBy`
- `status`
- `mentorApproval`
- `adminApproval`
- `createdAt`

---

## Enums

### UserRole
- `MEMBER` - Regular club member
- `COORDINATOR` - Club coordinator
- `FACULTY` - Faculty mentor
- `ADMIN` - System administrator

### ApprovalStatus
- `PENDING` - Awaiting approval
- `APPROVED` - Approved
- `REJECTED` - Rejected

### ClubApprovalStatus
- `PENDING` - Awaiting approval
- `APPROVED` - Approved
- `REJECTED` - Rejected

### ActivityType
- `EVENT` - General event
- `WORKSHOP` - Workshop/training
- `MEETING` - Meeting
- `COMPETITION` - Competition

### ActivityStatus
- `UPCOMING` - Not started
- `ONGOING` - In progress
- `COMPLETED` - Finished
- `CANCELLED` - Cancelled

### QuestionType
- `MCQ` - Multiple choice (single answer)
- `TRUE_FALSE` - True/False question
- `MULTIPLE_ANSWER` - Multiple correct answers

### ResourceType
- `PDF` - PDF document
- `IMAGE` - Image file
- `LINK` - External link
- `VIDEO` - Video file

### RemovalApprovalStatus
- `PENDING` - Awaiting approval
- `APPROVED` - Approved
- `REJECTED` - Rejected

---

## Key Relationships

### One-to-Many Relationships
1. **User → Clubs** (as creator)
2. **User → Clubs** (as mentor)
3. **Club → Activities**
4. **Club → Quizzes**
5. **Club → Resources**
6. **Club → Comments**
7. **Quiz → Questions**
8. **Quiz → QuizAttempts**

### Many-to-Many Relationships
1. **Users ↔ Clubs** (via `club_members`)
2. **Users ↔ Clubs** (via `club_coordinators`)

### Self-Referencing Relationships
1. **User → ApprovalRequest** (requester)
2. **User → ApprovalRequest** (reviewer)

---

## Data Integrity Features

✅ **Cascading Deletes:** When a club is deleted, all related activities, quizzes, members, etc. are automatically removed  
✅ **Unique Constraints:** Prevent duplicate emails, club names, and memberships  
✅ **Foreign Key Constraints:** Ensure referential integrity  
✅ **Default Values:** Sensible defaults for timestamps, booleans, and counts  
✅ **Indexes:** Optimized for common query patterns

---

## Storage Estimates

| Table | Estimated Rows (5000 users) | Avg Row Size | Total Size |
|-------|----------------------------|--------------|------------|
| users | 5,000 | ~500 bytes | ~2.5 MB |
| clubs | 50-100 | ~1 KB | ~100 KB |
| club_members | 10,000-15,000 | ~50 bytes | ~750 KB |
| club_coordinators | 200-300 | ~50 bytes | ~15 KB |
| activities | 500-1,000 | ~500 bytes | ~500 KB |
| quizzes | 200-500 | ~300 bytes | ~150 KB |
| questions | 2,000-5,000 | ~500 bytes | ~2.5 MB |
| quiz_attempts | 10,000-25,000 | ~200 bytes | ~5 MB |
| resources | 1,000-2,000 | ~300 bytes | ~600 KB |
| comments | 5,000-10,000 | ~200 bytes | ~2 MB |
| approval_requests | 500-1,000 | ~200 bytes | ~200 KB |
| removal_requests | 100-500 | ~400 bytes | ~200 KB |

**Total Estimated Database Size (5000 users, 1 year):** ~15-20 MB (metadata only, excluding file uploads)

*Note: File uploads (images, PDFs) are stored in Cloudinary, not in the database.*
