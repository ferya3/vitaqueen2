#!/usr/bin/env bash
# One-time hardening + Docker installation for a fresh Ubuntu 24.04 server.
# Usage (as root): bash server-setup.sh deploy-user
set -euo pipefail

USER_NAME="${1:-deploy}"

apt-get update && apt-get -y upgrade
apt-get install -y ca-certificates curl gnupg ufw fail2ban unattended-upgrades git

# Docker Engine + Compose plugin (official repository)
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
  > /etc/apt/sources.list.d/docker.list
apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Deploy user (SSH key login only)
id -u "$USER_NAME" >/dev/null 2>&1 || adduser --disabled-password --gecos "" "$USER_NAME"
usermod -aG docker "$USER_NAME"

# Firewall: SSH + HTTP(S) only
ufw default deny incoming
ufw default allow outgoing
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# SSH hardening
sed -i 's/^#\?PasswordAuthentication .*/PasswordAuthentication no/' /etc/ssh/sshd_config
sed -i 's/^#\?PermitRootLogin .*/PermitRootLogin prohibit-password/' /etc/ssh/sshd_config
systemctl reload ssh

dpkg-reconfigure -f noninteractive unattended-upgrades
systemctl enable --now fail2ban

echo "Done. Clone the repository as $USER_NAME, create .env from .env.example, then run infrastructure/deployment/deploy.sh"
