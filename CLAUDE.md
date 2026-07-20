# AutomateWithJohn — Web Agency Platform

## What this project is
A production web development agency site + CMS + admin dashboard + CRM,
built incrementally in phases (see BUILD_PLAN.md). This file is read by
Claude Code at the start of every session — keep it accurate as the
project evolves; update it yourself when conventions change.

## Tech stack (verify current versions before scaffolding — don't assume
training-data versions are still latest)
- Next.js 16 (App Router) + React 19 + TypeScript (strict mode) — this
  is a recent major version with breaking changes vs. training data;
  consult `node_modules/next/dist/docs/` (see AGENTS.md) before relying
  on remembered APIs/conventions
- Tailwind CSS v4 + shadcn/ui, Framer Motion for animation
- Prisma ORM + PostgreSQL (Supabase)
- Supabase Auth (email, Google, GitHub) + role-based authorization
- Supabase Storage for media
- Resend for transactional email
- Zod + React Hook Form for validation
- Recharts for admin analytics
- Deployed on Vercel

## Non-negotiable working rules
1. **Plan before coding.** For any phase or feature, restate what you're
   about to build and the files you'll touch before writing code. Wait
   for confirmation on anything architecturally significant (schema
   changes, auth flow, payment flow).
2. **Work one phase at a time.** Do not jump ahead to a later phase
   even if it seems related. Finish, verify, and stop for review.
3. **Verify before declaring done.** After every phase: run
   `tsc --noEmit`, run the test suite, run `next build`. Fix failures
   before moving on. Never mark a phase complete with a failing build.
4. **No placeholder logic in code you claim is done.** If something is
   genuinely stubbed (e.g. waiting on an API key), say so explicitly
   and mark it TODO in code + in your summary — don't present it as
   finished.
5. **Real values need real env vars.** Any integration requiring a
   secret goes into `.env.example` with a comment on where to get it.
   Never invent or hardcode a key.
6. **Commit at phase boundaries**, not mid-feature, with a message that
   names the phase.
7. **Ask, don't assume**, when a requirement is ambiguous (e.g. which
   pricing tiers, what roles exist beyond admin/client). One clarifying
   question is fine; don't guess on things that are expensive to
   unwind later (schema, auth model).
8. **Flag scope creep.** If a phase turns out to need something not in
   BUILD_PLAN.md (e.g. the chatbot needs a vector store), stop and say
   so instead of silently adding infrastructure.

## Definition of done (applies to every phase)
- Typechecks clean, build succeeds, existing tests still pass
- New functionality has at least basic test coverage
- No secrets committed; `.env.example` updated if new vars were added
- Short written summary of what changed and what's still open

## Explicitly out of scope unless a later phase says otherwise
- 100/100 Lighthouse on every page — treat as a target to approach, not
  a blocking requirement per phase
- The AI chatbot, CRM pipeline, and invoicing are separate phases, not
  side effects of earlier ones
