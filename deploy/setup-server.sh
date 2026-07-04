#!/usr/bin/env bash
# One-time server setup for PDT dev (run on 167.99.254.211 as deploy user with sudo).
set -euo pipefail

APP_DIR="/var/www/dev.productdesigntalks.eu"
CADDY_SNIPPET="${APP_DIR}/deploy/caddy-dev.productdesigntalks.eu.caddy"
CADDY_FILE="/etc/caddy/Caddyfile"
PM2_APP="pdt-dev"

echo "==> Creating app directory ${APP_DIR}"
sudo mkdir -p "${APP_DIR}"
sudo chown -R "${USER}:${USER}" "${APP_DIR}"

echo "==> Ensuring log directories exist"
sudo mkdir -p /var/log/pm2 /var/log/caddy
sudo chown -R caddy:caddy /var/log/caddy 2>/dev/null || sudo mkdir -p /var/log/caddy

if [ -f "${APP_DIR}/deploy/ecosystem.config.js" ]; then
  if pm2 describe "${PM2_APP}" >/dev/null 2>&1; then
    echo "==> PM2 app ${PM2_APP} already registered"
  else
    echo "==> Registering PM2 app ${PM2_APP}"
    pm2 start "${APP_DIR}/deploy/ecosystem.config.js"
    pm2 save
  fi
else
  echo "WARN: ${APP_DIR}/deploy/ecosystem.config.js not found yet — run after first GitHub deploy"
fi

if [ -f "${CADDY_SNIPPET}" ]; then
  if grep -q 'dev.productdesigntalks' "${CADDY_FILE}" 2>/dev/null; then
    echo "==> Caddy site dev.productdesigntalks already configured"
  else
    echo "==> Adding Caddy snippet for dev.productdesigntalks.eu"
    echo "" | sudo tee -a "${CADDY_FILE}" >/dev/null
    echo "# PDT dev — $(date -u +%Y-%m-%d)" | sudo tee -a "${CADDY_FILE}" >/dev/null
    echo "import ${CADDY_SNIPPET}" | sudo tee -a "${CADDY_FILE}" >/dev/null
    sudo caddy validate --config "${CADDY_FILE}"
    sudo systemctl reload caddy
  fi
else
  echo "WARN: ${CADDY_SNIPPET} not found yet — run after first GitHub deploy"
fi

echo ""
echo "Done. GitHub Actions deploy uses:"
echo "  deploy_path: ${APP_DIR}"
echo "  pm2_app: ${PM2_APP}"
echo "  health_port: 3002"
echo ""
echo "Ensure GitHub repo secrets: SSH_HOST, SSH_USER, SSH_PRIVATE_KEY, GH_PAT"
