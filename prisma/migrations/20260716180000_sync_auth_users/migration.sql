-- Creates a matching public.users row the moment a new auth.users row is
-- created, for both email/password and OAuth sign-ups. Runs as the
-- function owner (security definer), so it isn't subject to RLS.

CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, "authId", email, name)
  VALUES (
    gen_random_uuid()::text,
    NEW.id::text,
    NEW.email,
    NEW.raw_user_meta_data ->> 'name'
  )
  ON CONFLICT ("authId") DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_auth_user();
