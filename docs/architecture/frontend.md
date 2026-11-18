# Frontend (Next.js 16)

## مسیرها

```
app/
├── [locale]/                 fa | en | ar  (proxy.ts زبان را از کوکی / Accept-Language تشخیص می‌دهد)
│   ├── page.tsx              صفحه اصلی: Hero · برند/آمار · محصولات · روایت تولید (GSAP) · کیفیت · همکاری · اخبار · نقشه/تماس
│   ├── about · products · products/[slug] · production · quality · certificates
│   ├── representatives (همکاری تجاری: نمایندگی، پخش، صادرات، سفارش عمده) · news · news/[slug] · contact · privacy
│   └── opengraph-image.tsx
├── admin/                    پنل مدیریت (RTL، SPA کلاینتی پشت proxy.ts)
│   ├── login · (panel)/page (داشبورد) · [resource] · [resource]/[id] · media · settings · reports · activity
├── api/admin/[...path]       BFF → Laravel /api/v1/admin/*  (کوکی httpOnly → Bearer)
├── api/revalidate            وب‌هوک Laravel برای revalidateTag
├── sitemap.ts · robots.ts · global-not-found.tsx
```

## داده و کش

- `lib/api/public.ts`: همه توابع `'use cache'` + `cacheLife('content')` (۵ دقیقه) + `cacheTag('content')`.
- خطای شبکه → Snapshot (`data/snapshot/<locale>.json`)؛ خطای ۴۰۴ واقعی هرگز با Snapshot جایگزین نمی‌شود.
- صفحات عمومی در زمان build پیش‌رندر می‌شوند (۳ زبان × همه صفحات و محصولات).
- صفحه محصول/مقاله جدیدی که پس از build اضافه شود، در اولین بازدید رندر و سپس کش می‌شود.
- **کد وضعیت ۴۰۴**: با Cache Components پاسخ‌های استریم با ۲۰۰ شروع می‌شوند؛ برای slug ناموجود صفحه «پیدا نشد» همراه `<meta name="robots" content="noindex">` ارسال می‌شود (رفتار مستند Next.js). اگر ۴۰۴ سخت لازم است می‌توان `dynamicParams = false` گذاشت (در این صورت محتوای جدید تا build بعدی دیده نمی‌شود).

## چندزبانگی و RTL

- دیکشنری‌های رابط کاربری: `lib/i18n/dictionaries/{fa,en,ar}.ts` (فارسی مرجع نوع‌هاست؛ کلید جاافتاده خطای TypeScript می‌دهد).
- `<html lang dir>` از روی زبان؛ همه فاصله‌ها با کلاس‌های منطقی (`ps-`، `me-`، `start-`، `end-`) نوشته شده‌اند تا RTL/LTR خودکار باشد.
- اعداد، تاریخ‌ها (تقویم شمسی برای فارسی) و حجم‌ها با `Intl` قالب‌بندی می‌شوند.
- `hreflang` و `x-default` در متادیتای هر صفحه و sitemap.

## انیمیشن و عملکرد

| جلوه | پیاده‌سازی | ملاحظه عملکرد |
|---|---|---|
| Hero | Canvas دوبعدی سبک (نور و حباب) + تیتر با انیمیشن CSS | توقف خارج از دید / تب پنهان؛ تیتر بدون JS نقاشی می‌شود (LCP) |
| بطری سه‌بعدی | R3F + `LatheGeometry` + نورپردازی Lightformer محلی | فقط دسکتاپ با WebGL، بدون Save-Data و reduced-motion؛ `next/dynamic` و بارگذاری هنگام دیده شدن؛ در غیر این صورت SVG |
| روایت تولید | GSAP ScrollTrigger (pin + اسکرول افقی؛ جهت RTL/LTR) | موبایل و reduced-motion: تایم‌لاین عمودی بدون pin |
| ورود محتوا / کارت‌ها | Motion (`whileInView`، stagger، layout) | `MotionConfig reducedMotion="user"` |

Three.js فقط در صفحه اصلی و صفحه محصول دانلود می‌شود.
