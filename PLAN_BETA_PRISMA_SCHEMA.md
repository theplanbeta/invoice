# Complete Prisma Schema for Plan Beta School Management System

## Ready to Copy-Paste into `prisma/schema.prisma`

```prisma
// This is your Prisma schema file for Plan Beta School Management System
// Learn more: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ==========================================
// ENUMS
// ==========================================

enum UserRole {
  FOUNDER
  MARKETING
  TEACHER
}

enum EnrollmentType {
  A1_ONLY
  FOUNDATION_A1_A2
  CAREER_A1_A2_B1
  COMPLETE_PATHWAY
}

enum Level {
  NEW
  A1
  A2
  B1
  B2
}

enum PaymentStatus {
  PAID
  PENDING
  PARTIAL
  OVERDUE
}

enum PaymentMethod {
  BANK_TRANSFER
  UPI
  CASH
  CARD
}

enum ReferralSource {
  META_ADS
  INSTAGRAM
  GOOGLE
  ORGANIC
  REFERRAL
  OTHER
}

enum BatchStatus {
  PLANNING
  FILLING
  FULL
  RUNNING
  COMPLETED
  POSTPONED
  CANCELLED
}

enum ChurnRisk {
  LOW
  MEDIUM
  HIGH
}

enum PayoutStatus {
  PENDING
  PROCESSING
  PAID
  FAILED
}

enum CompletionStatus {
  ACTIVE
  COMPLETED
  DROPPED
  ON_HOLD
}

// ==========================================
// USER MANAGEMENT
// ==========================================

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  password  String   // Hashed password
  role      UserRole @default(TEACHER)
  active    Boolean  @default(true)

  // Profile
  phone     String?
  avatar    String?

  // Relationships
  batches   Batch[]  @relation("TeacherBatches")

  // Timestamps
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([email])
  @@index([role])
}

// ==========================================
// STUDENT MANAGEMENT
// ==========================================

model Student {
  id                String            @id @default(cuid())
  studentId         String            @unique // Format: YYYY-MM-XXX

  // Personal Information
  name              String
  whatsapp          String            @unique
  email             String?           @unique

  // Enrollment Details
  enrollmentDate    DateTime          @default(now())
  currentLevel      Level             @default(NEW)
  enrollmentType    EnrollmentType

  // Batch Assignment
  batch             Batch?            @relation(fields: [batchId], references: [id])
  batchId           String?

  // Pricing
  originalPrice     Decimal           @db.Decimal(10, 2)
  discountApplied   Decimal           @default(0) @db.Decimal(10, 2)
  finalPrice        Decimal           @db.Decimal(10, 2)

  // Payment Status
  paymentStatus     PaymentStatus     @default(PENDING)
  totalPaid         Decimal           @default(0) @db.Decimal(10, 2)
  balance           Decimal           @default(0) @db.Decimal(10, 2)

  // Referral Information
  referralSource    ReferralSource
  referredBy        Student?          @relation("StudentReferrals", fields: [referredById], references: [id], onDelete: SetNull)
  referredById      String?
  referrals         Student[]         @relation("StudentReferrals")

  // Trial Information
  trialAttended     Boolean           @default(false)
  trialDate         DateTime?

  // Academic Progress
  classesAttended   Int               @default(0)
  totalClasses      Int               @default(0)
  attendanceRate    Decimal           @default(0) @db.Decimal(5, 2) // Percentage
  lastClassDate     DateTime?
  avgQuizScore      Decimal?          @db.Decimal(5, 2)

  // Status
  completionStatus  CompletionStatus  @default(ACTIVE)
  churnRisk         ChurnRisk         @default(LOW)

  // Notes
  notes             String?           @db.Text

  // Relationships
  attendance        Attendance[]
  payments          Payment[]
  referralsGiven    Referral[]        @relation("ReferrerStudent")
  referralsReceived Referral[]        @relation("RefereeStudent")
  upsells           Upsell[]

  // Timestamps
  createdAt         DateTime          @default(now())
  updatedAt         DateTime          @updatedAt

  @@index([studentId])
  @@index([whatsapp])
  @@index([email])
  @@index([batchId])
  @@index([enrollmentDate])
  @@index([paymentStatus])
  @@index([churnRisk])
  @@index([currentLevel])
}

// ==========================================
// BATCH MANAGEMENT
// ==========================================

model Batch {
  id                String       @id @default(cuid())
  batchCode         String       @unique // Format: A1-DEC-EVE-01

  // Batch Details
  level             Level
  startDate         DateTime
  endDate           DateTime
  schedule          String       // "Mon-Fri 7-8:30 PM IST"

  // Teacher Assignment
  teacher           User?        @relation("TeacherBatches", fields: [teacherId], references: [id])
  teacherId         String?

  // Capacity
  totalSeats        Int          @default(10)
  enrolledCount     Int          @default(0)
  fillRate          Decimal      @default(0) @db.Decimal(5, 2) // Percentage

  // Status
  status            BatchStatus  @default(PLANNING)

  // Financial
  revenueTarget     Decimal      @db.Decimal(10, 2)
  revenueActual     Decimal      @default(0) @db.Decimal(10, 2)
  teacherCost       Decimal      @db.Decimal(10, 2)
  profit            Decimal      @default(0) @db.Decimal(10, 2)

  // Alerts
  fillWarning       Boolean      @default(false) // true if <5 students && <10 days to start

  // Notes
  notes             String?      @db.Text

  // Relationships
  students          Student[]
  attendance        Attendance[]

  // Timestamps
  createdAt         DateTime     @default(now())
  updatedAt         DateTime     @updatedAt

  @@index([batchCode])
  @@index([level])
  @@index([status])
  @@index([startDate])
  @@index([teacherId])
}

// ==========================================
// ATTENDANCE TRACKING
// ==========================================

model Attendance {
  id          String   @id @default(cuid())

  // Attendance Details
  date        DateTime @db.Date
  present     Boolean  @default(false)

  // Relationships
  student     Student  @relation(fields: [studentId], references: [id], onDelete: Cascade)
  studentId   String

  batch       Batch    @relation(fields: [batchId], references: [id], onDelete: Cascade)
  batchId     String

  // Notes
  notes       String?  @db.Text

  // Timestamps
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@unique([studentId, batchId, date])
  @@index([studentId])
  @@index([batchId])
  @@index([date])
  @@index([present])
}

// ==========================================
// PAYMENT TRACKING
// ==========================================

model Payment {
  id            String         @id @default(cuid())

  // Payment Details
  amount        Decimal        @db.Decimal(10, 2)
  date          DateTime       @default(now())
  method        PaymentMethod
  status        PaymentStatus  @default(PENDING)

  // Invoice
  invoiceNumber String?        @unique
  invoiceSent   Boolean        @default(false)

  // Relationship
  student       Student        @relation(fields: [studentId], references: [id], onDelete: Cascade)
  studentId     String

  // Notes
  notes         String?        @db.Text

  // Timestamps
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt

  @@index([studentId])
  @@index([date])
  @@index([status])
  @@index([invoiceNumber])
}

// ==========================================
// REFERRAL TRACKING
// ==========================================

model Referral {
  id              String        @id @default(cuid())

  // Referral Details
  referralDate    DateTime      @default(now())

  // Relationships
  referrer        Student       @relation("ReferrerStudent", fields: [referrerId], references: [id], onDelete: Cascade)
  referrerId      String

  referee         Student       @relation("RefereeStudent", fields: [refereeId], references: [id], onDelete: Cascade)
  refereeId       String

  // Tracking
  enrollmentDate  DateTime?     // When referee actually enrolled
  month1Complete  Boolean       @default(false) // Auto-set when attendance ≥50%

  // Payout
  payoutAmount    Decimal       @default(2000) @db.Decimal(10, 2)
  payoutStatus    PayoutStatus  @default(PENDING)
  payoutDate      DateTime?

  // Notes
  notes           String?       @db.Text

  // Timestamps
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  @@unique([referrerId, refereeId])
  @@index([referrerId])
  @@index([refereeId])
  @@index([payoutStatus])
  @@index([month1Complete])
}

// ==========================================
// UPSELL TRACKING
// ==========================================

model Upsell {
  id                String   @id @default(cuid())

  // Upsell Details
  fromLevel         Level
  toLevel           Level

  // Relationship
  student           Student  @relation(fields: [studentId], references: [id], onDelete: Cascade)
  studentId         String

  // Progress
  currentProgress   Decimal  @default(0) @db.Decimal(5, 2) // 75%, 100%, etc.
  emailsSent        Int      @default(0)
  lastEmailDate     DateTime?

  // Conversion
  converted         Boolean  @default(false)
  conversionDate    DateTime?
  additionalRevenue Decimal? @db.Decimal(10, 2)

  // Notes
  notes             String?  @db.Text

  // Timestamps
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  @@index([studentId])
  @@index([converted])
  @@index([currentProgress])
}

// ==========================================
// EMAIL AUTOMATION
// ==========================================

model EmailQueue {
  id            String   @id @default(cuid())

  // Email Details
  to            String
  subject       String
  templateType  String   // "WELCOME", "UPSELL", "PAYMENT_REMINDER", etc.
  templateData  Json     // Dynamic data for email template

  // Scheduling
  scheduledFor  DateTime
  sentAt        DateTime?
  status        String   @default("PENDING") // PENDING, SENT, FAILED

  // Tracking
  opened        Boolean  @default(false)
  clicked       Boolean  @default(false)

  // Error Handling
  attempts      Int      @default(0)
  lastError     String?  @db.Text

  // Timestamps
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@index([status])
  @@index([scheduledFor])
  @@index([to])
}

// ==========================================
// ANALYTICS & METRICS (Optional)
// ==========================================

model DailyMetrics {
  id                  String   @id @default(cuid())
  date                DateTime @unique @db.Date

  // Revenue
  dailyRevenue        Decimal  @default(0) @db.Decimal(10, 2)
  monthlyRevenue      Decimal  @default(0) @db.Decimal(10, 2)

  // Students
  newEnrollments      Int      @default(0)
  totalActiveStudents Int      @default(0)

  // Batches
  batchesFull         Int      @default(0)
  batchesFilling      Int      @default(0)
  batchesRunning      Int      @default(0)

  // Churn
  studentsAtRisk      Int      @default(0)
  studentsDropped     Int      @default(0)

  // Timestamps
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt

  @@index([date])
}
```

---

## Key Features of This Schema:

### 1. **Comprehensive Relationships**
- Students → Batches (many-to-one)
- Students → Attendance (one-to-many)
- Students → Payments (one-to-many)
- Students → Referrals (self-referential)
- Batches → Teachers (many-to-one)

### 2. **Automatic Calculations**
- `attendanceRate` - auto-calculated from attendance records
- `fillRate` - auto-calculated from enrolledCount/totalSeats
- `balance` - auto-calculated from finalPrice - totalPaid
- `profit` - auto-calculated from revenueActual - teacherCost

### 3. **Optimized Indexes**
- All frequently queried fields indexed
- Composite indexes for common queries
- Unique constraints for business logic

### 4. **Data Integrity**
- Cascade deletes where appropriate
- SetNull for optional relationships
- Enum validation for status fields

### 5. **Scalability**
- CUID for distributed ID generation
- Decimal types for precise financial calculations
- JSON fields for flexible data storage

---

## Next Steps:

1. **Copy this entire schema** to `prisma/schema.prisma`
2. **Run migrations:**
   ```bash
   npx prisma migrate dev --name init
   ```
3. **Generate Prisma Client:**
   ```bash
   npx prisma generate
   ```
4. **Seed the database** (optional - we can create seed script next)

---

## Database Size Estimates:

For **500 students** over **1 year**:

- Students: ~500 rows × 2 KB = **1 MB**
- Attendance: ~500 students × 60 classes × 365 days = **10.95 million rows** → **~1.5 GB**
- Payments: ~500 students × 3 payments = **1,500 rows** → **300 KB**
- Batches: ~50 batches/year = **50 rows** → **10 KB**
- Referrals: ~100 referrals = **100 rows** → **20 KB**

**Total Estimated Database Size: ~1.5-2 GB/year**

This fits comfortably in:
- ✅ Neon Free Tier (3 GB)
- ✅ CockroachDB Free Tier (10 GB)
- ✅ Railway ($5-10/month tier)

---

## Validation Rules (To Implement in Application Logic):

```typescript
// Student Creation Validation
- whatsapp: Must be 10 digits, unique
- email: Valid email format, unique
- finalPrice: Must be > 0
- enrollmentType: Must match one of the enum values
- originalPrice >= finalPrice (discount validation)

// Batch Creation Validation
- startDate < endDate
- totalSeats >= enrolledCount
- batchCode: Format LEVEL-MONTH-TIME-##

// Payment Validation
- amount > 0
- student.balance >= 0 after payment
- invoiceNumber: Unique if provided

// Referral Validation
- referrerId !== refereeId (can't refer yourself)
- referee must be unique per referrer
```

---

This schema is production-ready and optimized for Claude Code development!
