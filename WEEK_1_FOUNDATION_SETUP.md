# Week 1: Foundation Setup - Complete Claude Code Prompts

## Overview
This week you'll set up the entire project foundation using Claude Code. Each section has a complete prompt you can copy-paste directly into Claude Code.

**Estimated Time:** 6-8 hours across 7 days
**Goal:** Working authentication, database connection, and project structure

---

## DAY 1: Project Initialization (1-2 hours)

### Prompt 1: Create Next.js Project with TypeScript

```
Create a new Next.js 14 project with the following specifications:

PROJECT NAME: plan-beta-dashboard

TECH STACK:
- Next.js 14 with App Router
- TypeScript (strict mode)
- Tailwind CSS
- ESLint + Prettier

INITIAL CONFIGURATION:
- Use `src/` directory structure
- Enable absolute imports with @ alias
- Configure Tailwind with custom colors:
  * Primary: #d2302c (Plan Beta red)
  * Secondary: #1e293b (dark slate)
  * Success: #10b981
  * Warning: #f59e0b
  * Error: #ef4444

FOLDER STRUCTURE:
src/
  ├── app/
  │   ├── (auth)/
  │   │   ├── login/
  │   │   └── layout.tsx
  │   ├── (dashboard)/
  │   │   ├── students/
  │   │   ├── batches/
  │   │   ├── attendance/
  │   │   ├── payments/
  │   │   └── layout.tsx
  │   ├── api/
  │   │   └── auth/
  │   ├── layout.tsx
  │   └── page.tsx
  ├── components/
  │   ├── ui/        # shadcn/ui components
  │   ├── forms/
  │   ├── layouts/
  │   └── shared/
  ├── lib/
  │   ├── prisma.ts
  │   ├── auth.ts
  │   └── utils.ts
  ├── types/
  │   └── index.ts
  └── hooks/
      └── index.ts

SCRIPTS IN package.json:
- dev: next dev
- build: next build
- start: next start
- lint: next lint
- format: prettier --write .

Create .env.example with placeholders:
- DATABASE_URL
- NEXTAUTH_SECRET
- NEXTAUTH_URL

Add .gitignore for:
- node_modules
- .next
- .env
- .env.local

Provide complete setup instructions in README.md
```

---

### Prompt 2: Install Dependencies

```
Install all required dependencies for the Plan Beta project:

DEPENDENCIES:
- @prisma/client (database ORM)
- next-auth (authentication)
- zod (validation)
- react-hook-form (forms)
- @hookform/resolvers (form validation)
- zustand (state management)
- @tanstack/react-query (data fetching)
- recharts (charts)
- date-fns (date utilities)
- clsx (conditional classes)
- tailwind-merge (tailwind utility)

DEV DEPENDENCIES:
- prisma (database tooling)
- @types/node
- @types/react
- @types/react-dom
- typescript
- eslint
- prettier
- prettier-plugin-tailwindcss

Run installation and verify package.json is updated
```

---

### Prompt 3: Install shadcn/ui

```
Set up shadcn/ui component library:

1. Initialize shadcn/ui with:
   - Style: Default
   - Base color: Slate
   - CSS variables: Yes

2. Install these components:
   - button
   - input
   - label
   - select
   - textarea
   - card
   - table
   - badge
   - dialog
   - dropdown-menu
   - form
   - toast
   - calendar
   - popover
   - tabs
   - alert

3. Customize theme in globals.css with Plan Beta colors:
   --primary: 0 72% 49% (red)
   --primary-foreground: 0 0% 100%

4. Update tailwind.config.ts to use CSS variables

Verify components are in components/ui/ directory
```

---

## DAY 2: Database Setup (1-2 hours)

### Prompt 4: Set Up Prisma

```
Configure Prisma ORM for PostgreSQL:

1. Initialize Prisma:
   npx prisma init

2. Update prisma/schema.prisma with the complete schema from PLAN_BETA_PRISMA_SCHEMA.md
   (Copy the entire schema from that file)

3. Create lib/prisma.ts with singleton pattern:
   - Export prisma client
   - Handle connection pooling
   - Add error handling
   - Include development logging

4. Update .env with:
   DATABASE_URL="postgresql://user:password@localhost:5432/planbeta"
   (This will be replaced with Neon URL later)

5. Add npm scripts:
   "db:generate": "prisma generate"
   "db:migrate": "prisma migrate dev"
   "db:push": "prisma db push"
   "db:studio": "prisma studio"
   "db:seed": "ts-node prisma/seed.ts"

Provide instructions for connecting to Neon database
```

---

### Prompt 5: Create Database Seed Script

```
Create a comprehensive seed script at prisma/seed.ts:

SEED DATA:

1. Users (4 total):
   - admin@planbeta.in (FOUNDER, password: Admin@123)
   - marketing@planbeta.in (MARKETING, password: Marketing@123)
   - teacher1@planbeta.in (TEACHER, password: Teacher@123)
   - teacher2@planbeta.in (TEACHER, password: Teacher@123)

2. Batches (3 total):
   - A1-JAN-EVE-01 (Level: A1, Start: 2025-01-15, Teacher: teacher1)
   - A2-JAN-MOR-01 (Level: A2, Start: 2025-01-20, Teacher: teacher2)
   - B1-FEB-EVE-01 (Level: B1, Start: 2025-02-01, Status: PLANNING)

3. Students (10 total):
   - 5 students in A1-JAN-EVE-01
   - 3 students in A2-JAN-MOR-01
   - 2 students not assigned (new enrollments)

   Student details should include:
   - Realistic names (Indian names)
   - Valid phone numbers (10 digits)
   - Email addresses
   - Mix of enrollment types
   - Various payment statuses
   - Some with referrals
   - Trial dates within last 30 days

4. Attendance records:
   - Last 10 days of attendance for enrolled students
   - Mix of present/absent (70-90% attendance rate)

5. Payments:
   - At least 1 payment per student
   - Mix of PAID, PARTIAL, PENDING statuses
   - Different payment methods

6. Referrals (2 total):
   - 1 completed (month1Complete: true, payoutStatus: PENDING)
   - 1 in progress (month1Complete: false)

Hash passwords using bcrypt

Include console.log statements showing what was seeded

Provide command: npm run db:seed
```

---

## DAY 3: Authentication Setup (2-3 hours)

### Prompt 6: Configure NextAuth.js

```
Set up NextAuth.js with credentials provider and role-based access:

1. Create app/api/auth/[...nextauth]/route.ts:

   PROVIDERS:
   - Credentials provider with email/password
   - Check against User table in database
   - Verify password with bcrypt

   CALLBACKS:
   - jwt: Add user role and id to token
   - session: Add user role and id to session

   PAGES:
   - signIn: '/login'
   - error: '/login'

   SESSION:
   - strategy: 'jwt'
   - maxAge: 7 days

2. Create lib/auth.ts with:
   - getServerSession() wrapper
   - requireAuth() middleware
   - requireRole() middleware for FOUNDER/MARKETING/TEACHER
   - getCurrentUser() helper

3. Create types/next-auth.d.ts to extend NextAuth types:
   - Add 'role' to User
   - Add 'id' and 'role' to Session

4. Create middleware.ts:
   - Protect all routes under /dashboard
   - Redirect to /login if not authenticated
   - Allow public routes: /, /login

5. Update .env:
   NEXTAUTH_SECRET="generate-random-secret-here"
   NEXTAUTH_URL="http://localhost:3000"

Provide testing instructions
```

---

### Prompt 7: Create Login Page

```
Build a beautiful login page at app/(auth)/login/page.tsx:

FEATURES:
- Email input with validation
- Password input with show/hide toggle
- "Remember me" checkbox
- Submit button with loading state
- Error message display (red alert)
- Success redirect to /dashboard

DESIGN:
- Centered card on gradient background
- Plan Beta logo at top (use /blogo.png from invoice project)
- Red primary color (#d2302c)
- Clean, modern UI with shadcn/ui components
- Mobile responsive

FORM VALIDATION:
- Email: required, valid email format
- Password: required, min 6 characters

BEHAVIOR:
- On success: redirect to /dashboard
- On error: show error message below form
- Disable button during submission
- Clear error on input change

Use react-hook-form + zod for validation
Use next-auth signIn() for authentication

Include demo credentials in a small note:
"Demo: admin@planbeta.in / Admin@123"
```

---

## DAY 4: Protected Layout & Navigation (1-2 hours)

### Prompt 8: Create Dashboard Layout

```
Build the main dashboard layout at app/(dashboard)/layout.tsx:

COMPONENTS TO CREATE:

1. DashboardLayout (main layout):
   - Top navbar with:
     * Plan Beta logo (left)
     * Current page title (center)
     * User menu dropdown (right): Name, Role, Logout
   - Sidebar navigation (left):
     * Dashboard (home icon)
     * Students (users icon)
     * Batches (layers icon)
     * Attendance (check-square icon)
     * Payments (credit-card icon)
     * Referrals (gift icon)
     * Analytics (bar-chart icon)
   - Main content area (right)
   - Mobile responsive (hamburger menu on mobile)

2. Sidebar should:
   - Highlight active route
   - Show role-based menu items:
     * FOUNDER: sees all
     * MARKETING: Dashboard, Students, Payments, Referrals, Analytics
     * TEACHER: Dashboard, Batches (only theirs), Attendance, Students (their batches)
   - Collapsible on desktop (toggle icon)
   - Drawer on mobile

3. Top navbar should:
   - Show current user name and role
   - Logout button calls signOut()
   - Breadcrumbs showing current location

STYLING:
- Use Plan Beta red (#d2302c) for active items
- Dark sidebar (#1e293b)
- White content area
- Smooth transitions

Use lucide-react for icons
Use shadcn/ui dropdown-menu for user menu
Implement role checking from session

Create empty placeholder pages for each route
```

---

### Prompt 9: Create Dashboard Home Page

```
Build the main dashboard home page at app/(dashboard)/page.tsx:

LAYOUT: 4 rows

ROW 1 - KEY METRICS (4 stat cards):
- Total Students (count active students)
- Active Batches (count running batches)
- This Month Revenue (sum of payments this month)
- Pending Payments (count overdue)

Each card should:
- Show big number in center
- Show label below
- Show trend indicator (% change from last month)
- Use different colors: blue, green, red, orange

ROW 2 - QUICK ACTIONS (4 buttons):
- "Add New Student" → /dashboard/students/new
- "Record Attendance" → /dashboard/attendance
- "Record Payment" → /dashboard/payments/new
- "View Analytics" → /dashboard/analytics

ROW 3 - RECENT ACTIVITY (table):
- Show last 10 activities (enrollments, payments, attendance)
- Columns: Date, Type, Student, Details, Action
- Click row to view details

ROW 4 - ALERTS (if any):
- Students missing 3+ classes
- Batches below 5 students (and starting soon)
- Overdue payments
- Each alert with [View] button

ROLE-BASED VIEWS:
- FOUNDER: sees everything
- MARKETING: sees students, payments, revenue
- TEACHER: sees only their batches, students, attendance

Fetch data using Prisma queries
Use shadcn/ui card, table, button components
Show loading skeleton while fetching

Add empty states with nice illustrations
```

---

## DAY 5: Utilities & Helpers (1 hour)

### Prompt 10: Create Utility Functions

```
Create comprehensive utility functions in lib/utils.ts:

UTILITY FUNCTIONS:

1. Date Utilities:
   - formatDate(date: Date, format?: string): string
   - getRelativeTime(date: Date): string // "2 days ago"
   - isToday(date: Date): boolean
   - isThisWeek(date: Date): boolean
   - getDateRange(type: 'week' | 'month' | 'year'): {start: Date, end: Date}

2. Currency Utilities:
   - formatCurrency(amount: number, currency?: 'INR' | 'EUR'): string
   - calculateDiscount(original: number, discount: number): number
   - calculatePercentage(value: number, total: number): number

3. Student Utilities:
   - generateStudentId(): string // Format: YYYY-MM-XXX
   - calculateAttendanceRate(attended: number, total: number): number
   - determineChurnRisk(attendance: number, daysSinceLastClass: number): ChurnRisk

4. Batch Utilities:
   - generateBatchCode(level: Level, startDate: Date): string
   - calculateFillRate(enrolled: number, total: number): number
   - calculateProfit(revenue: number, teacherCost: number): number

5. Validation Utilities:
   - validatePhone(phone: string): boolean
   - validateEmail(email: string): boolean
   - sanitizeInput(input: string): string

6. Array Utilities:
   - groupBy<T>(array: T[], key: keyof T): Record<string, T[]>
   - sortBy<T>(array: T[], key: keyof T, order?: 'asc' | 'desc'): T[]

7. Tailwind Utility:
   - cn(...classes): string // Merge tailwind classes

Use date-fns for date operations
Use clsx + tailwind-merge for cn()
Export all functions with TypeScript types

Include unit tests using Vitest
```

---

### Prompt 11: Create TypeScript Types

```
Create comprehensive TypeScript types in types/index.ts:

TYPES TO CREATE:

1. Database Types (export Prisma types):
   - Student, Batch, Attendance, Payment, Referral, User
   - All enum types

2. Form Input Types (for react-hook-form):
   - StudentFormInput
   - BatchFormInput
   - AttendanceFormInput
   - PaymentFormInput
   - LoginFormInput

3. API Response Types:
   - ApiResponse<T> { success: boolean, data?: T, error?: string }
   - PaginatedResponse<T> { data: T[], total: number, page: number, limit: number }

4. Filter Types:
   - StudentFilters
   - BatchFilters
   - PaymentFilters

5. Dashboard Types:
   - DashboardMetrics
   - RecentActivity
   - Alert

6. Session Extended Types (already in next-auth.d.ts):
   - Session with user.role
   - User with role

Use Zod schemas to infer types where possible
Export all types from single file

Create zod schemas in separate file: lib/schemas.ts for:
- loginSchema
- studentSchema
- batchSchema
- attendanceSchema
- paymentSchema
```

---

## DAY 6: State Management & Data Fetching (1 hour)

### Prompt 12: Set Up React Query

```
Configure TanStack Query (React Query) for data fetching:

1. Create app/providers.tsx:
   - Wrap app with QueryClientProvider
   - Configure query client with:
     * defaultOptions: staleTime 5 minutes
     * refetchOnWindowFocus: true
     * retry: 1

2. Update app/layout.tsx to use Providers

3. Create hooks for common queries in hooks/useQueries.ts:

   QUERY HOOKS:
   - useStudents(filters?: StudentFilters)
   - useStudent(id: string)
   - useBatches(filters?: BatchFilters)
   - useBatch(id: string)
   - usePayments(filters?: PaymentFilters)
   - useAttendance(batchId: string, date: Date)
   - useDashboardMetrics()

4. Create hooks for mutations in hooks/useMutations.ts:

   MUTATION HOOKS:
   - useCreateStudent()
   - useUpdateStudent()
   - useDeleteStudent()
   - useCreateBatch()
   - useRecordAttendance()
   - useRecordPayment()

Each hook should:
- Use proper TypeScript types
- Handle loading and error states
- Invalidate related queries on success
- Show toast on success/error

Use axios for API calls
Create api client in lib/api.ts
```

---

### Prompt 13: Set Up Zustand Stores

```
Create Zustand stores for global state:

1. Create stores/authStore.ts:
   - user: User | null
   - isAuthenticated: boolean
   - setUser(user: User): void
   - logout(): void

2. Create stores/uiStore.ts:
   - sidebarOpen: boolean
   - toggleSidebar(): void
   - setSidebarOpen(open: boolean): void

3. Create stores/filterStore.ts:
   - studentFilters: StudentFilters
   - batchFilters: BatchFilters
   - paymentFilters: PaymentFilters
   - setStudentFilters(filters: StudentFilters): void
   - resetStudentFilters(): void
   - (similar for batch and payment)

Each store should:
- Use TypeScript
- Persist to localStorage where needed (use zustand/middleware)
- Export typed hooks

Create hooks/useStores.ts to export all stores:
- useAuthStore()
- useUIStore()
- useFilterStore()
```

---

## DAY 7: Testing & Documentation (1 hour)

### Prompt 14: Set Up Testing

```
Configure testing framework with Vitest:

1. Install test dependencies:
   - vitest
   - @testing-library/react
   - @testing-library/jest-dom
   - @vitejs/plugin-react

2. Create vitest.config.ts with:
   - React plugin
   - Test environment: jsdom
   - Setup files
   - Coverage settings

3. Create test/setup.ts:
   - Import @testing-library/jest-dom
   - Mock next/navigation
   - Mock next-auth

4. Create example tests:
   - __tests__/utils.test.ts (test utility functions)
   - __tests__/components/Button.test.tsx (test shadcn button)

5. Add test scripts to package.json:
   - "test": "vitest"
   - "test:ui": "vitest --ui"
   - "test:coverage": "vitest --coverage"

Provide testing guidelines and examples
```

---

### Prompt 15: Create Documentation

```
Create comprehensive documentation in docs/ folder:

1. docs/SETUP.md:
   - Prerequisites (Node.js, npm, database)
   - Installation steps
   - Environment variables
   - Running the project
   - Common issues and solutions

2. docs/ARCHITECTURE.md:
   - Project structure explanation
   - Tech stack overview
   - Database schema diagram (use Mermaid)
   - Authentication flow
   - Data flow diagram

3. docs/API.md:
   - List all API endpoints
   - Request/response examples
   - Authentication requirements
   - Error handling

4. docs/DEVELOPMENT.md:
   - Code style guide
   - Component structure
   - State management patterns
   - Testing guidelines
   - Git workflow

5. Update main README.md with:
   - Project overview
   - Quick start guide
   - Link to detailed docs
   - Development roadmap
   - Contributing guidelines

Use clear formatting with code blocks and examples
Include screenshots or diagrams where helpful
```

---

## VERIFICATION CHECKLIST

After completing all prompts, verify:

- [ ] ✅ Next.js project runs (`npm run dev`)
- [ ] ✅ Database connection works (can run Prisma Studio)
- [ ] ✅ Seed data populates successfully
- [ ] ✅ Login page works with demo credentials
- [ ] ✅ Dashboard layout renders with navigation
- [ ] ✅ All routes are protected (redirect to login)
- [ ] ✅ Role-based menus show correctly
- [ ] ✅ Dashboard metrics display (even if hardcoded)
- [ ] ✅ No TypeScript errors (`npm run build`)
- [ ] ✅ Tests pass (`npm test`)

---

## DELIVERABLES BY END OF WEEK 1

1. ✅ Working Next.js application
2. ✅ Database connected with all tables created
3. ✅ Authentication system (login/logout)
4. ✅ Protected dashboard layout with navigation
5. ✅ Dashboard home page with metrics
6. ✅ All utility functions and types
7. ✅ React Query and Zustand configured
8. ✅ Complete documentation

**You're now ready to build features in Week 2!**

---

## ESTIMATED COSTS (Week 1)

- **Development:** FREE (use local PostgreSQL or Neon free tier)
- **Time:** 6-8 hours total
- **Coffee:** ☕️☕️☕️ (priceless)

---

## NEXT WEEK PREVIEW

**Week 2: Student Enrollment Module**
- Student list with filters/search
- Add new student form
- Edit student details
- Student detail view
- Payment history
- Attendance tracking

Stay tuned for WEEK_2_STUDENT_MODULE.md! 🚀
