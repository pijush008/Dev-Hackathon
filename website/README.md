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

| Layer          | Technology                                   |
| -------------- | -------------------------------------------- |
| **Framework**  | Next.js 16 (App Router, Turbopack)           |
| **Auth**       | Supabase Auth (Email + Google OAuth)         |
| **Database**   | PostgreSQL via Supabase, Row-Level Security  |
| **Cache**      | Upstash Redis (session store, rate limiting) |
| **Payments**   | Razorpay                                     |
| **AI**         | Vercel AI SDK (OpenAI, Gemini, Claude)       |
| **Email**      | Resend                                       |
| **UI**         | shadcn/ui + Base UI + Tailwind CSS v4        |
| **Animations** | Framer Motion + CSS-only keyframes           |
| **Testing**    | Playwright (17 E2E tests)                    |
| **CI/CD**      | GitHub Actions → Vercel (primary) / Docker VPS|
| **Infra**      | Cloudflare + Nginx + Docker Compose          |

### Project Structure

```
app/
├── auth/
│   ├── login/              # Email + Google login
│   ├── signup/             # Registration with name, email, password
│   ├── forgot-password/    # Password reset request
│   ├── reset-password/     # New password form
│   ├── verify-email/       # Email verification instructions
│   ├── callback/           # OAuth callback handler
│   ├── loading.tsx         # Auth loading skeleton
│   └── layout.tsx          # Auth layout wrapper
├── dashboard/
│   ├── page.tsx            # Protected dashboard (server-rendered)
│   ├── layout.tsx          # Sidebar + navbar layout
│   ├── loading.tsx         # Dashboard skeleton loader
│   └── error.tsx           # Dashboard error boundary
├── profile/                # User profile page
├── test/supabase/          # Supabase connection diagnostics
├── api/health/             # Health check endpoint
├── layout.tsx              # Root layout (fonts, theme, metadata)
├── page.tsx                # Landing page (dynamic imports)
├── loading.tsx             # Root loading skeleton
└── error.tsx               # Global error boundary
components/
├── dashboard/              # Sidebar, navbar, stat-cards, charts, etc.
├── landing/                # Header, hero, features, pricing, testimonials, FAQ, footer
├── healthcare/             # AI chat, cards, forms, tables
├── shared/                 # GoogleIcon (deduplicated)
└── ui/                     # Button, card, input, label, separator, skeleton, table
lib/
├── actions/auth.ts         # Server actions with Zod validation
├── validations/auth.ts     # Zod schemas (login, signup, forgot/reset password)
├── supabase/               # Server + client + middleware helpers
├── redis.ts                # Upstash cache wrapper
├── ai.ts                   # Multi-provider AI completions
├── razorpay.ts             # Payment order creation + verification
└── resend.ts               # Email sending with fallback
middleware.ts               # Route protection (auth + protected pages)
docs/architecture.md        # Full HLD document
```

### Getting Started

```bash
npm install
cp .env.example .env.local  # Fill in your keys
npm run dev                 # http://localhost:3000
```

### Key Features

#### Authentication System

| Feature              | Details                                      |
| -------------------- | -------------------------------------------- |
| Email Login          | Zod-validated, error messages, loading states |
| Email Signup         | Name + email + password + confirm password    |
| Google OAuth         | One-click sign-in via Supabase               |
| Forgot Password      | Email entry → success state                   |
| Reset Password       | New password form → redirect to login         |
| Email Verification   | Post-signup instructions page                 |
| Session Persistence  | Supabase SSR with cookie-based sessions       |
| Protected Routes     | Middleware redirects unauthenticated users     |
| Logout               | Server action + redirect                      |

#### Landing Page

- Hero with CSS-only animated gradient background
- Features grid, pricing tiers, testimonials, FAQ accordion
- CTA footer with sign-up links
- Below-fold components dynamically loaded (zero initial JS cost)

#### Dashboard

- Server-rendered user data (name, email, avatar)
- Collapsible sidebar with animated transitions
- Mobile-responsive drawer sidebar
- Stat cards, revenue chart, activity feed, quick actions
- Dark mode toggle via next-themes

#### Performance Optimizations

| Optimization                        | Impact                                      |
| ----------------------------------- | ------------------------------------------- |
| `next/dynamic` for below-fold       | ~60KB less JS in initial bundle             |
| CSS keyframes replacing framer-motion| Hero runs on compositor thread, not main   |
| `next/font` with `display: "swap"`  | No invisible text during font load          |
| `loading.tsx` skeletons             | Meaningful UI during navigation             |
| `error.tsx` boundaries              | Graceful error recovery                     |
| `optimizePackageImports`            | Better lucide-react tree-shaking            |
| `images.formats: avif, webp`        | 30-50% smaller images                       |
| `prefetch={true}` on auth links     | Near-instant auth page navigation           |
| Security headers                    | X-Content-Type-Options, X-Frame-Options     |
| Deduplicated components             | Single GoogleIcon across auth pages         |

#### Infrastructure

- Docker multi-stage build with Nginx reverse proxy
- CI/CD pipeline with GitHub Actions
- Cloudflare CDN + SSL + WAF
- Upstash Redis for caching and rate limiting
- Resend for transactional email
- Razorpay for payments

### Environment Variables

See [`.env.example`](.env.example) for all required variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Auth
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Redis (Upstash)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# AI Providers
AI_PROVIDER=openai
OPENAI_API_KEY=

# Razorpay
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

# Email (Resend)
RESEND_API_KEY=
EMAIL_FROM=
```

### Scripts

```bash
npm run dev       # Start development server
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Run ESLint
```
