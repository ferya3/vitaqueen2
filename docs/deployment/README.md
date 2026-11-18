# استقرار و نگهداری (Ubuntu 24.04 + Docker)

## ۱. آماده‌سازی سرور (یک بار)

```bash
sudo bash infrastructure/deployment/server-setup.sh deploy
```

نصب Docker و Compose، فایروال (فقط 22/80/443)، fail2ban، به‌روزرسانی خودکار امنیتی، غیرفعال‌سازی ورود با رمز SSH.

## ۲. پیکربندی

```bash
git clone <repo> app && cd app && cp .env.example .env
```

در `.env`: `SITE_URL`، `APP_KEY` (با `php -r "echo 'base64:'.base64_encode(random_bytes(32));"`)، `DB_PASSWORD`، `REVALIDATE_SECRET`، `ADMIN_PASSWORD`.
تنظیمات غیرمحرمانه Laravel در `backend/.env.docker` (SMTP، ایمیل مدیر…) است.

## ۳. اولین استقرار

```bash
SEED=true ./infrastructure/deployment/deploy.sh main
```

## ۴. HTTPS

دو گزینه: TLS در CDN (Cloudflare/ArvanCloud) و Nginx روی 80، یا Let's Encrypt:
`infrastructure/nginx/ssl.conf.example` را کپی کنید، پورت 443 و volumeهای `/etc/letsencrypt` و `/var/www/certbot` را به سرویس nginx اضافه کنید و `certbot certonly --webroot` بگیرید.

## ۵. استقرارهای بعدی

```bash
./infrastructure/deployment/deploy.sh main
```

پیش از هر استقرار پشتیبان گرفته می‌شود؛ migrationها خودکار در کانتینر `backend` اجرا می‌شوند؛ worker صف ری‌استارت می‌شود.

## ۶. پشتیبان‌گیری

`infrastructure/deployment/backup.sh` — dump پایگاه داده (`pg_dump` فرمت custom) + آرشیو فایل‌های آپلودی، نگهداری ۱۴ روزه. با cron زمان‌بندی کنید و نسخه‌ها را **خارج از سرور** نگه دارید.

## ۷. CDN و کش

- `/_next/static/*` و فونت‌ها: `immutable` یک‌ساله.
- `/storage/*`: ۳۰ روز.
- HTML صفحات: `s-maxage=300, stale-while-revalidate` از Next.js — CDN می‌تواند همین هدر را رعایت کند.

## ۸. CI/CD

`.github/workflows/ci.yml`: Pint + تست‌های Laravel، migration/seed روی PostgreSQL، lint + typecheck + build فرانت، ساخت هر دو image داکر. برای CD می‌توان پس از سبز شدن main، `deploy.sh` را از طریق SSH اجرا کرد.

## سرویس‌ها

| سرویس | نقش |
|---|---|
| `nginx` | ورودی عمومی + `:8080` داخلی برای SSR |
| `frontend` | Next.js standalone |
| `backend` | PHP-FPM (اجرای migration در شروع) |
| `queue` | ایمیل‌ها و بازسازی کش سایت |
| `scheduler` | پاک‌سازی توکن‌های منقضی، Jobهای ناموفق و لاگ‌های قدیمی |
| `postgres` · `redis` | داده و کش/صف/سشن |
