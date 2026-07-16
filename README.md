# AutomateWithJohn

Web development agency site + CMS + admin dashboard + CRM. See
[BUILD_PLAN.md](./BUILD_PLAN.md) for the phased roadmap and
[CLAUDE.md](./CLAUDE.md) for working conventions.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS v4 ·
shadcn/ui · Prisma · PostgreSQL (Supabase) · Supabase Auth/Storage ·
Razorpay · Resend · Zod · React Hook Form · Recharts

## Getting started

```bash
npm install
cp .env.example .env      # fill in real values
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Folder structure

- `app/` — Next.js App Router routes, layouts, and route handlers
- `components/` — reusable React components (UI primitives, sections, layout)
- `lib/` — shared utilities, data access, and client configuration
- `prisma/` — database schema and migrations
- `public/` — static assets served as-is
- `types/` — shared TypeScript types

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build
- `npm run start` — run the production build
- `npm run lint` — lint the codebase
