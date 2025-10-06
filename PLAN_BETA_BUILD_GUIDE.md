# Plan Beta School Management System - Complete Build Guide

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Quick Start](#quick-start)
3. [Tech Stack](#tech-stack)
4. [Development Roadmap](#development-roadmap)
5. [Cost Breakdown](#cost-breakdown)
6. [File Structure](#file-structure)
7. [Resources](#resources)

---

## Project Overview

**Goal:** Build a comprehensive school management system for Plan Beta School of German with zero monthly SaaS fees.

**Features:**
- Student enrollment & management
- Batch creation & monitoring
- Attendance tracking
- Payment processing
- Referral system
- Analytics dashboards
- Email automation

**Build Time:** 8 weeks (6-8 hours/week)

**Monthly Cost:** ₹1,500-4,000 ($19-49)

---

## Quick Start

### Prerequisites

```bash
# Install Node.js 18+ (check version)
node --version  # Should be v18.0.0 or higher

# Install Git
git --version

# Get database ready (choose one):
# Option 1: Neon (recommended) - sign up at neon.tech
# Option 2: Local PostgreSQL - install from postgresql.org
```

### Initial Setup (5 minutes)

```bash
# 1. Create new directory
mkdir plan-beta-dashboard
cd plan-beta-dashboard

# 2. Initialize Git
git init
git branch -M main

# 3. Create GitHub repository (optional but recommended)
# Go to github.com/new and create repo
git remote add origin https://github.com/yourusername/plan-beta-dashboard.git

# 4. You're ready to use Claude Code!
# Open this folder in Claude Code and start with Week 1 prompts
```

---

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library

### Backend
- **Next.js API Routes** - Serverless functions
- **Prisma** - Database ORM
- **Neon** - PostgreSQL database

### Authentication
- **NextAuth.js** - Auth solution

### State Management
- **Zustand** - Global state
- **TanStack Query** - Server state

### Email
- **Resend** - Transactional emails

### Deployment
- **Vercel** - Frontend & backend (free)
- **Neon** - Database ($19/month)

---

## Development Roadmap

### Week 1: Foundation (6-8 hours) ✅
**Deliverables:**
- Project initialized with Next.js + TypeScript
- Database schema created (all tables)
- Authentication working (login/logout)
- Protected dashboard layout
- Basic navigation

**Files to Use:**
- `WEEK_1_FOUNDATION_SETUP.md` - Complete prompts
- `PLAN_BETA_PRISMA_SCHEMA.md` - Database schema

### Week 2: Student Module (6-8 hours)
**Deliverables:**
- Student list with filters
- Add new student form
- Edit student details
- Student detail view
- Search & pagination

**Coming:** `WEEK_2_STUDENT_MODULE.md`

### Week 3: Attendance Module (4-6 hours)
**Deliverables:**
- Teacher attendance form
- Daily attendance marking
- Attendance reports
- Student attendance history
- Churn risk calculation

### Week 4: Batch & Payment (6-8 hours)
**Deliverables:**
- Batch creation form
- Batch dashboard
- Fill rate monitoring
- Payment recording
- Payment tracking
- Overdue alerts

### Week 5: Referral System (4-6 hours)
**Deliverables:**
- Referral registration
- Payout tracking
- Referral analytics
- Leaderboard

### Week 6: Dashboards (6-8 hours)
**Deliverables:**
- Executive dashboard
- Marketing dashboard
- Teacher dashboard
- Analytics charts

### Week 7: Email Automation (4-6 hours)
**Deliverables:**
- Email templates (7 types)
- Automated triggers
- Email queue system
- Performance tracking

### Week 8: Polish & Deploy (4-6 hours)
**Deliverables:**
- Bug fixes
- Performance optimization
- Production deployment
- User testing

---

## Cost Breakdown

### Development Phase (Weeks 1-8)

| Item | Cost |
|------|------|
| Neon Database (Free Tier) | ₹0 |
| Vercel (Free Tier) | ₹0 |
| Resend (Free Tier) | ₹0 |
| Domain (optional) | ₹800/year |
| **Total** | **₹0-800** |

### Production Phase (After Launch)

| Item | Monthly Cost |
|------|--------------|
| Neon Database (Pro) | ₹1,500 ($19) |
| Vercel (Free) | ₹0 |
| Resend (Starter) | ₹500 ($6) |
| **Total** | **₹2,000/month** |

### Scaling (500+ students)

| Item | Monthly Cost |
|------|--------------|
| Neon Database (Scale) | ₹2,500 ($29-39) |
| Vercel (Pro) | ₹1,600 ($20) |
| Resend (Starter) | ₹500 ($6) |
| **Total** | **₹4,600/month** |

**Compare to SaaS:**
- Teachmint: ₹15,000-50,000/month
- Classplus: ₹20,000-60,000/month
- **Savings: ₹10,000-55,000/month** 🎉

---

## File Structure

```
plan-beta-dashboard/
├── .env.example
├── .env.local (create this, add to .gitignore)
├── .gitignore
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
├── README.md
│
├── prisma/
│   ├── schema.prisma (from PLAN_BETA_PRISMA_SCHEMA.md)
│   ├── seed.ts
│   └── migrations/
│
├── public/
│   ├── blogo.png (Plan Beta logo)
│   └── ...
│
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── (dashboard)/
│   │   │   ├── students/
│   │   │   │   ├── page.tsx (list)
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx (add)
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx (view)
│   │   │   │       └── edit/
│   │   │   │           └── page.tsx
│   │   │   │
│   │   │   ├── batches/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/
│   │   │   │   └── [id]/
│   │   │   │
│   │   │   ├── attendance/
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── payments/
│   │   │   │   ├── page.tsx
│   │   │   │   └── new/
│   │   │   │
│   │   │   ├── referrals/
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── analytics/
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── page.tsx (dashboard home)
│   │   │   └── layout.tsx
│   │   │
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.ts
│   │   │   │
│   │   │   ├── students/
│   │   │   │   ├── route.ts (GET, POST)
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts (GET, PUT, DELETE)
│   │   │   │
│   │   │   ├── batches/
│   │   │   ├── attendance/
│   │   │   ├── payments/
│   │   │   └── referrals/
│   │   │
│   │   ├── layout.tsx (root)
│   │   ├── page.tsx (landing page)
│   │   ├── providers.tsx (React Query, etc.)
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── ui/ (shadcn components)
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   └── ...
│   │   │
│   │   ├── layouts/
│   │   │   ├── DashboardLayout.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   │
│   │   ├── forms/
│   │   │   ├── StudentForm.tsx
│   │   │   ├── BatchForm.tsx
│   │   │   └── ...
│   │   │
│   │   ├── shared/
│   │   │   ├── DataTable.tsx
│   │   │   ├── StatCard.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   └── ...
│   │   │
│   │   └── charts/
│   │       ├── RevenueChart.tsx
│   │       └── ...
│   │
│   ├── lib/
│   │   ├── prisma.ts (database client)
│   │   ├── auth.ts (auth helpers)
│   │   ├── utils.ts (utility functions)
│   │   ├── schemas.ts (Zod schemas)
│   │   └── api.ts (API client)
│   │
│   ├── hooks/
│   │   ├── useQueries.ts
│   │   ├── useMutations.ts
│   │   └── useStores.ts
│   │
│   ├── stores/
│   │   ├── authStore.ts
│   │   ├── uiStore.ts
│   │   └── filterStore.ts
│   │
│   └── types/
│       ├── index.ts
│       └── next-auth.d.ts
│
├── docs/ (documentation)
│   ├── SETUP.md
│   ├── ARCHITECTURE.md
│   ├── API.md
│   └── DEVELOPMENT.md
│
└── __tests__/ (tests)
    ├── utils.test.ts
    └── components/
```

---

## Resources

### Documentation Files

1. **PLAN_BETA_PRISMA_SCHEMA.md**
   - Complete database schema
   - All tables & relationships
   - Validation rules
   - Ready to copy-paste

2. **WEEK_1_FOUNDATION_SETUP.md**
   - 15 detailed Claude Code prompts
   - Day-by-day breakdown
   - Verification checklist
   - Deliverables

3. **UI_SPECIFICATIONS.md**
   - Complete design system
   - Component specifications
   - Layout examples
   - Accessibility guidelines

4. **DEPLOYMENT.md** (from invoice project)
   - Vercel deployment
   - Environment variables
   - Email setup

### External Resources

#### Learning
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com/docs)

#### Tools
- [Neon Console](https://console.neon.tech)
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Resend Dashboard](https://resend.com/dashboard)

#### Design
- [Lucide Icons](https://lucide.dev)
- [Coolors](https://coolors.co) - Color palettes
- [Figma](https://figma.com) - UI mockups (optional)

---

## Development Workflow

### Daily Workflow

1. **Open Claude Code**
2. **Select next prompt** from WEEK_X_XXX.md
3. **Copy-paste prompt** into Claude Code
4. **Review generated code**
5. **Test functionality**
6. **Commit to Git**

```bash
git add .
git commit -m "feat: add student list page"
git push origin main
```

### Testing Workflow

```bash
# Run development server
npm run dev

# Open http://localhost:3000

# Test new feature

# Run tests (if any)
npm test

# Check TypeScript
npm run build
```

### Weekly Workflow

1. **Monday:** Plan week's tasks
2. **Tuesday-Friday:** Build features (2 hours/day)
3. **Saturday:** Testing & bug fixes
4. **Sunday:** Documentation & review

---

## Best Practices

### 1. Git Commits

```bash
# Use conventional commits
git commit -m "feat: add student enrollment form"
git commit -m "fix: attendance calculation bug"
git commit -m "docs: update README"
git commit -m "refactor: optimize database queries"
```

### 2. Code Style

- Use TypeScript strict mode
- Follow Next.js conventions
- Use Tailwind classes (not inline styles)
- Extract reusable components
- Add comments for complex logic

### 3. Database

- Always use Prisma Client
- Use transactions for multiple operations
- Add indexes to frequently queried fields
- Run migrations before deployment

```bash
# Create migration
npx prisma migrate dev --name add_students_table

# Generate Prisma Client
npx prisma generate

# Open Prisma Studio
npx prisma studio
```

### 4. API Routes

- Validate inputs with Zod
- Handle errors gracefully
- Return consistent response format
- Use proper HTTP status codes
- Add authentication middleware

### 5. Testing

- Test critical user flows
- Test form validations
- Test database operations
- Test API endpoints

---

## Common Issues & Solutions

### Issue: Database connection error

```
Error: Can't reach database server
```

**Solution:**
1. Check DATABASE_URL in .env.local
2. Verify Neon database is running
3. Check network connection
4. Regenerate Prisma Client: `npx prisma generate`

### Issue: Authentication not working

```
Error: NEXTAUTH_SECRET is not set
```

**Solution:**
1. Generate secret: `openssl rand -base64 32`
2. Add to .env.local: `NEXTAUTH_SECRET="your-secret"`
3. Restart dev server

### Issue: Build errors

```
Type error: Property 'x' does not exist
```

**Solution:**
1. Check TypeScript types
2. Run `npm run build` to see all errors
3. Fix types in types/index.ts
4. Regenerate Prisma Client

### Issue: Styles not applying

```
Tailwind classes not working
```

**Solution:**
1. Verify Tailwind config
2. Check globals.css imports
3. Restart dev server
4. Clear .next cache: `rm -rf .next`

---

## Deployment Checklist

### Pre-Deployment

- [ ] All tests passing
- [ ] No TypeScript errors (`npm run build`)
- [ ] Environment variables documented
- [ ] Database migrations up to date
- [ ] Seed data tested
- [ ] Error handling in place
- [ ] Loading states implemented
- [ ] Mobile responsive tested

### Deployment

- [ ] Create Neon database (production)
- [ ] Deploy to Vercel
- [ ] Set environment variables in Vercel
- [ ] Run database migrations
- [ ] Seed initial data
- [ ] Test authentication
- [ ] Test all major flows
- [ ] Set up custom domain (optional)

### Post-Deployment

- [ ] Monitor error logs
- [ ] Check performance metrics
- [ ] Test email delivery
- [ ] Backup database
- [ ] Document API endpoints
- [ ] Train users

---

## Support & Community

### Getting Help

1. **Claude Code:** Ask follow-up questions
2. **Documentation:** Check docs/ folder
3. **Stack Overflow:** Search for Next.js/Prisma issues
4. **GitHub Issues:** Check framework issues
5. **Discord:** Join Next.js/Prisma communities

### Contributing

This is your internal tool, but you can:
- Document lessons learned
- Share reusable components
- Create templates for future projects
- Build plugins/extensions

---

## Next Steps

**You're ready to start building!** 🚀

1. ✅ Read this guide
2. ✅ Set up prerequisites (Node.js, Git)
3. ✅ Sign up for Neon account
4. 📝 **Open WEEK_1_FOUNDATION_SETUP.md**
5. 💻 **Start with Prompt 1**
6. 🎉 **Build your custom system!**

---

**Questions?** Open this guide in Claude Code and ask away!

**Ready to build?** Let's go! 💪

---

*Last Updated: 2025-01-05*
*Version: 1.0.0*
*Author: Built with Claude Code*
