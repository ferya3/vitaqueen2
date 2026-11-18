# مرجع API (v1)

پایه: `/api/v1` · قالب: JSON · زبان: `?locale=fa|en|ar` یا هدر `Accept-Language` (پیش‌فرض `fa`).
پاسخ‌ها هدر `Content-Language` دارند. خطاهای اعتبارسنجی: `422` با `{ message, errors: { field: [..] } }`.

## عمومی (کش‌شده)

| متد | مسیر | توضیح |
|---|---|---|
| GET | `/home` | داده تجمیعی صفحه اصلی: settings، محصولات ویژه، مراحل تولید، گواهینامه‌ها، ۳ خبر آخر |
| GET | `/settings` | تنظیمات عمومی (آمار placeholder حذف و آمار خودکار شمارش‌شده) |
| GET | `/categories` | دسته‌بندی‌ها + تعداد محصول |
| GET | `/products?category=&size=small\|medium\|large` | فهرست محصولات فعال |
| GET | `/products/{slug}` | جزئیات محصول + `related` |
| GET | `/articles?type=news\|article&page=&per_page=` | فهرست صفحه‌بندی‌شده (`meta`) |
| GET | `/articles/{slug}` | مقاله + `related` |
| GET | `/certificates?type=certificate\|lab_report\|standard` | |
| GET | `/production-lines` · `/production-steps` | |
| GET | `/pages/{slug}` | `about` · `export` · `privacy` |
| GET | `/sitemap` | slugها و تاریخ تغییر برای sitemap.xml |
| POST | `/representatives` | درخواست نمایندگی (۲۰۱ + `reference`) — محدودیت ۳/دقیقه |
| POST | `/contact` | فرم تماس — `phone` یا `email` الزامی |
| POST | `/track` | `{ "path": "/fa/products" }` شمارش بازدید |

نمونه بدنه درخواست نمایندگی:

```json
{
  "full_name": "علی رضایی", "company_name": "پخش البرز", "phone": "09121234567",
  "email": "ali@example.com", "province": "تهران", "city": "تهران",
  "activity_type": "distributor", "distribution_capacity": "۵۰۰ کارتن", "has_warehouse": true,
  "vehicle_count": 3, "message": "…", "website": "", "form_started_at": 1795025397824
}
```

`activity_type`: `distributor | wholesaler | retailer | exporter | organization` — فیلد `website` باید خالی باشد (honeypot).

## مدیریت (Bearer token — Sanctum)

در مرورگر از طریق BFF فراخوانی می‌شود: `/api/admin/<path>` → `/api/v1/admin/<path>`.

| متد | مسیر | دسترسی |
|---|---|---|
| POST | `/admin/auth/login` | `{email, password}` → `{token, expires_at, user}` (۵ تلاش / ۱۵ دقیقه) |
| GET · POST | `/admin/auth/me` · `/admin/auth/logout` | |
| GET | `/admin/dashboard` | شمارنده‌ها، هشدارها، آخرین درخواست‌ها و رویدادها |
| GET | `/admin/reports?days=7\|30\|90` | سری روزانه بازدید/درخواست، صفحات پربازدید، استان‌ها |
| CRUD | `/admin/products` · `categories` · `articles` · `pages` · `certificates` · `production-lines` · `production-steps` · `users` | `index` از `?search=`، `?filter[col]=`، `?sort=-id`، `?per_page=` پشتیبانی می‌کند |
| POST · PATCH · DELETE | `/admin/products/{id}/images[/{image}]` | آپلود (`file`) یا انتخاب از کتابخانه (`media_id`)، `is_primary` |
| GET · PATCH · DELETE | `/admin/representatives[/{id}]` | `status`، `assigned_to`، `admin_notes` |
| GET | `/admin/representatives/export` | CSV (UTF-8 BOM برای Excel) با همان فیلترها |
| GET · PATCH · DELETE | `/admin/contact-requests[/{id}]` | باز کردن پیام جدید وضعیت را «خوانده شده» می‌کند |
| GET · POST · PATCH · DELETE | `/admin/media[/{id}]` | `?type=image\|document\|video` |
| GET · PUT | `/admin/settings` | `{ settings: [{ key, value, group?, is_public? }] }` |
| GET | `/admin/activity-logs` | فقط مدیر کل |

فیلدهای ترجمه‌ای در API مدیریت به‌صورت شیء ارسال/دریافت می‌شوند: `"name": { "fa": "…", "en": "…", "ar": "…" }` (فارسی الزامی).
