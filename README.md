# Ledgr

A personal finance management monorepo built with Turborepo, containing two Next.js applications sharing a component library, types, and utilities.

## Apps

| App       | Description                | Live                                                     |
| --------- | -------------------------- | -------------------------------------------------------- |
| Dashboard | User-facing finance app    | [ledgrr-app.vercel.app](https://ledgrr-app.vercel.app)   |
| Admin     | Platform management portal | [ledgr-admin.vercel.app](https://ledgr-admin.vercel.app) |

## Demo Credentials

**Dashboard** — create your own account or use:

- Email: m.ponfrey@ledgr.app
- Password: demo123456

**Admin Portal**

- Email: okafor.kemi@gmail.com
- Password: (autofilled on the login page) or hit the autofilled button

## Packages

| Package        | Description                           |
| -------------- | ------------------------------------- |
| `@ledgr/ui`    | Shared component library              |
| `@ledgr/types` | Shared TypeScript types               |
| `@ledgr/utils` | Shared helper functions and utilities |

## Tech Stack

- **Monorepo** — Turborepo, pnpm workspaces
- **Framework** — Next.js 15, React 19
- **Auth & Database** — Supabase (RLS, Realtime)
- **Styling** — Tailwind CSS v4
- **Animations** — Framer Motion
- **Charts** — Recharts
- **Icons** — Lucide React
- **Language** — TypeScript

## Features

### Dashboard

- Email/password and Google OAuth authentication
- Onboarding wizard with income and budget setup
- Transaction tracking with add, edit, delete and filters
- Budget management with progress tracking
- Analytics with income vs expenses, spending trends, category breakdown
- Real-time notifications
- Account suspension banner
- Dark/light mode

### Admin Portal

- Platform-wide stats (users, transactions, volume)
- User management — suspend and activate accounts
- Read-only transaction view across all users
- Platform analytics and most active users

## Getting Started

```bash
# Clone the repo
git clone https://github.com/tolubishops0/ledgr.git
cd ledgr

# Install dependencies
pnpm install

# Add env variables
cp apps/dashboard/.env.example apps/dashboard/.env.local
cp apps/admin/.env.example apps/admin/.env.local

# Run both apps
pnpm dev
```

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```
