# معماری کلی

```
                         ┌─────────────────────────── Nginx (80/443) ───────────────────────────┐
 Browser ──HTTPS──▶      │  /api/v1/*  ──FastCGI──▶ Laravel (PHP-FPM)                           │
                         │  /storage/* ──static──▶ volume: storage/app/public                   │
                         │  /*         ──proxy───▶ Next.js (node server.js)                     │
                         └──────────────────────────────────────────────────────────────────────┘
 Next.js (SSR / 'use cache')  ──▶ nginx:8080/api/v1 (داخلی، بدون محدودیت نرخ) ──▶ Laravel
 Laravel ──▶ PostgreSQL (داده) · Redis (کش پاسخ‌ها، صف، سشن)
 Laravel queue ──▶ POST frontend:3000/api/revalidate  (بی‌اعتبارسازی کش سایت پس از ویرایش محتوا)
 Laravel queue ──▶ SMTP  (اعلان درخواست نمایندگی / تماس به تیم فروش)
```

## تصمیم‌های کلیدی

| تصمیم | دلیل |
|---|---|
| **Monolith ماژولار** به‌جای Microservice | یک API ماژولار + یک Frontend مستقل؛ توسعه سریع‌تر و نگهداری ساده‌تر برای سایت شرکتی. |
| **Next.js به‌عنوان Frontend و پنل مدیریت** | یک کدبیس UI، یک سیستم طراحی. پنل در `app/admin` به‌صورت SPA کلاینتی است. |
| **BFF برای پنل** (`app/api/admin/*`) | توکن Sanctum فقط در کوکی `httpOnly + SameSite=Strict` نگه‌داری می‌شود و هرگز به جاوااسکریپت مرورگر نمی‌رسد؛ درخواست‌های تغییر‌دهنده با بررسی Origin در برابر CSRF محافظت می‌شوند. |
| **محتوای چندزبانه به‌صورت JSON** (`{"fa":"…","en":"…","ar":"…"}`) | افزودن زبان بدون تغییر اسکیما؛ API عمومی فقط رشته زبان درخواستی را برمی‌گرداند و API مدیریت هر سه را. |
| **کش دو لایه** | Laravel پاسخ‌های عمومی را با کلید نسخه‌دار در Redis نگه می‌دارد (بی‌اعتبارسازی آنی با هر ذخیره). Next.js صفحات را با `'use cache'` + `cacheTag('content')` پیش‌رندر می‌کند و Laravel پس از هر تغییر `revalidateTag` را صدا می‌زند. |
| **Snapshot آفلاین API** (`frontend/data/snapshot`) | `next build` بدون دسترسی به API (مثلاً داخل Docker) موفق می‌شود؛ در زمان اجرا داده زنده جایگزین می‌شود. با `npm run snapshot` به‌روز کنید. |
| **فونت‌های خودمیزبان** (Vazirmatn، Inter) | بدون وابستگی به Google Fonts — سریع‌تر، حریم خصوصی بهتر و پایدار برای کاربران داخل ایران. |
| **آمار بازدید بدون کوکی** | شمارش روزانه مسیرها در جدول `page_views`؛ بدون ذخیره IP بازدیدکننده. |

## جریان یک ویرایش محتوا

1. مدیر محتوا در `/admin/products/2` قیمت/مشخصات را ذخیره می‌کند → `PUT /api/admin/products/2` (BFF) → Laravel.
2. Laravel اعتبارسنجی + پاک‌سازی HTML می‌کند، رکورد را ذخیره و در `activity_logs` ثبت می‌کند.
3. Trait `FlushesPublicCache` نسخه کش عمومی را افزایش می‌دهد و Job `RevalidateFrontend` را در صف می‌گذارد.
4. Worker درخواست `POST /api/revalidate` را با `X-Revalidate-Secret` به Next.js می‌فرستد → `revalidateTag('content')`.
5. بازدیدکننده بعدی صفحه به‌روزشده را می‌بیند (stale-while-revalidate).
