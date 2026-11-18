"use client";

import { MediaLibrary } from "@/components/admin/fields/media-picker";
import { PageHeader, Panel } from "@/components/admin/ui";

export default function MediaPage() {
  return (
    <>
      <PageHeader title="کتابخانه رسانه" description="تصاویر محصولات، عکس‌های کارخانه، ویدیوها و فایل‌های PDF" />
      <Panel>
        <MediaLibrary selectable={false} />
      </Panel>
    </>
  );
}
