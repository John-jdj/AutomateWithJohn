-- Phase 9: the portal route guard (proxy.ts) queries "clients" via the
-- anon/authenticated Supabase key to confirm a logged-in user has a
-- linked Client record. RLS is enabled on this table (Supabase default)
-- but had no policies, so that query always returned zero rows and every
-- client got redirected to /unauthorized. Mirrors the existing
-- "Users can view own record" policy on "users".

CREATE POLICY "Clients can view own record" ON "clients"
  FOR SELECT
  USING ("userId" IN (SELECT id FROM "users" WHERE "authId" = (auth.uid())::text));
