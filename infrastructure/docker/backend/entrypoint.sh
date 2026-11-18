#!/bin/sh
set -e

# Production boot tasks. RUN_MIGRATIONS=true is set only on the "backend"
# service so the worker/scheduler containers do not race on migrations.
if [ "${RUN_MIGRATIONS:-false}" = "true" ]; then
  php artisan migrate --force --no-interaction
fi

php artisan storage:link --quiet 2>/dev/null || true
php artisan config:cache
php artisan route:cache
php artisan event:cache

exec "$@"
