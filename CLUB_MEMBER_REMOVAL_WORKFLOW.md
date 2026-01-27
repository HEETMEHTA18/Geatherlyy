# Club Member Removal Workflow - Dual Approval System

## 🔄 Complete Removal Process

### **Step 1: Coordinator Identifies Issue**
Coordinator notices a member is not following club rules or not suitable for the club

### **Step 2: Coordinator Creates Removal Request**
```
Coordinator Dashboard → Club Members → Select Member → Request Removal
    ↓
Fill Removal Form:
  • Member Name
  • Reason for Removal (required)
  • Additional Details
    ↓
Submit Request
    ↓
Status: PENDING (waiting for approvals)
```

### **Step 3: Email Notifications Sent**
📧 **Automated Emails:**
1. ✅ **Mentor** → "New removal request requires your approval"
2. ✅ **Admin** → "New removal request requires your approval"
3. ✅ **Coordinator** → "Your removal request has been submitted"

---

## 🔐 Dual Approval Required

### **Mentor Reviews First** (or in parallel with Admin)
```
Mentor Dashboard → Pending Removal Requests
    ↓
View Request Details:
  • Club Name
  • Member to Remove
  • Coordinator's Reason
  • Member's Activity History
    ↓
Mentor Decision:
    ↓
┌────────────────┬────────────────┐
│   APPROVE      │    REJECT      │
└────────────────┴────────────────┘
        ↓                 ↓
Add Notes          Add Rejection Notes
        ↓                 ↓
Submit             Submit
```

📧 **Email Sent:**
- Coordinator → "Mentor has [approved/rejected] your removal request"
- Admin → "Mentor has approved. Awaiting your decision."

---

### **Admin Reviews** (independent of Mentor)
```
Admin Dashboard → Pending Removal Requests
    ↓
View Request Details:
  • Club Name
  • Member to Remove
  • Coordinator's Reason
  • Mentor's Decision & Notes
  • Member's Platform Activity
    ↓
Admin Decision:
    ↓
┌────────────────┬────────────────┐
│   APPROVE      │    REJECT      │
└────────────────┴────────────────┘
        ↓                 ↓
Add Notes          Add Rejection Notes
        ↓                 ↓
Submit             Submit
```

📧 **Email Sent:**
- Coordinator → "Admin has [approved/rejected] your removal request"
- Mentor → "Admin has approved. Awaiting your decision."

---

## ✅ Final Status Logic

### **Case 1: BOTH Approve** ✅✅
```
Mentor: APPROVED + Admin: APPROVED
    ↓
Final Status: APPROVED
    ↓
Member is REMOVED from Club
    ↓
Update club member count
    ↓
Log removal in audit trail
```

📧 **Final Emails:**
1. **Member** → "You have been removed from [Club Name]"
   - Reason from Coordinator
   - Mentor & Admin notes
   - Appeal process info
2. **Coordinator** → "Removal approved. Member removed successfully"
3. **Mentor** → "Removal finalized"
4. **Admin** → "Removal finalized"

---

### **Case 2: Either Rejects** ❌
```
Mentor: REJECTED OR Admin: REJECTED
    ↓
Final Status: REJECTED
    ↓
Member STAYS in Club
    ↓
Log rejection in audit trail
```

📧 **Final Emails:**
1. **Coordinator** → "Removal request rejected"
   - Rejection reason from Mentor/Admin
   - Suggestions for improvement
2. **Member** → "A removal request was made but rejected. You remain in the club"
3. **Other Approver** → "Request has been rejected by [Mentor/Admin]"

---

### **Case 3: Pending** ⏳
```
Still waiting for:
  - Mentor Approval: PENDING
  OR
  - Admin Approval: PENDING
    ↓
Final Status: PENDING
    ↓
No action taken yet
```

---

## 📊 Approval Matrix

| Mentor Status | Admin Status | Final Status | Member Removed? |
|--------------|--------------|--------------|----------------|
| PENDING      | PENDING      | PENDING      | ❌ No          |
| APPROVED     | PENDING      | PENDING      | ❌ No          |
| PENDING      | APPROVED     | PENDING      | ❌ No          |
| **APPROVED** | **APPROVED** | **APPROVED** | ✅ **Yes**     |
| REJECTED     | *            | REJECTED     | ❌ No          |
| *            | REJECTED     | REJECTED     | ❌ No          |

---

## 🔔 Email Notification Timeline

```
Time T0: Request Created
├─ Email 1: Mentor (request notification)
├─ Email 2: Admin (request notification)
└─ Email 3: Coordinator (confirmation)

Time T1: Mentor Reviews
├─ Email 4: Coordinator (mentor decision)
└─ Email 5: Admin (mentor decided, your turn)

Time T2: Admin Reviews
├─ Email 6: Coordinator (admin decision)
└─ Email 7: Mentor (admin decided)

Time T3: Both Approved/Rejected
├─ Email 8: Member (final outcome)
├─ Email 9: Coordinator (final outcome)
├─ Email 10: Mentor (final outcome)
└─ Email 11: Admin (final outcome)
```

---

## 🛡️ Security & Audit Trail

Every removal request logs:
- **Who requested** (Coordinator ID)
- **When requested** (createdAt)
- **Who approved/rejected** (Mentor ID, Admin ID)
- **When approved/rejected** (mentorReviewedAt, adminReviewedAt)
- **All notes/reasons** (stored permanently)
- **Final outcome** (approved/rejected)
- **Email tracking** (all emails sent confirmed)

This ensures complete transparency and accountability! 🎯
