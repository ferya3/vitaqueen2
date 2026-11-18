"use client";

import { ImagePlus, Loader2, Star, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ConfirmButton, Panel } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { adminFetch, errorMessage } from "@/lib/admin/api";
import { useAdminQuery } from "@/lib/admin/use-admin-query";
import { cn } from "@/lib/utils";

interface Img {
  id: number;
  url: string;
  is_primary: boolean;
}

export function ProductImages({ productId, canWrite }: { productId: number; canWrite: boolean }) {
  const query = useAdminQuery<{ data: { images: Img[] } }>(`products/${productId}`);
  const images = query.loading ? null : (query.data?.data.images ?? []);
  const load = query.reload;
  const [busy, setBusy] = useState(false);
  const input = useRef<HTMLInputElement>(null);


  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    try {
      for (const file of Array.from(files)) {
        const form = new FormData();
        form.append("file", file);
        await adminFetch(`products/${productId}/images`, { method: "POST", body: form });
      }
      toast.success("تصویر اضافه شد.");
      load();
    } catch (e) {
      toast.error(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  const makePrimary = async (id: number) => {
    await adminFetch(`products/${productId}/images/${id}`, { method: "PATCH", json: { is_primary: true } }).catch((e) => toast.error(errorMessage(e)));
    load();
  };

  const remove = async (id: number) => {
    await adminFetch(`products/${productId}/images/${id}`, { method: "DELETE" }).catch((e) => toast.error(errorMessage(e)));
    load();
  };

  return (
    <Panel
      title="تصاویر محصول"
      actions={
        canWrite && (
          <Button type="button" size="sm" variant="outline" disabled={busy} onClick={() => input.current?.click()}>
            {busy ? <Loader2 className="animate-spin" /> : <ImagePlus />}
            افزودن
          </Button>
        )
      }
    >
      <input ref={input} type="file" hidden multiple accept="image/jpeg,image/png,image/webp,image/avif" onChange={(e) => upload(e.target.files)} />
      {images && images.length === 0 && <p className="text-sm text-muted">هنوز تصویری بارگذاری نشده؛ در سایت تصویر گرافیکی بطری نمایش داده می‌شود.</p>}
      <ul className="grid grid-cols-2 gap-3">
        {images?.map((img) => (
          <li key={img.id} className={cn("group relative aspect-square overflow-hidden rounded-xl border bg-cloud", img.is_primary ? "border-water-500 ring-2 ring-water-200" : "border-line")}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.url} alt="" className="size-full object-contain p-2" />
            {canWrite && (
              <div className="absolute inset-x-1 bottom-1 flex justify-between opacity-0 transition-opacity group-hover:opacity-100">
                <button type="button" onClick={() => makePrimary(img.id)} className="grid size-8 place-items-center rounded-lg bg-white/90 text-warning" title="تصویر اصلی">
                  <Star className={cn("size-4", img.is_primary && "fill-current")} />
                </button>
                <ConfirmButton title="حذف تصویر" onConfirm={() => remove(img.id)} className="grid size-8 place-items-center rounded-lg bg-white/90 text-danger">
                  <Trash2 className="size-4" />
                </ConfirmButton>
              </div>
            )}
          </li>
        ))}
      </ul>
    </Panel>
  );
}
