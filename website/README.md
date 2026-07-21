# SaaS Platform

Production-ready SaaS boilerplate built with **Next.js 16**, **Supabase**, and **shadcn/ui**.

## Architecture

```text
Users
  │
  │  HTTPS
  ▼
┌──────────────────────────────┐
│         Cloudflare           │
│  DNS • CDN • SSL • WAF      │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│          Nginx               │
│  Reverse Proxy • Load Balancing
└──────────────┬───────────────┘
        ┌──────┴──────┐
        ▼              ▼
┌──────────────┐ ┌──────────────┐
│  Next.js #1  │ │  Next.js #2  │
└──────┬───────┘ └──────┬───────┘
        └───────┬────────┘
                ▼
       Server Actions / APIs
                │
      ┌─────────┼──────────┐
      ▼         ▼          ▼
┌────────┐ ┌────────┐ ┌──────────┐
│Supabase│ │ Redis  │ │    AI    │
│  Auth  │ │Upstash │ │Providers │
│   +    │ └────────┘ │OpenAI    │
│Postgres│            │Gemini    │
└────────┘            │Claude    │
                      └──────────┘
```

### Tech Stack

| Layer        | Technology                                   |
| ------------ | -------------------------------------------- |
| **Framework**| Next.js 16 (App Router, Turbopack)           |
| **Auth**     | Supabase Auth (Email + Google OAuth)         |
| **Database** | PostgreSQL via Supabase, Row-Level Security  |
| **Cache**    | Upstash Redis (session store, rate limiting) |
| **Payments** | Razorpay                                     |
| **AI**       | Vercel AI SDK (OpenAI, Gemini, Claude)       |
| **Email**    | Resend                                       |
| **UI**       | shadcn/ui + Base UI + Tailwind CSS v4        |
| **Animations**| Framer Motion                               |
| **Testing**  | Playwright (17 E2E tests)                    |
| **CI/CD**    | GitHub Actions → Vercel (primary) / Docker VPS|
| **Infra**    | Cloudflare + Nginx + Docker Compose          |

### Project Structure

```
app/
├── auth/           # Login, signup, OAuth callback
├── dashboard/      # Protected dashboard (server-rendered)
├── profile/        # User profile page
├── api/health/     # Health check endpoint
├── layout.tsx      # Root layout with ThemeProvider
└── page.tsx        # Landing page
components/
├── dashboard/      # Sidebar, navbar, user-menu, mobile-sidebar
├── landing/        # Header, hero, features, pricing, testimonials, FAQ, footer
├── ui/             # Button, separator, collapsible, dropdown-menu, skeleton
└── theme-provider.tsx
lib/
├── actions/auth.ts # Server actions (signIn, signUp, signOut, Google OAuth)
├── supabase/       # Server + client + middleware helpers
├── redis.ts        # Upstash cache wrapper
├── ai.ts           # Multi-provider AI completions
├── razorpay.ts     # Payment order creation + verification
└── resend.ts       # Email sending with fallback
docs/architecture.md # Full HLD document
proxy.ts            # Next.js 16 edge proxy (session + protection)
```

### Getting Started

```bash
npm install
cp .env.example .env.local  # Fill in your keys
npm run dev                 # http://localhost:3000
```

### Key Features

- **Landing page**: Hero, features grid, pricing tiers, testimonials, FAQ, footer — all animated with Framer Motion
- **Auth**: Email/password login + signup, Google OAuth, protected routes via proxy
- **Dashboard**: Collapsible sidebar, mobile drawer, breadcrumbs, notification bell, user menu, dark mode
- **Infrastructure**: Docker multi-stage build, Nginx reverse proxy, CI/CD pipeline with GitHub Actions
- **Integrations**: Razorpay payments, Upstash Redis caching, multi-provider AI, Resend email
