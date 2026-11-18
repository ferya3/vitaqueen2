# سیستم طراحی

هویت بصری: **آب، طبیعت، تکنولوژی** — مینیمال و لوکس، فضای سفید زیاد، گوشه‌های نرم، سایه‌های بسیار ظریف.
توکن‌ها در `frontend/app/globals.css` (`@theme` در Tailwind 4) تعریف شده‌اند.

## رنگ

| نقش | توکن | مقدار |
|---|---|---|
| Deep Blue (برند، تیترها، بخش‌های تیره) | `deep-600` | `#073B59` |
| Water Blue (اکشن اصلی، تأکید) | `water-500` | `#13A8CE` |
| Ice Blue (هایلایت روی زمینه تیره) | `ice` | `#8DD9E9` |
| Cloud (زمینه بخش‌ها) | `cloud` | `#F3F8FA` |
| متن | `ink` / `muted` | `#0B2233` / `#5B7486` |
| وضعیت | `success` / `warning` / `danger` | فقط برای وضعیت — همیشه همراه برچسب متنی |

مقیاس کامل `deep-50…950` و `water-50…900` برای حالت‌ها (hover، border، پس‌زمینه) در دسترس است.
نمودارهای پنل: سری ۱ `#13A8CE`، سری ۲ `#E08A2E` (با اسکریپت اعتبارسنجی رنگ‌کوری بررسی شده؛ چون کنتراست زیر ۳:۱ است، راهنما + نمای جدول ارائه شده).

## تایپوگرافی

- فارسی/عربی: **Vazirmatn** (متغیر) · انگلیسی و اعداد لاتین: **Inter** (متغیر) — هر دو خودمیزبان.
- تیترها: وزن ۷۰۰–۸۰۰، `tracking-tight` · متن: ۴۰۰ · ارتفاع خط فارسی ۱٫۹.
- مقادیر لاتین داخل متن راست‌به‌چپ (تلفن، ایمیل، SKU) با کلاس `ltr-value` ایزوله می‌شوند.

## واکنش‌گرایی (Mobile-first)

| دستگاه | عرض مرجع | breakpoint |
|---|---|---|
| موبایل | 360–430px | پیش‌فرض |
| تبلت | 768px | `md` |
| لپ‌تاپ | 1280px | `xl` (منوی کامل از اینجا) |
| دسکتاپ بزرگ | 1440–1920px | `container-x` حداکثر 1320px |

## کامپوننت‌ها

`components/ui`: Button (primary · deep · outline · glass · ghost · link · danger)، Input/Textarea/Select/Label/FieldError، Badge، SectionHeading، StepIcon.
`components/layout`: SiteHeader (شفاف روی Hero → شیشه‌ای هنگام اسکرول)، SiteFooter، PageHero (بنر تیره صفحات داخلی + breadcrumb + JSON-LD)، LocaleSwitcher.
`components/products`: ProductCard، BottleIllustration (SVG رویه‌ای بر اساس حجم و رنگ شاخص — تا زمان عکاسی واقعی)، BottleShowcase/Bottle3D.

## حرکت

- منحنی پایه: `--ease-water: cubic-bezier(0.22, 1, 0.36, 1)`؛ مدت ۰٫۳–۰٫۹ ثانیه.
- انیمیشن فقط در خدمت معنا: ورود تدریجی محتوا، شمارنده آمار، روایت اسکرولی تولید، بطری سه‌بعدی.
- `prefers-reduced-motion`: همه انیمیشن‌های CSS حذف، Motion کاهش‌یافته، GSAP بدون pin، بطری SVG ثابت.

## دسترس‌پذیری

لینک «رفتن به محتوا»، `focus-visible` واضح، `aria-current` در منو، برچسب برای همه فیلدها، پیام خطا با `role="alert"`، کنتراست متن مطابق AA، هدف لمسی ≥ 40px.
