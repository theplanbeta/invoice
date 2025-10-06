# UI/UX Specifications for Plan Beta Dashboard

## Design System

### Color Palette

```css
/* Primary Colors */
--primary: #d2302c          /* Plan Beta Red */
--primary-dark: #b82824    /* Darker Red for hovers */
--primary-light: #fee2e2   /* Light Red for backgrounds */

/* Neutral Colors */
--background: #ffffff       /* White */
--foreground: #0f172a      /* Almost Black */
--muted: #f1f5f9          /* Light Gray */
--muted-foreground: #64748b /* Gray Text */

/* Semantic Colors */
--success: #10b981         /* Green */
--warning: #f59e0b         /* Orange */
--error: #ef4444           /* Red */
--info: #3b82f6            /* Blue */

/* Dashboard */
--sidebar-bg: #1e293b      /* Dark Slate */
--sidebar-active: #d2302c  /* Red */
```

### Typography

```css
/* Font Family */
font-family: 'Inter', system-ui, sans-serif;

/* Font Sizes */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Spacing

```css
/* Use Tailwind spacing scale */
4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px
```

### Border Radius

```css
--radius-sm: 0.375rem;  /* 6px */
--radius-md: 0.5rem;    /* 8px */
--radius-lg: 0.75rem;   /* 12px */
--radius-xl: 1rem;      /* 16px */
```

---

## Component Specifications

### 1. Dashboard Layout

```
┌─────────────────────────────────────────────────────────────┐
│  [Logo] Plan Beta          Dashboard         [User Menu]▼   │
├──────────┬──────────────────────────────────────────────────┤
│          │                                                   │
│  [📊] Dashboard                                              │
│  [👥] Students            MAIN CONTENT AREA                  │
│  [📚] Batches                                                │
│  [✅] Attendance                                             │
│  [💳] Payments                                               │
│  [🎁] Referrals                                              │
│  [📈] Analytics                                              │
│          │                                                   │
│  SIDEBAR │                                                   │
│  256px   │                                                   │
│          │                                                   │
└──────────┴──────────────────────────────────────────────────┘

SIDEBAR:
- Width: 256px (desktop), 100% (mobile drawer)
- Background: #1e293b
- Active item: #d2302c background + white text
- Inactive item: gray text, hover: lighter gray
- Icons: lucide-react (20px)
- Text: 14px, medium weight
- Collapse button at bottom

TOP NAVBAR:
- Height: 64px
- Background: white
- Border bottom: 1px solid #e2e8f0
- Logo: 40px height
- User menu: right aligned, dropdown with avatar

CONTENT AREA:
- Padding: 24px
- Max width: 1400px (centered)
- Background: #f8fafc
```

### 2. Stat Card Component

```typescript
interface StatCardProps {
  title: string;
  value: string | number;
  trend?: {
    value: number;  // e.g., 12
    direction: 'up' | 'down';
  };
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'red' | 'orange';
}
```

**Visual Design:**
```
┌───────────────────────────────┐
│  [Icon]          +12% ↑       │
│                                │
│  1,234                         │
│  Total Students                │
└───────────────────────────────┘
```

**Specifications:**
- Width: flex (25% on desktop, 100% mobile)
- Height: 120px
- Background: white
- Border: 1px solid #e2e8f0
- Border radius: 12px
- Padding: 20px
- Icon: 32px, colored based on `color` prop
- Value: 36px, bold, #0f172a
- Title: 14px, medium, #64748b
- Trend: 12px, green/red based on direction
- Shadow: subtle (0 1px 3px rgba(0,0,0,0.1))
- Hover: scale(1.02) + deeper shadow

### 3. Data Table Component

```typescript
interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
  loading?: boolean;
  emptyMessage?: string;
}
```

**Visual Design:**
```
┌─────────────────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Search: [___________]  [Filter ▼] [Add New +]          │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Name ↕      │ Level  │ Batch  │ Status  │ Actions      │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ John Doe    │ A1     │ A1-... │ [✓ Active] │ [•••]   │ │
│ │ Jane Smith  │ A2     │ A2-... │ [⏸ Paused] │ [•••]   │ │
│ │ ...         │ ...    │ ...    │ ...       │ ...      │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ Showing 1-20 of 156      [← 1 2 3 ... 8 →]                 │
└─────────────────────────────────────────────────────────────┘
```

**Specifications:**
- Background: white
- Border: 1px solid #e2e8f0
- Border radius: 12px
- Header row: #f8fafc background, 14px semibold
- Data row: 14px normal, #0f172a
- Row hover: #f8fafc background
- Row height: 56px
- Padding: 16px
- Sortable columns: show ↕ icon, click to sort
- Status badges: colored pills (green/yellow/red)
- Actions menu: three dots, opens dropdown
- Empty state: centered illustration + message
- Loading state: skeleton loaders

### 4. Form Components

#### Text Input

```
Label *
┌─────────────────────────────────┐
│ Enter value...                  │
└─────────────────────────────────┘
Helper text or error message
```

**Specifications:**
- Label: 14px, semibold, #0f172a
- Required asterisk: #ef4444
- Input: 40px height, 16px padding, #e2e8f0 border
- Focus: #d2302c border, ring shadow
- Error: #ef4444 border, error text below
- Disabled: #f1f5f9 background, cursor-not-allowed

#### Select Dropdown

```
Label *
┌─────────────────────────────────┐
│ Select option...             ▼  │
└─────────────────────────────────┘
```

**Same styling as text input**
- Dropdown opens below
- Options: hover background #f8fafc
- Selected: #d2302c background

#### Textarea

```
Label *
┌─────────────────────────────────┐
│ Enter description...            │
│                                 │
│                                 │
└─────────────────────────────────┘
Character count: 0/500
```

**Same styling, min-height: 120px**

#### Checkbox

```
☐ Label text
```

**Specifications:**
- Size: 20px
- Border: 2px solid #e2e8f0
- Checked: #d2302c background, white checkmark
- Label: 14px, #0f172a

#### Radio Button

```
○ Option 1
○ Option 2
● Option 3 (selected)
```

**Same as checkbox, circular**

### 5. Button Component

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}
```

**Variants:**

```
PRIMARY:
┌───────────────┐
│ [+] Add New   │  (Red background, white text)
└───────────────┘

SECONDARY:
┌───────────────┐
│ Cancel        │  (Gray background, dark text)
└───────────────┘

OUTLINE:
┌───────────────┐
│ Edit          │  (White background, red border)
└───────────────┘

GHOST:
┌───────────────┐
│ View Details  │  (Transparent, text only)
└───────────────┘

DANGER:
┌───────────────┐
│ Delete        │  (Red background, white text)
└───────────────┘
```

**Sizes:**
- Small: 32px height, 12px padding, 14px text
- Medium: 40px height, 16px padding, 14px text
- Large: 48px height, 20px padding, 16px text

**States:**
- Hover: Darken 10%
- Active: Darken 20%
- Loading: Show spinner, disable clicks
- Disabled: 50% opacity, cursor-not-allowed

### 6. Badge Component

```typescript
interface BadgeProps {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'default';
  children: React.ReactNode;
}
```

**Visual:**
```
[✓ Active]  [⏸ Paused]  [✗ Inactive]  [• Pending]
Green       Yellow      Red          Gray
```

**Specifications:**
- Height: 24px
- Padding: 4px 12px
- Border radius: 12px (pill)
- Font: 12px, medium
- Icon: 14px (optional)

### 7. Modal/Dialog Component

```
┌─────────────────────────────────────────────┐
│  Add New Student                        [×] │
├─────────────────────────────────────────────┤
│                                             │
│  [Form content here]                        │
│                                             │
│                                             │
├─────────────────────────────────────────────┤
│                    [Cancel] [Save Changes]  │
└─────────────────────────────────────────────┘
```

**Specifications:**
- Max width: 600px
- Background: white
- Border radius: 16px
- Padding: 24px
- Overlay: rgba(0,0,0,0.5)
- Header: 20px semibold
- Footer: right-aligned buttons
- Close button: top-right, 24px
- Animate: fade + scale in

### 8. Alert/Toast Component

```
┌──────────────────────────────────────────┐
│ ✓ Student added successfully!        [×] │
└──────────────────────────────────────────┘
Green background
```

**Specifications:**
- Position: top-right, fixed
- Width: 350px
- Height: auto (min 60px)
- Background: based on variant
- Border radius: 8px
- Padding: 16px
- Icon: 20px
- Auto-dismiss: 3 seconds
- Animate: slide in from right

---

## Page-Specific Layouts

### Student List Page

```
┌─────────────────────────────────────────────────────────────┐
│ Students                                        [+ Add New]  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ ┌──────────────────────────────────────────────────────────┐│
│ │ [Search] [Level ▼] [Batch ▼] [Status ▼] [Clear Filters] ││
│ └──────────────────────────────────────────────────────────┘│
│                                                              │
│ ┌──────────────────────────────────────────────────────────┐│
│ │ Name       │Level│Batch  │Payment│Attendance│Churn│Actions││
│ ├──────────────────────────────────────────────────────────┤│
│ │ Raj Kumar  │ A1  │A1-... │Paid   │ 85%      │Low  │[•••] ││
│ │ ...        │ ... │...    │...    │...       │...  │...   ││
│ └──────────────────────────────────────────────────────────┘│
│                                                              │
│ Showing 1-20 of 156                [← 1 2 3 ... →]          │
└─────────────────────────────────────────────────────────────┘
```

### Add/Edit Student Form

```
┌─────────────────────────────────────────────────────────────┐
│ ← Back to Students                                           │
│                                                              │
│ Add New Student                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ PERSONAL INFORMATION                                         │
│ ┌──────────────────────┐ ┌──────────────────────┐         │
│ │ Name *               │ │ WhatsApp *           │         │
│ └──────────────────────┘ └──────────────────────┘         │
│ ┌──────────────────────┐                                   │
│ │ Email                │                                   │
│ └──────────────────────┘                                   │
│                                                              │
│ ENROLLMENT DETAILS                                           │
│ ┌──────────────────────┐ ┌──────────────────────┐         │
│ │ Current Level ▼      │ │ Enrollment Type ▼    │         │
│ └──────────────────────┘ └──────────────────────┘         │
│ ┌──────────────────────┐                                   │
│ │ Assign to Batch ▼    │                                   │
│ └──────────────────────┘                                   │
│                                                              │
│ PRICING                                                      │
│ ┌──────────────────────┐ ┌──────────────────────┐         │
│ │ Original Price       │ │ Discount Applied     │         │
│ │ (auto-filled)        │ │                      │         │
│ └──────────────────────┘ └──────────────────────┘         │
│ ┌──────────────────────┐                                   │
│ │ Final Price          │                                   │
│ │ (calculated)         │                                   │
│ └──────────────────────┘                                   │
│                                                              │
│ [Continue to Payment →]                                      │
└─────────────────────────────────────────────────────────────┘
```

**Multi-step form:**
1. Personal Info
2. Enrollment Details
3. Pricing
4. Payment
5. Referral (if applicable)
6. Review & Submit

### Dashboard Home

```
┌─────────────────────────────────────────────────────────────┐
│ Dashboard                                                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ KEY METRICS                                                  │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│ │  [👥]    │ │  [📚]    │ │  [💰]    │ │  [⚠️]     │       │
│ │  1,234   │ │  45      │ │ ₹2.4L    │ │  12      │       │
│ │ Students │ │ Batches  │ │ Revenue  │ │ Overdue  │       │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
│                                                              │
│ QUICK ACTIONS                                                │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        │
│ │ + Add Student│ │ ✓ Attendance│ │ 💳 Payment   │        │
│ └──────────────┘ └──────────────┘ └──────────────┘        │
│                                                              │
│ RECENT ACTIVITY                                              │
│ ┌────────────────────────────────────────────────┐         │
│ │ Today, 2:30 PM - New enrollment: Raj Kumar    │         │
│ │ Today, 1:15 PM - Payment received: ₹14,000    │         │
│ │ Yesterday - Attendance marked: A1-JAN-EVE-01  │         │
│ └────────────────────────────────────────────────┘         │
│                                                              │
│ ALERTS                                                       │
│ ┌────────────────────────────────────────────────┐         │
│ │ ⚠️ 3 students missing 3+ classes              │         │
│ │ 📚 Batch A1-FEB has only 4 students (starts in 5 days) │ │
│ │ 💰 12 payments overdue                        │         │
│ └────────────────────────────────────────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

---

## Mobile Responsiveness

### Breakpoints

```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
```

### Mobile Adaptations

1. **Sidebar:**
   - Hidden by default
   - Hamburger menu in top-left
   - Full-screen drawer on open
   - Swipe to close

2. **Tables:**
   - Horizontal scroll
   - Sticky first column
   - Reduced font size (12px)
   - Or convert to card view

3. **Forms:**
   - Single column
   - Larger touch targets (48px minimum)
   - Full-width inputs

4. **Stat Cards:**
   - Stack vertically
   - Full width

5. **Modals:**
   - Full screen on mobile
   - Slide up animation

---

## Accessibility

### Requirements

- ✅ All interactive elements keyboard accessible
- ✅ Tab order logical
- ✅ Focus indicators visible (2px #d2302c outline)
- ✅ Alt text for images
- ✅ ARIA labels where needed
- ✅ Color contrast ratio ≥ 4.5:1
- ✅ Form errors announced to screen readers
- ✅ Loading states announced

### Screen Reader Support

- Use semantic HTML (header, nav, main, footer)
- Label all form inputs
- Announce dynamic content changes
- Provide skip links

---

## Animation Guidelines

### Transitions

```css
/* Default transition */
transition: all 0.2s ease-in-out;

/* Hover effects */
transition: transform 0.15s ease-in-out;

/* Color changes */
transition: background-color 0.2s ease-in-out;
```

### Loading States

- **Skeleton loaders** for content (pulse animation)
- **Spinners** for buttons (rotate animation)
- **Progress bars** for multi-step processes

### Page Transitions

- Fade in new content (200ms)
- Slide in modals (300ms)
- Toast notifications slide from right (250ms)

---

This UI specification ensures consistency across the entire application and provides clear guidelines for Claude Code to generate pixel-perfect components! 🎨
