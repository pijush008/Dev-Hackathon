# High-Level Design — SaaS Platform

```text
Users
  │
  │  HTTPS
  ▼
┌──────────────────────────────┐
│         Cloudflare           │
│  DNS • CDN • SSL • WAF      │
│  DDoS Protection • Cache     │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│          Nginx               │
│  Reverse Proxy               │
│  Load Balancer               │
│  Gzip / Brotli Compression   │
│  Rate Limiting               │
└──────────────┬───────────────┘
               │
       ┌───────┴───────┐
       ▼               ▼
┌──────────────┐ ┌──────────────┐
│  Next.js #1  │ │  Next.js #2  │
│   (Docker)   │ │   (Docker)   │
└──────┬───────┘ └──────┬───────┘
       │                │
       └───────┬────────┘
               ▼
      Server Actions / APIs
               │
     ┌─────────┼──────────┐
     ▼         ▼          ▼
┌────────┐ ┌────────┐ ┌──────────┐
│Supabase│ │ Redis  │ │    AI    │
│  Auth  │ │Upstash │ │Providers │
└───┬────┘ └────────┘ │OpenAI    │
    │                  │Gemini    │
    ▼                  │Claude    │
┌──────────────────┐  └──────────┘
│ Supabase Platform│
│                  │
│ PostgreSQL       │
│ Storage          │
│ Realtime         │
│ Edge Functions   │
└──────────────────┘
    │
    ▼
  Stripe • Resend • Analytics • Monitoring
```

---

## Table of Contents

1. [Problem Statement](#1-problem-statement)
2. [Development Workflow](#2-development-workflow)
3. [Architecture Overview](#3-architecture-overview)
4. [Layer Breakdown](#4-layer-breakdown)
   - [4.1 Edge & CDN — Cloudflare](#41-edge--cdn--cloudflare)
   - [4.2 Reverse Proxy — Nginx](#42-reverse-proxy--nginx)
   - [4.3 Application — Next.js](#43-application--nextjs)
   - [4.4 Server Actions & API Layer](#44-server-actions--api-layer)
   - [4.5 Data & Services](#45-data--services)
5. [Data Flow](#5-data-flow)
6. [Security Model](#6-security-model)
7. [Scalability](#7-scalability)
8. [CI/CD Pipeline](#8-cicd-pipeline)
9. [Observability](#9-observability)

---

## 1. Problem Statement

Build a production-ready SaaS platform from scratch using an AI-assisted workflow. The project follows a structured build sequence where each phase feeds into the next:

```text
                    Production Problem Statement
                              │
                              ▼
                ┌─────────────────────────────┐
                │    Architecture Plan         │
                │       (15–20 min)            │
                └─────────────┬───────────────┘
                              │
                              ▼
                ┌─────────────────────────────┐
                │     Database Schema          │
                └─────────────┬───────────────┘
                              │
                              ▼
                ┌─────────────────────────────┐
                │     Authentication           │
                └─────────────┬───────────────┘
                              │
                              ▼
                ┌─────────────────────────────┐
                │    Dashboard / Layout        │
                └─────────────┬───────────────┘
                              │
                              ▼
                ┌─────────────────────────────┐
                │      Core Feature            │
                └─────────────┬───────────────┘
                              │
                              ▼
                ┌─────────────────────────────┐
                │     AI Integration           │
                └─────────────┬───────────────┘
                              │
                              ▼
                ┌─────────────────────────────┐
                │  Testing (Playwright)        │
                └─────────────┬───────────────┘
                              │
                              ▼
                ┌─────────────────────────────┐
                │         Deploy               │
                └─────────────┬───────────────┘
                              │
                              ▼
                ┌─────────────────────────────┐
                │          Demo                │
                └─────────────────────────────┘
```

**Build sequence rationale:**

| Phase               | Duration    | Deliverable                                  |
| ------------------- | ----------- | -------------------------------------------- |
| Architecture Plan   | 15–20 min   | HLD document, technology choices, data flow  |
| Database Schema     | Phase       | Tables, RLS policies, indexes, migrations    |
| Authentication      | Phase       | Email + Google OAuth, session management     |
| Dashboard / Layout  | Phase       | Reusable layout, sidebar, navbar, dark mode  |
| Core Feature        | Phase       | Business-specific functionality              |
| AI Integration      | Phase       | LLM provider abstraction, completion helpers |
| Testing             | Phase       | Playwright E2E suite covering all flows      |
| Deploy              | Phase       | CI/CD pipeline, Docker, Vercel / VPS         |
| Demo                | Final       | Live walkthrough of the complete system      |

---

## 2. Development Workflow

The project uses an **AI-augmented iterative workflow** where each feature request flows through a defined lifecycle:

```text
Feature Request
      │
      ▼
┌────────────────┐
│   OpenCode      │   AI agent interprets requirement
│  (AI Agent)     │   Proposes implementation plan
└───────┬────────┘
        │
        ▼
┌────────────────┐
│  Code Generated │   Server Components, Server Actions,
│                 │   shadcn/ui, TypeScript
└───────┬────────┘
        │
        ▼
┌────────────────┐
│ Local Testing   │   Manual verification in dev server
│                 │   (http://localhost:3000)
└───────┬────────┘
        │
        ▼
┌────────────────┐
│   Playwright    │   Automated E2E tests
│                 │   (17 tests covering landing + auth)
└───────┬────────┘
        │
        ▼
┌────────────────┐
│   Git Commit    │   Conventional commit message
│                 │   (feature/auth, fix/layout)
└───────┬────────┘
        │
        ▼
┌────────────────┐
│   Git Push      │   Push to remote branch
└───────┬────────┘
        │
        ▼
┌────────────────┐
│ GitHub Actions  │   CI pipeline:
│                 │   tsc → ESLint → Playwright → Build
└───────┬────────┘
        │
        ▼
┌────────────────┐
│     Deploy      │   Vercel (primary) or VPS (Docker)
└───────┬────────┘
        │
        ▼
┌────────────────┐
│   Production    │   Live at production URL
└────────────────┘
```

**Key principles:**
- Every feature goes through the full cycle before the next begins
- AI generates the initial code; human reviews and tests locally
- Playwright tests must pass before commit
- CI/CD is fully automated — no manual deploy steps
- Rollback is one click (Vercel) or one command (Docker tag)

---

## 3. Architecture Overview

This is a modern SaaS application built on **Next.js 16** with the **App Router**, using **Supabase** as the backend platform and **Docker** for containerized deployment. The architecture follows a three-tier pattern:

- **Presentation Tier**: Next.js server-rendered React components with streaming
- **Application Tier**: Server Actions, Route Handlers, and Supabase Edge Functions
- **Data Tier**: PostgreSQL (Supabase), Redis cache (Upstash), and external AI APIs

The system is designed for horizontal scalability behind a stateless Nginx load balancer.

---

## 4. Layer Breakdown

### 4.1 Edge & CDN — Cloudflare

Cloudflare sits at the outermost layer and handles:

| Capability        | Purpose                                           |
| ----------------- | ------------------------------------------------- |
| **DNS**           | Subdomain routing (app.example.com, api.*)        |
| **CDN**           | Static asset caching (Next.js `/_next/static`)   |
| **SSL/TLS**       | Termination with auto-renewed certificates        |
| **WAF**           | OWASP rule sets, rate limiting, bot mitigation    |
| **DDoS**          | L3/L7 volumetric attack absorption                |
| **Cache**         | HTML page caching (with purging on revalidation) |

Cloudflare Workers may optionally be used for:
- A/B testing or geo-routing
- JWT validation before requests reach origin

### 4.2 Reverse Proxy — Nginx

Nginx runs as a Docker container and provides:

| Role                | Implementation                                       |
| ------------------- | ---------------------------------------------------- |
| **Proxy Pass**      | Forwards requests to Next.js containers on `:3000`   |
| **Load Balancing**  | Round-robin across 2+ Next.js instances              |
| **SSL Termination** | Offloaded to Cloudflare (origin pulls on LAN)        |
| **Compression**     | Brotli for HTML/JS/CSS, Gzip fallback                |
| **Rate Limiting**   | Zone-based limiter per IP (e.g., 100 req/s)          |
| **Static Files**    | Serves favicon, robots.txt, sitemap.xml directly     |

```nginx
upstream nextjs {
    server nextjs-1:3000;
    server nextjs-2:3000;
}

server {
    listen 80;
    location / {
        proxy_pass http://nextjs;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 4.3 Application — Next.js

The core application runs two stateless Docker containers for redundancy. Both run the same build artifact.

**Runtime**: Node.js 20+  
**Build Tool**: Turbopack (default in Next.js 16)  
**Framework**: Next.js 16 App Router

**Key architectural decisions:**

- **Server Components**: All rendering is server-side by default — client components only for interactivity (animations, theme toggle, dropdown menus).
- **Server Actions**: Authentication, data mutations, and OAuth flows run as Server Actions — no separate API route for auth.
- **Proxy (Middleware)**: Next.js 16's `proxy.ts` handles session refresh and route protection at the edge.
- **Static Generation**: Landing pages (`/`, `/auth/login`, `/auth/signup`) are statically rendered. Dashboard and profile pages are dynamic.

**Page rendering matrix:**

| Route          | Type     | Auth Required | Cache Strategy        |
| -------------- | -------- | ------------- | --------------------- |
| `/`            | Static   | No            | CDN cache, no reval   |
| `/auth/login`  | Static   | No            | CDN cache             |
| `/auth/signup` | Static   | No            | CDN cache             |
| `/dashboard`   | Dynamic  | Yes           | Private, per-session  |
| `/profile`     | Dynamic  | Yes           | Private, per-session  |

### 4.4 Server Actions & API Layer

Next.js Server Actions handle all write operations. They execute in the Node.js runtime and have direct access to:

- **Supabase Admin Client** (`lib/supabase/server.ts`) — for server-side auth and DB queries
- **Upstash Redis** — session cache and rate-limit counters
- **AI SDK** — integration with language model providers (see [4.5.3](#453-ai-providers))

**Auth Server Actions** (`lib/actions/auth.ts`):

| Action               | Flow                                                              |
| -------------------- | ----------------------------------------------------------------- |
| `signInWithEmail`    | Validates credentials via Supabase Auth, creates session cookie   |
| `signUpWithEmail`    | Creates user in Supabase Auth, optionally sends confirmation email |
| `signInWithGoogle`   | Initiates OAuth flow, exchanges code at callback route            |
| `signOut`            | Destroys session, clears cookies, redirects to login              |

**Route Handlers** are used only for external callbacks (OAuth redirect, Stripe webhooks).

### 4.5 Data & Services

#### 4.5.1 Supabase Platform

Supabase provides the complete backend-as-a-service layer.

| Service            | Usage                                                     |
| ------------------ | --------------------------------------------------------- |
| **Auth**           | Email/password + Google OAuth; session management via SSR |
| **PostgreSQL**     | Primary data store; Row-Level Security for multi-tenancy  |
| **Storage**        | User uploads, avatars, images; CDN-backed                 |
| **Realtime**       | Live presence, broadcast, and Postgres change streaming   |
| **Edge Functions** | Webhook handlers, Stripe integration, heavy computations  |

**Database schema design principles:**
- Row-Level Security enabled on all tables
- UUID primary keys
- `created_at` / `updated_at` timestamps on every table
- Soft deletes via `deleted_at` where applicable

#### 4.5.2 Redis Cache (Upstash)

Upstash provides serverless Redis for:

| Use Case               | Detail                                        |
| ---------------------- | --------------------------------------------- |
| **Session Store**      | Token blacklist for immediate invalidation    |
| **Rate Limiting**      | Sliding window counters per user/IP           |
| **API Cache**          | Short-lived responses (TTL 30–300s)           |
| **Job Queue**          | Lightweight background task queue             |

Upstash is chosen over self-hosted Redis for zero operational overhead, global replication, and HTTP-based API (no persistent connection required).

#### 4.5.3 AI Providers

The application integrates with multiple AI providers via the Vercel AI SDK (`@ai-sdk/provider`). This abstraction layer enables:

- **Provider-agnostic calls**: Same interface for OpenAI, Gemini, and Claude
- **Fallback chains**: Automatic retry with different providers
- **Streaming**: Server-sent events for chat/completion UIs

```typescript
// Example — abstracted AI call
import { generateText } from "ai";

const { text } = await generateText({
  model: yourModel, // swapped via env config
  prompt: "Explain SaaS architecture",
});
```

#### 4.5.4 External Services

| Service  | Role                                                    |
| -------- | ------------------------------------------------------- |
| **Razorpay** | Subscription billing, invoices, payment gateway     |
| **Resend**   | Transactional emails (welcome, password reset, etc.) |
| **Analytics** | Product analytics, page views, funnels              |
| **Monitoring** | Uptime, error tracking, performance metrics         |

---

## 5. Data Flow

### 5.1 Page Request (Authenticated)

```text
User → Cloudflare → Nginx → Next.js #1
  → proxy.ts reads session cookie
  → supabase.auth.getUser() validates session
  → Server Component renders HTML
  → Response returns via same path
```

### 5.2 Login Flow (Email/Password)

```text
User submits form → Server Action (signInWithEmail)
  → supabase.auth.signInWithPassword()
  → Session cookie set via @supabase/ssr
  → revalidatePath('/')
  → redirect('/dashboard')
```

### 5.3 Login Flow (Google OAuth)

```text
User clicks Google button → Server Action (signInWithGoogle)
  → supabase.auth.signInWithOAuth({ provider: 'google' })
  → redirect to Google consent screen
  → Google redirects to /auth/callback?code=...
  → exchangeCodeForSession(code)
  → Session cookie set
  → redirect('/dashboard')
```

### 5.4 Protected Route Access

```text
Request → proxy.ts
  → Read session cookie
  → supabase.auth.getUser()
  → If no user → redirect to /auth/login
  → If valid → NextResponse.next()
```

---

## 6. Security Model

| Layer        | Measure                                                   |
| ------------ | --------------------------------------------------------- |
| **Network**  | Cloudflare WAF, DDoS protection, TLS 1.3                 |
| **Proxy**    | Rate limiting, IP whitelist for admin endpoints           |
| **App**      | Server-only secrets (`SUPABASE_SECRET_KEY`), taint API   |
| **Database** | Row-Level Security (RLS), parameterized queries          |
| **Auth**     | HTTP-only cookies, SameSite=Lax, CSRF via Server Actions |
| **API**      | Supabase JWT validation, service role key never exposed  |

**Key security practices:**
- All Supabase client calls on the server use the service role key
- The anon key (client-side) has RLS enforcing row-level access
- Environment variables use `NEXT_PUBLIC_` prefix only for truly public values
- Rate limiting on auth endpoints prevents brute-force attacks

---

## 7. Scalability

| Component          | Strategy                                                |
| ------------------ | ------------------------------------------------------- |
| **Next.js**        | Horizontally scalable (stateless), Nginx load balances |
| **Supabase**       | Managed auto-scaling, read replicas available          |
| **Redis (Upstash)**| Serverless, scales to zero, global replication         |
| **PostgreSQL**     | Connection pooling via Supabase, PgBouncer             |
| **CDN**            | Cloudflare edge caches static pages and assets         |
| **Docker**         | Containerized for reproducible deployments             |

**Deployment topology** (production):

| Node             | Spec          | Count |
| ---------------- | ------------- | ----- |
| Nginx            | 1 vCPU, 1 GB  | 1     |
| Next.js          | 2 vCPU, 2 GB  | 2     |
| Redis (Upstash)  | Serverless    | —     |
| Supabase         | Managed       | —     |

---

## 8. CI/CD Pipeline

```text
Developer
  │
  │  git push
  ▼
GitHub Repository
  │
  ▼
GitHub Actions
  │
  ├── Install dependencies
  ├── Cache packages
  ├── Type check (tsc)
  ├── ESLint
  ├── Playwright tests
  ├── Build (next build)
  ├── Build Docker image
  ├── Security scan (optional)
  └── Deploy
           │
     ┌─────┴─────┐
     ▼           ▼
  Vercel      VPS (Docker)
```

### 8.1 Pipeline Stages

| Stage                 | Tool / Action                             | Purpose                                 |
| --------------------- | ----------------------------------------- | --------------------------------------- |
| **Install**           | `npm ci`                                  | Deterministic dependency install        |
| **Cache**             | `actions/cache`                           | Persist `node_modules` and `.next/cache`|
| **Type Check**        | `tsc --noEmit`                            | Static type verification                |
| **Lint**              | `eslint .`                                | Code quality and style enforcement      |
| **Unit / Integration**| `playwright test`                         | Browser-level functional tests          |
| **Build**             | `next build`                              | Production build (Turbopack)             |
| **Docker Build**      | `docker build -t app .`                   | Container image for VPS deployment      |
| **Security Scan**     | `trivy`, `snyk`, or `docker scout`        | Vulnerability scanning (optional gate)  |
| **Deploy**            | Vercel CLI / SSH + docker-compose         | Push to target environment              |

### 8.2 Branch Strategy

| Branch       | Trigger      | Stages                            | Destination     |
| ------------ | ------------ | --------------------------------- | --------------- |
| `main`       | Push / PR    | Full pipeline + deploy            | Production      |
| `staging`    | Push         | Full pipeline, skip deploy gate   | Staging VPS     |
| `feat/*`     | PR           | Install → Type Check → Lint → Test | — (preview)    |

### 8.3 Deployment Targets

#### 8.3.1 Vercel (Primary)

- Zero-config deployment for Next.js
- Automatic preview deployments for every PR
- Edge Functions replace need for separate CDN config
- Built-in analytics and speed insights

#### 8.3.2 VPS / Docker (Alternative / Self-Hosted)

- Used when compliance requires data residency
- Full control over infrastructure and scaling
- `docker-compose.yml` orchestrates Next.js + Nginx
- Rollbacks via previous image tags

```yaml
# docker-compose.yml (production)
version: "3.9"
services:
  nginx:
    image: nginx:alpine
    ports: ["80:80", "443:443"]
    volumes: ["./nginx.conf:/etc/nginx/nginx.conf"]
  nextjs:
    build: .
    replicas: 2
    env_file: .env.production
```

### 8.4 Environment Variables

Variables are injected at deploy time, never committed:

| Scope            | Source                |
| ---------------- | --------------------- |
| **Vercel**       | Project Environment Variables (UI / CLI) |
| **GitHub Actions**| Repository Secrets / Actions Variables  |
| **VPS**          | `.env.production` (via deployment secret) |

### 8.5 Rollback Strategy

| Method          | Scenario               | Command / Action                        |
| --------------- | ---------------------- | --------------------------------------- |
| **Vercel**      | Failed deploy          | Instant rollback via Vercel dashboard   |
| **VPS (Docker)**| Faulty image           | `docker-compose up -d app:previous_tag` |
| **Database**    | Schema migration error | Supabase point-in-time recovery         |

---

## 9. Observability

| Category       | Tool / Approach                                        |
| -------------- | ------------------------------------------------------ |
| **Logs**       | Container stdout (structured JSON), shipped to Loki    |
| **Metrics**    | Prometheus + Grafana (request rate, p50/p99 latency)   |
| **Traces**     | OpenTelemetry for distributed tracing across services  |
| **Uptime**     | Cloudflare health checks + external monitoring service |
| **Errors**     | Error tracking service for client and server errors    |
| **Analytics**  | Product analytics for user behavior and conversion     |
