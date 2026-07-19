import { requireAdmin } from "@/lib/auth";
import { getStorageClient, MEDIA_BUCKET } from "@/lib/supabase/storage";
import { MediaUploadForm } from "@/components/admin/MediaUploadForm";
import { MediaGridItem } from "@/components/admin/MediaGridItem";

export default async function AdminMediaPage() {
  await requireAdmin();

  const supabase = getStorageClient();
  const { data: files } = await supabase.storage
    .from(MEDIA_BUCKET)
    .list("", { sortBy: { column: "created_at", order: "desc" } });

  const items = (files ?? [])
    .filter((f) => f.name !== ".emptyFolderPlaceholder")
    .map((f) => ({
      path: f.name,
      url: supabase.storage.from(MEDIA_BUCKET).getPublicUrl(f.name).data.publicUrl,
    }));

  return (
    <div className="p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Media</h1>
        <MediaUploadForm />
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Upload images here, then paste the copied URL into blog cover images, project images,
        or testimonial avatars.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {items.length === 0 ? (
          <p className="col-span-full text-sm text-muted-foreground">No files uploaded yet.</p>
        ) : (
          items.map((item) => <MediaGridItem key={item.path} path={item.path} url={item.url} />)
        )}
      </div>
    </div>
  );
}
