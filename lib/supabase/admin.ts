import { createClient } from "@supabase/supabase-js";

// Service-role client for admin-only auth operations (inviting users).
// Never expose this client or the service role key to the browser.
export function getSupabaseAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}
