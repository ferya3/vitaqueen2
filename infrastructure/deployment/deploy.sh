#!/usr/bin/env bash
# Zero-surprise deployment: pull, build, migrate (inside the backend entrypoint), restart.
# Usage: ./infrastructure/deployment/deploy.sh [git-ref]
set -euo pipefail

cd "$(dirname "$0")/../.."
REF="${1:-main}"

[ -f .env ] || { echo "Missing .env (copy .env.example and fill in secrets)"; exit 1; }
grep -q '^APP_KEY=base64:' .env || { echo "APP_KEY is not set in .env"; exit 1; }

echo "→ Backing up database before deploy"
./infrastructure/deployment/backup.sh || echo "warning: backup failed (first deploy?)"

echo "→ Updating code to $REF"
git fetch --prune origin
git checkout "$REF"
git pull --ff-only origin "$REF"

echo "→ Building images"
docker compose build --pull

echo "→ Starting services"
docker compose up -d --remove-orphans

echo "→ Waiting for the API health check"
for i in $(seq 1 30); do
  if docker compose exec -T nginx wget -qO- http://127.0.0.1/up >/dev/null 2>&1; then break; fi
  sleep 2
done

# First deploy only: create the super admin and starter content.
if [ "${SEED:-false}" = "true" ]; then
  docker compose exec -T backend php artisan db:seed --force
fi

docker compose exec -T backend php artisan queue:restart
docker image prune -f >/dev/null
echo "✓ Deployed $(git rev-parse --short HEAD)"
