-- Prisma-created tables have RLS disabled by default, unlike tables
-- created through the Supabase UI. Since the app's anon/publishable key
-- is exposed to the browser, every table must have RLS enabled so
-- PostgREST (used by supabase-js) can't read or write rows it shouldn't.
--
-- The app's own server-side code (Prisma Client, via DATABASE_URL) talks
-- to Postgres directly as the postgres role and is not subject to RLS.
-- These policies only govern access through the Supabase client libraries.

ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "contact_messages" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "leads" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "clients" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "tasks" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "meeting_notes" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "projects" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "case_studies" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "blog_posts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "comments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "services" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "testimonials" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "invoices" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "payments" ENABLE ROW LEVEL SECURITY;

-- A signed-in user may read their own users row (used by proxy.ts to
-- check role for /admin/* access, and by account pages).
CREATE POLICY "Users can view own record" ON "users"
  FOR SELECT
  USING (auth.uid()::text = "authId");

-- No other policies yet: every other table is fully locked down from the
-- anon/authenticated client roles until each later phase (CRM, blog CMS,
-- portfolio, billing) defines the access it actually needs. Public
-- marketing content (services, published blog posts/projects) will get
-- explicit public-read policies in Phase 4/5/6 when those pages are built.
