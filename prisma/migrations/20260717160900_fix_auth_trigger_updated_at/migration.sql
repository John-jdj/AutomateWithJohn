-- The Phase 2 auth trigger (20260716180000_sync_auth_users) omitted
-- "updatedAt", which has no DB-level default (Prisma's @updatedAt is
-- applied by Prisma Client, not the database), so every sign-up failed
-- with a NOT NULL violation. Set it explicitly.

CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, "authId", email, name, "updatedAt")
  VALUES (
    gen_random_uuid()::text,
    NEW.id::text,
    NEW.email,
    NEW.raw_user_meta_data ->> 'name',
    now()
  )
  ON CONFLICT ("authId") DO NOTHING;
  RETURN NEW;
END;
$$;
