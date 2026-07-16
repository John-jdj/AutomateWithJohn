# Build Plan — AutomateWithJohn

Work through phases **in order**. At the end of each phase: run the
verification steps in CLAUDE.md, summarize what was built, list any
open questions, and **stop for review** before starting the next phase.
Don't self-chain phases even if you have context budget left.

---

## Phase 0 — Foundations
- Scaffold the Next.js + TypeScript + Tailwind + shadcn/ui project
- Set up ESLint/Prettier, strict tsconfig, folder structure
  (explain each top-level folder's purpose in a comment or README)
- Set up Prisma with a Postgres connection (Supabase), no schema yet
- Git init, initial commit, `.env.example` with placeholders for every
  planned integration (Supabase, Resend, Razorpay, GA4, Clarity, OpenAI)
- **Stop here and confirm the folder structure before continuing.**

## Phase 1 — Data model
- Design the Prisma schema for: users/roles, leads, projects/portfolio,
  blog posts, testimonials, services, invoices/payments, CRM entities
  (clients, pipeline stage, tasks, meeting notes)
- Walk through the schema with me before running a migration —
  this is the expensive-to-change layer
- Run migration, seed minimal sample data

## Phase 2 — Auth
- Supabase Auth: email + Google + GitHub login
- Role-based authorization (admin vs client vs public) with middleware
  guarding `/admin/*`
- Basic account pages (login, signup, password reset)

## Phase 3 — Design system
- Core layout components, typography scale, color tokens (light/dark)
- Reusable primitives on top of shadcn/ui (buttons, cards, forms, nav)
- One fully-built reference page (Home) to lock in the visual language
  before replicating the pattern across other pages

## Phase 4 — Public marketing site
- Remaining public pages: About, Services, Portfolio, Case Studies,
  Pricing, FAQ, Testimonials, Careers, Contact, Book Consultation,
  legal pages, 404
- Contact and consultation forms: Zod validation, write to Supabase,
  send via Resend, spam protection (reCAPTCHA)
- SEO baseline: metadata, OpenGraph, sitemap.xml, robots.txt, JSON-LD

## Phase 5 — Blog CMS (admin-authored, publicly rendered)
- Admin CRUD: create/edit/delete, draft/publish, tags, categories, SEO
  fields
- Comments (with moderation)
- Public blog listing + post pages

## Phase 6 — Portfolio management
- Admin CRUD for projects: images, video, tech stack, client, category,
  GitHub/live links, linked case study
- Public portfolio + case study pages

## Phase 7 — Admin dashboard core
- Dashboard shell + nav for: Analytics, Projects, Services, Clients,
  Leads, Messages, Blogs, Testimonials, Media, Users, Roles, Settings
- Analytics widgets wired to Recharts (start with real data you
  already have — leads, projects, messages — not fabricated metrics)

## Phase 8 — CRM
- Lead capture → pipeline stages → client conversion
- Tasks, follow-ups, meeting notes, proposal status per client

## Phase 9 — Payments
- Razorpay integration: advance payment, full payment, custom invoice
- PDF invoice generation
- Payment records visible in admin dashboard

## Phase 10 — Transactional email
- Resend templates: welcome, contact, quote request, invoice,
  password reset, newsletter
- Trigger points wired to the flows built in earlier phases

## Phase 11 — AI chatbot
- Floating widget, OpenAI API, scoped to agency services/FAQ
- Lead capture handoff into the CRM from Phase 8
- **Confirm the data source for "knows agency services"** (static
  config vs. pulling from the services table) before building

## Phase 12 — Hardening
- Rate limiting, CSRF/XSS/SQLi review, secure cookie config
- Accessibility pass, image/code-splitting optimization pass
- Real Lighthouse run — report actual numbers, don't assume 95+

## Phase 13 — Deploy
- Vercel deployment, environment variables documented and set
- GA4, Search Console, Clarity wired in
- Final smoke test of every user-facing flow

---

**Note on realism:** every phase above is roughly a multi-session
effort on its own. Don't expect Phase 0 through 13 in one sitting —
that's the whole point of doing it phase by phase with review gates.
