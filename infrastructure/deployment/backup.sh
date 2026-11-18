#!/usr/bin/env bash
# Database + uploaded media backup with retention. Schedule with cron, e.g.:
#   15 3 * * * /home/deploy/app/infrastructure/deployment/backup.sh >> /var/log/aqua-backup.log 2>&1
# Copy the backup directory off-site (rclone / S3 / another server) — a backup on the same disk is not a backup.
set -euo pipefail

cd "$(dirname "$0")/../.."
BACKUP_DIR="${BACKUP_DIR:-/var/backups/mineral-water}"
KEEP_DAYS="${KEEP_DAYS:-14}"
STAMP="$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

docker compose exec -T postgres pg_dump -U aqua -d aqua --format=custom --no-owner > "$BACKUP_DIR/db-$STAMP.dump"
docker compose run --rm --no-deps -T --entrypoint "" -v "$BACKUP_DIR:/backup" backend \
  tar -czf "/backup/storage-$STAMP.tar.gz" -C /var/www/html/storage/app public

find "$BACKUP_DIR" -type f -mtime +"$KEEP_DAYS" -delete
echo "✓ Backup $STAMP written to $BACKUP_DIR"
# Restore: docker compose exec -T postgres pg_restore -U aqua -d aqua --clean < db-<stamp>.dump
