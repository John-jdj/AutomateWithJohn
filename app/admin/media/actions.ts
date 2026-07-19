"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { getStorageClient, MEDIA_BUCKET } from "@/lib/supabase/storage";

export async function deleteMedia(path: string): Promise<void> {
  await requireAdmin();
  const supabase = getStorageClient();
  await supabase.storage.from(MEDIA_BUCKET).remove([path]);
  revalidatePath("/admin/media");
}
