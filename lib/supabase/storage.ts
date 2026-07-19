import { createClient } from "@supabase/supabase-js";

// Storage mutations use the service role key (server-only) rather than
// the anon key + RLS storage policies, since the "media" bucket has no
// insert/delete policies configured — only a public read policy.
export function getStorageClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export const MEDIA_BUCKET = "media";
