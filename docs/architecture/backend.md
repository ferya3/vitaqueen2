# Backend (Laravel 13)

## ساختار

```
backend/app/
├── Enums/Role.php                     نقش‌ها و برچسب فارسی
├── Http/
│   ├── Controllers/Api/V1/Public/     API عمومی (کش‌شده، چندزبانه)
│   ├── Controllers/Api/V1/Admin/      API مدیریت — CrudController عمومی + کنترلرهای ویژه
│   ├── Middleware/                    SetLocale · SecurityHeaders · EnsureUserIsActive
│   ├── Requests/{Admin,Public}/       اعتبارسنجی سمت سرور (+ Translatable::rules)
│   └── Resources/                     تبدیل خروجی (رشته محلی برای عموم / همه ترجمه‌ها برای مدیر)
├── Jobs/RevalidateFrontend.php        بی‌اعتبارسازی کش Next.js
├── Models/ (+ Concerns/)              HasTranslations · LogsActivity · FlushesPublicCache · Sortable
├── Notifications/NewLeadReceived.php  ایمیل صف‌شده به تیم فروش
├── Policies/                          ResourcePolicy + یک Policy برای هر مدل
├── Services/                          SettingService · MediaService · LeadService · AnalyticsService
└── Support/                           Locales · PublicCache · HtmlSanitizer · Localize · Digits
```

## مدل داده

| جدول | کاربرد | نکات |
|---|---|---|
| `users` | مدیران | `role`، `is_active`، `last_login_at` |
| `products` | محصولات | فیلدهای ترجمه‌ای JSON، حجم، بسته‌بندی، آنالیز آب، `specs` تکرارشونده، Soft delete |
| `product_images` | تصاویر محصول | دقیقاً یک تصویر اصلی (`is_primary`) |
| `categories` | دسته‌بندی | |
| `pages` | صفحات (درباره ما، صادرات، حریم خصوصی) | `sections` ساختاریافته (مأموریت، چشم‌انداز، تاریخچه…) |
| `articles` | اخبار و مقالات | `type`، زمان‌بندی انتشار با `published_at` |
| `certificates` | گواهینامه، گزارش آزمایش، استاندارد | تاریخ انقضا + فایل PDF |
| `production_lines` | خطوط تولید | ظرفیت اسمی، سایزها، فناوری |
| `production_steps` | مراحل روایت تولید | ترتیب، آیکون |
| `representatives` | درخواست نمایندگی | وضعیت پیگیری، کارشناس مسئول، یادداشت داخلی |
| `contact_requests` | فرم تماس | نوع درخواست، وضعیت |
| `media` | کتابخانه رسانه | ابعاد تصویر، مجموعه |
| `settings` | تنظیمات کلید/مقدار | `is_public` تعیین می‌کند در API عمومی باشد یا نه |
| `activity_logs` | ثبت رویدادهای مدیریتی | ایجاد/ویرایش/حذف/ورود/خروج + فیلدهای تغییر یافته + IP |
| `page_views` | آمار بازدید روزانه | بدون IP و کوکی |

## نقش‌ها و دسترسی (RBAC)

تعریف در `config/aqua.php`؛ هر Policy از `ResourcePolicy` ارث می‌برد. مدیر کل از طریق `Gate::before` همه مجوزها را دارد.

| نقش | دسترسی |
|---|---|
| مدیر کل (`super_admin`) | همه‌چیز، از جمله کاربران و رویدادها |
| مدیر محتوا (`content_manager`) | محصولات، دسته‌بندی، اخبار، صفحات، رسانه، خطوط/مراحل تولید، تنظیمات، گزارش‌ها |
| مسئول فروش (`sales_manager`) | درخواست‌های نمایندگی (+ خروجی CSV)، پیام‌ها، گزارش‌ها، مشاهده فقط‌خواندنی محصولات |
| مسئول کنترل کیفیت (`qc_manager`) | گواهینامه‌ها و گزارش‌های آزمایش، خطوط/مراحل تولید، رسانه |

## امنیت

- **احراز هویت**: Sanctum Bearer با انقضای ۸ ساعته؛ قفل ۱۵ دقیقه‌ای پس از ۵ تلاش ناموفق (بر اساس ایمیل + IP)؛ زمان پاسخ ثابت برای جلوگیری از کشف کاربر؛ ابطال توکن‌ها با غیرفعال‌سازی یا تغییر رمز.
- **اعتبارسنجی سمت سرور** برای همه ورودی‌ها؛ تبدیل ارقام فارسی/عربی به لاتین.
- **ضد اسپم فرم‌ها**: Honeypot، حداقل زمان پرکردن، محدودیت نرخ (۳ در دقیقه / ۲۰ در روز برای هر IP) + محدودیت Nginx.
- **IP واقعی**: فقط پراکسی‌های شبکه خصوصی مورد اعتمادند (`TRUSTED_PROXIES`)؛ جعل `X-Forwarded-For` محدودیت‌ها را دور نمی‌زند (تست دارد).
- **XSS**: HTML ویرایشگر متن غنی با `HtmlSanitizer` (allow-list) پاک‌سازی می‌شود.
- **آپلود**: فقط تصاویر JPG/PNG/WebP/AVIF، PDF و MP4/WebM با سقف حجم؛ نام فایل تصادفی؛ Nginx اجرای فایل در `/storage` را مسدود می‌کند.
- **CSV Injection**: مقادیر خطرناک در خروجی Excel خنثی می‌شوند.
- **Security headers** روی همه پاسخ‌ها؛ HSTS روی HTTPS.
- **Audit log** برای همه تغییرات مدیریتی.
