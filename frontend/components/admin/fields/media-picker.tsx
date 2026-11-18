"use client";

import { FileText, ImagePlus, Loader2, Upload, X } from "lucide-react";
import { Dialog } from "radix-ui";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Spinner } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { adminFetch, errorMessage } from "@/lib/admin/api";
import { useAdminQuery } from "@/lib/admin/use-admin-query";
import type { PaginatedResponse } from "@/lib/admin/types";
import { cn } from "@/lib/utils";

export interface MediaItem {
  id: number;
  url: string;
  path: string;
  original_name: string;
  mime_type: string;
  size: number;
  is_image: boolean;
  width: number | null;
  height: number | null;
}

export async function uploadMedia(file: File, collection = "general"): Promise<MediaItem> {
  const form = new FormData();
  form.append("file", file);
  form.append("collection", collection);
  const res = await adminFetch<{ data: MediaItem }>("media", { method: "POST", body: form });
  return res.data;
}

export function MediaLibrary({ type, onSelect, selectable = true }: { type?: "image" | "document"; onSelect?: (m: MediaItem) => void; selectable?: boolean }) {
  const query = useAdminQuery<PaginatedResponse<MediaItem>>(`media?per_page=60${type ? `&type=${type}` : ""}`);
  const items = query.loading ? null : (query.data?.data ?? []);
  const [uploading, setUploading] = useState(false);
  const input = useRef<HTMLInputElement>(null);


  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) await uploadMedia(file);
      toast.success("بارگذاری شد.");
      query.reload();
    } catch (e) {
      toast.error(errorMessage(e, "بارگذاری ناموفق بود."));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          upload(e.dataTransfer.files);
        }}
        className="flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-line bg-cloud p-6 text-center"
      >
        <Upload className="size-6 text-water-600" />
        <p className="text-sm text-muted">فایل را اینجا رها کنید یا</p>
        <Button type="button" size="sm" variant="outline" disabled={uploading} onClick={() => input.current?.click()}>
          {uploading ? <Loader2 className="animate-spin" /> : <ImagePlus />}
          انتخاب فایل
        </Button>
        <p className="text-xs text-muted/80">تصاویر: JPG، PNG، WebP، AVIF (حداکثر ۱۰ مگابایت) · اسناد: PDF (۲۰ مگابایت) · ویدیو: MP4، WebM</p>
        <input
          ref={input}
          type="file"
          multiple
          hidden
          accept={type === "document" ? "application/pdf" : type === "image" ? "image/jpeg,image/png,image/webp,image/avif" : "image/*,application/pdf,video/mp4,video/webm"}
          onChange={(e) => upload(e.target.files)}
        />
      </div>

      {items === null ? (
        <Spinner />
      ) : (
        <ul className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
          {items.map((m) => (
            <li key={m.id}>
              <button
                type="button"
                disabled={!selectable}
                onClick={() => onSelect?.(m)}
                className={cn("group block w-full overflow-hidden rounded-xl border border-line bg-cloud text-start", selectable && "hover:ring-2 hover:ring-water-400")}
                title={m.original_name}
              >
                <span className="relative grid aspect-square place-items-center">
                  {m.is_image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.url} alt="" loading="lazy" className="size-full object-cover" />
                  ) : (
                    <FileText className="size-8 text-muted" />
                  )}
                </span>
                <span className="block truncate px-2 py-1 text-[0.65rem] text-muted" dir="ltr">
                  {m.original_name}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Field that stores a media path (e.g. "articles/2026/11/x.webp"). */
export function MediaPicker({ value, onChange, type = "image" }: { value: string | null; onChange: (path: string | null) => void; type?: "image" | "document" }) {
  const [open, setOpen] = useState(false);
  const preview = value ? (value.startsWith("http") || value.startsWith("/") ? value : `${process.env.NEXT_PUBLIC_MEDIA_URL ?? ""}/storage/${value}`) : null;

  return (
    <div className="flex items-center gap-3">
      <div className="grid size-20 shrink-0 place-items-center overflow-hidden rounded-xl border border-line bg-cloud">
        {preview && type === "image" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="" className="size-full object-cover" />
        ) : value ? (
          <FileText className="size-7 text-water-600" />
        ) : (
          <ImagePlus className="size-6 text-muted/60" />
        )}
      </div>
      <div className="min-w-0 space-y-2">
        {value && (
          <p className="truncate text-xs text-muted" dir="ltr">
            {value}
          </p>
        )}
        <div className="flex gap-2">
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
              <Button type="button" size="sm" variant="outline">
                {value ? "تغییر" : "انتخاب از کتابخانه"}
              </Button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-50 bg-deep-900/50 backdrop-blur-sm" />
              <Dialog.Content dir="rtl" className="fixed inset-4 z-50 overflow-y-auto rounded-2xl bg-white p-6 shadow-lift md:inset-10">
                <div className="mb-4 flex items-center justify-between">
                  <Dialog.Title className="text-lg font-bold text-deep-600">کتابخانه رسانه</Dialog.Title>
                  <Dialog.Close className="grid size-9 place-items-center rounded-lg hover:bg-cloud" aria-label="بستن">
                    <X className="size-5" />
                  </Dialog.Close>
                </div>
                <MediaLibrary
                  type={type}
                  onSelect={(m) => {
                    onChange(m.path);
                    setOpen(false);
                  }}
                />
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
          {value && (
            <Button type="button" size="sm" variant="ghost" onClick={() => onChange(null)}>
              حذف
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
