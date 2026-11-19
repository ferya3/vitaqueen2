#!/usr/bin/env bash
# =============================================================================
#  One-line installer for the mineral-water corporate website (Ubuntu 24.04)
#
#  Fresh install, HTTP on the server IP:
#    curl -fsSL https://raw.githubusercontent.com/ferya3/vitaqueen2/claude/stoic-keller-sk9h27/install.sh | sudo bash
#
#  With a domain + free HTTPS (Let's Encrypt) — the domain's DNS must already point here:
#    curl -fsSL .../install.sh | sudo bash -s -- --domain example.com --email you@example.com
#
#  Re-running the same command updates the code and redeploys (secrets and data are kept).
#
#  Options:
#    --domain NAME          public domain (without http://)
#    --email ADDRESS        Let's Encrypt contact email (enables HTTPS together with --domain)
#    --admin-email ADDRESS  login email of the first super admin (default: admin@<domain> or admin@example.com)
#    --branch NAME          git branch to deploy (default: claude/stoic-keller-sk9h27)
#    --dir PATH             install directory (default: /opt/vitaqueen)
#    --docker-mirror URL    Docker Hub registry mirror (useful where Docker Hub is blocked)
#    --npm-registry URL     npm registry mirror used while building the frontend image
#    --no-swap              do not create a swap file on low-memory servers
# =============================================================================
set -Eeuo pipefail

REPO_URL="https://github.com/ferya3/vitaqueen2.git"
BRANCH="claude/stoic-keller-sk9h27"
DIR="/opt/vitaqueen"
DOMAIN=""
LE_EMAIL=""
ADMIN_EMAIL=""
DOCKER_MIRROR=""
NPM_REGISTRY=""
MAKE_SWAP=1

c_info="\033[1;36m"; c_ok="\033[1;32m"; c_warn="\033[1;33m"; c_err="\033[1;31m"; c_off="\033[0m"
info() { printf "${c_info}==>${c_off} %s\n" "$*"; }
ok()   { printf "${c_ok}✓${c_off} %s\n" "$*"; }
warn() { printf "${c_warn}!${c_off} %s\n" "$*" >&2; }
die()  { printf "${c_err}✗ %s${c_off}\n" "$*" >&2; exit 1; }
trap 'die "Installation failed at line $LINENO. Fix the error above and run the same command again."' ERR

while [ $# -gt 0 ]; do
  case "$1" in
    --domain)        DOMAIN="${2:-}"; shift 2 ;;
    --email)         LE_EMAIL="${2:-}"; shift 2 ;;
    --admin-email)   ADMIN_EMAIL="${2:-}"; shift 2 ;;
    --branch)        BRANCH="${2:-}"; shift 2 ;;
    --dir)           DIR="${2:-}"; shift 2 ;;
    --docker-mirror) DOCKER_MIRROR="${2:-}"; shift 2 ;;
    --npm-registry)  NPM_REGISTRY="${2:-}"; shift 2 ;;
    --no-swap)       MAKE_SWAP=0; shift ;;
    -h|--help)       sed -n '2,26p' "$0" 2>/dev/null || true; exit 0 ;;
    *) die "Unknown option: $1 (use --help)" ;;
  esac
done

DOMAIN="${DOMAIN#http://}"; DOMAIN="${DOMAIN#https://}"; DOMAIN="${DOMAIN%%/*}"
[ "$(id -u)" -eq 0 ] || die "Run as root: curl ... | sudo bash"
if [ -n "$DOMAIN" ] && ! [[ "$DOMAIN" =~ ^[A-Za-z0-9.-]+\.[A-Za-z]{2,}$ ]]; then die "Invalid domain: $DOMAIN"; fi
if [ -n "$LE_EMAIL" ] && [ -z "$DOMAIN" ]; then die "--email needs --domain"; fi

. /etc/os-release 2>/dev/null || true
if [ "${ID:-}" != "ubuntu" ] || [ "${VERSION_ID:-}" != "24.04" ]; then
  warn "This installer is tested on Ubuntu 24.04 (found: ${PRETTY_NAME:-unknown}). Continuing anyway."
fi

export DEBIAN_FRONTEND=noninteractive

# ----------------------------------------------------------------- packages
info "Installing system packages (git, Docker, Compose)"
apt-get update -qq
apt-get install -y -qq ca-certificates curl git openssl >/dev/null
if ! command -v docker >/dev/null 2>&1; then
  # Ubuntu's own packages: available from Ubuntu mirrors everywhere (no download.docker.com needed).
  apt-get install -y -qq docker.io docker-compose-v2 >/dev/null
  apt-get install -y -qq docker-buildx >/dev/null 2>&1 || warn "docker-buildx not installed; Compose will use the classic builder"
fi
docker compose version >/dev/null 2>&1 || apt-get install -y -qq docker-compose-v2 >/dev/null
docker compose version >/dev/null 2>&1 || die "'docker compose' is not available. Install the Docker Compose v2 plugin and re-run."

if [ -n "$DOCKER_MIRROR" ]; then
  info "Configuring Docker registry mirror: $DOCKER_MIRROR"
  if [ -s /etc/docker/daemon.json ] && ! grep -q "$DOCKER_MIRROR" /etc/docker/daemon.json; then
    cp /etc/docker/daemon.json "/etc/docker/daemon.json.bak.$(date +%s)"
    warn "Existing /etc/docker/daemon.json backed up and replaced"
  fi
  mkdir -p /etc/docker
  printf '{\n  "registry-mirrors": ["%s"]\n}\n' "$DOCKER_MIRROR" > /etc/docker/daemon.json
fi
systemctl enable --now docker >/dev/null 2>&1 || true
[ -n "$DOCKER_MIRROR" ] && systemctl restart docker
ok "Docker $(docker version --format '{{.Server.Version}}' 2>/dev/null || echo ready)"

# --------------------------------------------------------------------- swap
mem_mb=$(awk '/MemTotal/ {print int($2/1024)}' /proc/meminfo)
swap_mb=$(awk '/SwapTotal/ {print int($2/1024)}' /proc/meminfo)
if [ "$MAKE_SWAP" -eq 1 ] && [ "$mem_mb" -lt 3500 ] && [ "$swap_mb" -lt 1024 ] && [ ! -f /swapfile ]; then
  info "Low memory (${mem_mb} MB): creating a 4 GB swap file for the image builds"
  fallocate -l 4G /swapfile || dd if=/dev/zero of=/swapfile bs=1M count=4096 status=none
  chmod 600 /swapfile && mkswap /swapfile >/dev/null && swapon /swapfile
  grep -q '^/swapfile ' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi

# --------------------------------------------------------------------- code
FIRST_INSTALL=0
if [ -d "$DIR/.git" ]; then
  info "Updating code in $DIR ($BRANCH)"
  git -C "$DIR" fetch --quiet --depth 1 origin "+refs/heads/$BRANCH:refs/remotes/origin/$BRANCH"
  git -C "$DIR" checkout --quiet -B "$BRANCH" "origin/$BRANCH"
  git -C "$DIR" reset --quiet --hard "origin/$BRANCH"
else
  info "Downloading code into $DIR ($BRANCH)"
  mkdir -p "$(dirname "$DIR")"
  git clone --quiet --depth 1 --branch "$BRANCH" "$REPO_URL" "$DIR"
fi
cd "$DIR"
[ -f .installed ] || FIRST_INSTALL=1

# ---------------------------------------------------------------- settings
set_env() { # set_env KEY VALUE  (create or replace a line in .env)
  if grep -q "^$1=" .env; then sed -i "s|^$1=.*|$1=$2|" .env; else echo "$1=$2" >> .env; fi
}
get_env() { grep "^$1=" .env 2>/dev/null | head -1 | cut -d= -f2-; }
rand() { openssl rand -hex "$1"; }

if [ -n "$DOMAIN" ] && [ -n "$LE_EMAIL" ]; then
  SITE_URL="https://$DOMAIN"; COOKIE_SECURE=true
elif [ -n "$DOMAIN" ]; then
  SITE_URL="http://$DOMAIN"; COOKIE_SECURE=false
elif [ -f .env ] && [ -n "$(get_env SITE_URL)" ]; then
  SITE_URL="$(get_env SITE_URL)"; COOKIE_SECURE="$(get_env ADMIN_COOKIE_SECURE)"
else
  PUBLIC_IP="$(curl -fsS --max-time 5 https://api.ipify.org 2>/dev/null || hostname -I | awk '{print $1}')"
  SITE_URL="http://$PUBLIC_IP"; COOKIE_SECURE=false
fi

if [ ! -f .env ]; then
  info "Generating secrets (.env)"
  ADMIN_PASSWORD="$(openssl rand -base64 18 | tr -dc 'A-Za-z0-9' | head -c 14)$(rand 1)"
  [ -n "$ADMIN_EMAIL" ] || ADMIN_EMAIL="admin@${DOMAIN:-example.com}"
  umask 077
  cat > .env <<EOF
# Generated by install.sh on $(date -u +%FT%TZ). Keep this file private.
SITE_URL=$SITE_URL
HTTP_PORT=80
APP_KEY=base64:$(openssl rand -base64 32)
DB_PASSWORD=$(rand 24)
REVALIDATE_SECRET=$(rand 32)
ADMIN_EMAIL=$ADMIN_EMAIL
ADMIN_PASSWORD=$ADMIN_PASSWORD
ADMIN_COOKIE_SECURE=$COOKIE_SECURE
EOF
  umask 022
else
  info "Keeping existing secrets in $DIR/.env"
  set_env SITE_URL "$SITE_URL"
  set_env ADMIN_COOKIE_SECURE "$COOKIE_SECURE"
  [ -n "$ADMIN_EMAIL" ] && set_env ADMIN_EMAIL "$ADMIN_EMAIL"
fi
[ -n "$NPM_REGISTRY" ] && set_env NPM_REGISTRY "$NPM_REGISTRY"
chmod 600 .env

# -------------------------------------------------------------------- HTTPS
if [ -n "$DOMAIN" ] && [ -n "$LE_EMAIL" ]; then
  info "Setting up HTTPS for $DOMAIN (Let's Encrypt)"
  apt-get install -y -qq certbot >/dev/null
  server_ip="$(curl -fsS --max-time 5 https://api.ipify.org 2>/dev/null || true)"
  domain_ip="$(getent ahostsv4 "$DOMAIN" | awk 'NR==1{print $1}' || true)"
  if [ -n "$server_ip" ] && [ "$domain_ip" != "$server_ip" ]; then
    warn "$DOMAIN resolves to '${domain_ip:-nothing}' but this server is $server_ip — certificate issuance may fail."
  fi
  if [ ! -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
    docker compose stop nginx >/dev/null 2>&1 || true
    certbot certonly --standalone --non-interactive --agree-tos -m "$LE_EMAIL" -d "$DOMAIN" \
      --pre-hook "cd $DIR && (docker compose stop nginx || true)" \
      --post-hook "cd $DIR && (docker compose start nginx || true)"
  fi
  sed "s/__DOMAIN__/$DOMAIN/g" infrastructure/nginx/ssl.conf.template > infrastructure/nginx/ssl.conf
  cat > docker-compose.override.yml <<'EOF'
# Generated by install.sh: enables HTTPS on the nginx service.
services:
  nginx:
    ports: ["443:443"]
    volumes:
      - ./infrastructure/nginx/ssl.conf:/etc/nginx/conf.d/ssl.conf:ro
      - /etc/letsencrypt:/etc/letsencrypt:ro
EOF
  ok "Certificate ready (renewed automatically by the certbot timer)"
fi

if command -v ufw >/dev/null 2>&1 && ufw status | grep -q "Status: active"; then
  ufw allow 80/tcp >/dev/null; ufw allow 443/tcp >/dev/null
fi

# ------------------------------------------------------------------- deploy
info "Building images (first run takes 5–15 minutes)"
docker compose build --pull
info "Starting services"
docker compose up -d --remove-orphans

info "Waiting for the application to become healthy"
healthy=0
HTTP_PORT="$(get_env HTTP_PORT)"; HTTP_PORT="${HTTP_PORT:-80}"
for _ in $(seq 1 90); do
  if curl -fsS -o /dev/null -H "Host: localhost" "http://127.0.0.1:$HTTP_PORT/up"; then healthy=1; break; fi
  sleep 3
done
[ "$healthy" -eq 1 ] || { docker compose ps; docker compose logs --tail 60 backend; die "API did not become healthy"; }

if [ "$FIRST_INSTALL" -eq 1 ]; then
  info "Creating the super admin and starter content"
  docker compose exec -T backend php artisan db:seed --force
  date -u +%FT%TZ > .installed
else
  docker compose exec -T backend php artisan queue:restart >/dev/null || true
fi
docker image prune -f >/dev/null 2>&1 || true

# ------------------------------------------------------------------ summary
CRED_FILE=/root/vitaqueen-credentials.txt
{
  echo "Website:      $SITE_URL"
  echo "Admin panel:  $SITE_URL/admin"
  echo "Admin email:  $(get_env ADMIN_EMAIL)"
  echo "Admin pass:   $(get_env ADMIN_PASSWORD)   (change it after the first login if you shared this output)"
  echo "Install dir:  $DIR"
} > "$CRED_FILE"
chmod 600 "$CRED_FILE"

echo
ok "Installation complete"
cat "$CRED_FILE"
echo
echo "Saved to $CRED_FILE. Update later by running the same install command again."
echo "Logs:    cd $DIR && docker compose logs -f"
echo "Backup:  cd $DIR && ./infrastructure/deployment/backup.sh"
