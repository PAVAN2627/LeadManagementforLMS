# Athenura Lead Management System

A full-stack, role-based lead management platform built for sales teams. Agents capture and track leads through a pipeline, managers oversee team performance and assignments, and admins control the entire system.

---

## Tech Stack

**Frontend**
- React 18 + TypeScript
- Vite 7 (build tool)
- React Router v6
- TanStack React Query v5
- Tailwind CSS + shadcn/ui (Radix UI)
- Recharts (charts & analytics)
- Framer Motion (animations)
- React Hook Form + Zod (validation)

**Backend**
- Express 5 (Node.js REST API)
- MongoDB + Mongoose
- JWT authentication
- bcryptjs password hashing
- Vercel serverless functions (production)

**Dev Tools**
- TypeScript 5.8
- Vitest (unit testing)
- ESLint
- Concurrently (runs frontend + backend together)

---

## Project Structure

```
├── api/                        # Serverless API handlers (Vercel-compatible)
│   ├── index.ts                # API entry point
│   ├── _auth/                  # Auth endpoints
│   ├── _leads/                 # Lead CRUD + notes
│   ├── _users/                 # User management
│   ├── _analytics/             # Analytics endpoint
│   ├── _notifications/         # Notifications
│   └── _cron/                  # Scheduled jobs
├── src/
│   ├── components/             # Reusable UI components
│   │   ├── agent/              # Agent-specific modals & views
│   │   ├── charts/             # Recharts chart components
│   │   ├── layout/             # Role-specific layout wrappers
│   │   ├── tables/             # Data table components
│   │   └── ui/                 # shadcn/ui primitives
│   ├── context/
│   │   └── AuthContext.tsx     # Global auth state (JWT + user)
│   ├── lib/
│   │   ├── api.ts              # Typed API client
│   │   ├── auth-utils.ts       # bcrypt helpers
│   │   ├── db.ts               # MongoDB connection (cached)
│   │   ├── jwt.ts              # Token sign/verify
│   │   └── email.ts            # Email via Resend
│   ├── models/                 # Mongoose schemas + TypeScript interfaces
│   │   ├── User.ts
│   │   ├── Lead.ts
│   │   ├── Note.ts
│   │   └── Notification.ts
│   └── pages/
│       ├── admin/              # Admin dashboard, leads, users, reports
│       ├── manager/            # Manager dashboard, team, leads, reports
│       └── agent/              # Agent dashboard, my leads, add lead
├── server.ts                   # Express dev server
└── vercel.json                 # Vercel deployment config
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas cluster (or local MongoDB)
- A `.env` file in the project root

### Environment Variables

Create a `.env` file:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/lms
JWT_SECRET=your_jwt_secret_here
RESEND_API_KEY=re_your_resend_key
NODE_ENV=development
```

### Install & Run

```bash
npm install

# Runs Vite frontend (port 5173) + Express backend (port 5000) concurrently
npm run dev
```

### Build for Production

```bash
npm run build
```

### Run Tests

```bash
npm test
```

---

## Authentication

Auth is JWT-based with a 1-day token expiry.

1. User POSTs credentials to `/api/auth/login`
2. Server validates password with bcrypt, returns a signed JWT
3. Token is stored in `localStorage` and sent as `Authorization: Bearer <token>` on every request
4. On app load, `AuthContext` validates the token via `/api/auth/me` — invalid/expired tokens are cleared automatically
5. `ProtectedRoute` enforces role-based access and redirects unauthorized users to their own dashboard

---

## Roles & Permissions

| Feature | Admin | Manager | Agent |
|---|---|---|---|
| View all leads | ✅ | ✅ | Own only |
| Create leads | ✅ | ✅ | ✅ |
| Assign leads to agents | ✅ | ✅ | ❌ |
| Bulk assign leads | ✅ | ✅ | ❌ |
| Add notes to leads | ✅ | ✅ | ✅ |
| Manage users | ✅ | ❌ | ❌ |
| View analytics | ✅ | ✅ | ✅ |
| View team performance | ✅ | ✅ | ❌ |
| Export CSV | ✅ | ✅ | ❌ |

---

## Data Models

### User
```ts
{
  name: string
  email: string          // unique
  passwordHash: string   // bcrypt, excluded from queries by default
  role: 'admin' | 'manager' | 'agent'
  status: 'active' | 'inactive'
  phone?: string
  company?: string
  department?: string
  bio?: string
  avatar?: string
  location?: string
}
```

### Lead
```ts
{
  name: string
  email: string
  phone: string
  company: string
  source: string
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'converted' | 'lost'
  assignedTo: ObjectId   // ref: User
  date: Date
  nextFollowUp?: Date
}
```

### Note
```ts
{
  content: string
  lead: ObjectId         // ref: Lead
  author: ObjectId       // ref: User
  status?: string
  nextFollowUp?: Date
}
```

### Notification
```ts
{
  userId: ObjectId       // ref: User
  type: string
  message: string
  link?: string
  isRead: boolean
}
```

---

## API Reference

All endpoints are prefixed with `/api` and require `Authorization: Bearer <token>` unless noted.

### Auth
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/login` | Login with email + password | No |
| GET | `/api/auth/me` | Get current user profile | Yes |
| POST | `/api/auth/admin-signup` | Create initial admin account | No |
| POST | `/api/auth/change-password` | Change own password | Yes |

### Leads
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/leads` | List leads (filtered by role) |
| POST | `/api/leads` | Create a lead |
| GET | `/api/leads/:id` | Get single lead |
| PATCH | `/api/leads/:id` | Update lead |
| DELETE | `/api/leads/:id` | Delete lead |
| GET | `/api/leads/:id/notes` | Get notes for a lead |
| POST | `/api/leads/:id/notes` | Add a note to a lead |
| POST | `/api/leads/bulk` | Bulk create leads |

### Users
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/users` | List users (admin/manager only) |
| POST | `/api/users` | Create a user |
| GET | `/api/users/:id` | Get user by ID |
| PATCH | `/api/users/:id` | Update user |
| POST | `/api/users/bulk` | Bulk create users |

### Analytics
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/analytics` | Get dashboard analytics |

### Notifications
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/notifications` | Get notifications for current user |
| PATCH | `/api/notifications` | Mark notification(s) as read |

---

## Lead Pipeline

Leads move through the following statuses:

```
new → contacted → qualified → proposal → negotiation → converted
                                                      ↘ lost
```

---

## Deployment (Vercel)

The project is configured for Vercel out of the box.

- All `/api/*` requests are rewritten to `/api/index` (serverless handler)
- A daily cron job runs at 09:00 UTC via `/api/cron/send-reminders` to send follow-up reminder emails
- Frontend is built with Vite and served from the `dist/` directory

```json
// vercel.json (summary)
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "crons": [{ "path": "/api/cron/send-reminders", "schedule": "0 9 * * *" }],
  "rewrites": [{ "source": "/api/(.*)", "destination": "/api/index" }]
}
```

Set the same environment variables from `.env` in your Vercel project settings before deploying.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start frontend + backend in development |
| `npm run build` | Production build |
| `npm run server` | Start Express server only |
| `npm run lint` | Run ESLint |
| `npm test` | Run Vitest test suite |
| `npm run test:watch` | Run Vitest in watch mode |
