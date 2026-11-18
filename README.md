# وب‌سایت شرکتی کارخانه آب معدنی

وب‌سایت صنعتی در سطح برندهای بین‌المللی با سه هدف: **برندسازی**، **جذب نماینده و فروش عمده** و **اعتمادسازی** (خط تولید، آزمایشگاه، گواهینامه‌ها).

| لایه | فناوری |
|---|---|
| Frontend | Next.js 16 (App Router, Cache Components, PPR) · React 19 · TypeScript |
| UI | Tailwind CSS 4 · کامپوننت‌های سبک shadcn/ui (Radix) · Motion · GSAP ScrollTrigger · Three.js / React Three Fiber |
| Backend | Laravel 13 (REST API) · Sanctum · Policies/RBAC |
| داده | PostgreSQL 16 · Redis 7 (Cache / Queue / Session) |
| زیرساخت | Docker Compose · Nginx · Ubuntu 24.04 · GitHub Actions |
| زبان‌ها | فارسی (پیش‌فرض، RTL) · English · العربية |

```
mineral-water/
├── frontend/         Next.js — سایت عمومی (app/[locale]) + پنل مدیریت (app/admin) + BFF (app/api)
├── backend/          Laravel 13 API — مدل‌ها، کنترلرها، Policyها، سرویس‌ها، تست‌ها
├── infrastructure/   Dockerfileها، Nginx، اسکریپت‌های استقرار و پشتیبان‌گیری
├── docs/             معماری، API، سیستم طراحی، استقرار، چک‌لیست محتوا
└── docker-compose.yml
```

## اصل مهم: هیچ عدد خیالی منتشر نمی‌شود

- شاخص‌های صفحه اصلی (ظرفیت روزانه، سال تأسیس و…) تا زمانی که مدیر عدد واقعی را در **پنل ← تنظیمات** وارد نکند، در سایت **نمایش داده نمی‌شوند** و داشبورد هشدار می‌دهد.
- «تعداد محصولات» و «خطوط تولید» به‌صورت خودکار از پایگاه داده شمرده می‌شوند.
- آنالیز آب (pH، TDS، املاح) و ظرفیت خطوط در داده اولیه خالی است و سایت «به‌زودی» نشان می‌دهد تا گزارش رسمی آزمایشگاه وارد شود.
- گواهینامه‌های اولیه فقط جای‌نگهدار هستند؛ فایل واقعی را بارگذاری کنید یا غیرفعالشان کنید. → [`docs/content-checklist.md`](docs/content-checklist.md)

## اجرای محلی (توسعه)

پیش‌نیاز: PHP 8.3، Composer، Node 20.9+، PostgreSQL 16، Redis 7.

```bash
cd backend && composer install && cp .env.example .env && php artisan key:generate
```

```bash
php artisan migrate --seed && php artisan storage:link && php artisan serve
```

در ترمینال دوم (برای اعلان‌ها و بازسازی خودکار کش سایت):

```bash
cd backend && php artisan queue:work
```

در ترمینال سوم:

```bash
cd frontend && npm install && cp .env.example .env.local && npm run dev
```

- سایت: http://localhost:3000 (به `/fa` هدایت می‌شود)
- پنل مدیریت: http://localhost:3000/admin — کاربر اولیه از `ADMIN_EMAIL` / `ADMIN_PASSWORD` در `backend/.env` ساخته می‌شود (پیش‌فرض `admin@example.com` / `ChangeMe!2026`؛ **بلافاصله تغییر دهید**).

## اجرای Production با Docker

```bash
cp .env.example .env
```

مقادیر `.env` را پر کنید (`APP_KEY`، رمزها، `SITE_URL`) و سپس:

```bash
docker compose up -d --build
```

بار اول برای ساخت مدیر کل و محتوای اولیه:

```bash
docker compose exec backend php artisan db:seed --force
```

جزئیات سرور Ubuntu 24.04، HTTPS، پشتیبان‌گیری و CI/CD: [`docs/deployment/README.md`](docs/deployment/README.md)

## تست و کیفیت کد

```bash
cd backend && php artisan test && vendor/bin/pint --test
```

```bash
cd frontend && npm run lint && npm run typecheck && npm run build
```

## مستندات

- [معماری کلی و تصمیم‌ها](docs/architecture/README.md)
- [Backend: مدل داده، نقش‌ها، امنیت](docs/architecture/backend.md)
- [Frontend: رندر، کش، i18n، انیمیشن](docs/architecture/frontend.md)
- [مرجع API](docs/api/README.md)
- [سیستم طراحی UI/UX](docs/ui-ux/design-system.md)
- [استقرار و نگهداری](docs/deployment/README.md)
- [چک‌لیست محتوا و رسانه (فاز ۴)](docs/content-checklist.md)
