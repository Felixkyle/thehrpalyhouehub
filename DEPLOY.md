# Deploying the backend (Docker + MongoDB + Nginx/TLS) on the VPS

The whole stack runs with Docker Compose: **MongoDB**, the **backend API**, and **Nginx** (TLS reverse proxy). MongoDB data and uploaded files persist in named volumes.

Target domain for the API: **`api.thehrplayhousehub.org`**

---

## 0. Prerequisites

- A VPS (Ubuntu 22.04+ assumed) with root/sudo.
- DNS: an **A record** for `api.thehrplayhousehub.org` → your VPS IP. Set this first; TLS issuance needs it resolving.
- Ports **80** and **443** open in the firewall.

```bash
# Install Docker + compose plugin (Ubuntu)
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER   # log out/in afterwards

# Firewall
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

---

## 1. Get the code onto the VPS

```bash
git clone <your-repo-url> thehrplayhouseplay
cd thehrplayhouseplay
```

---

## 2. Configure secrets

```bash
cp .env.example .env
nano .env
```

Fill in **every** `CHANGE_ME`:

- `JWT_SECRET` — generate with `openssl rand -hex 32`
- `MONGO_INITDB_ROOT_USERNAME` / `MONGO_INITDB_ROOT_PASSWORD` — pick a strong DB password
- `MONGODB_URI` — **must use the same user/pass** as above, e.g.
  `mongodb://hrplay:YOURPASS@mongo:27017/hrplayhouse?authSource=admin`
- `GEMINI_API_KEY` — from https://aistudio.google.com/apikey
- `RESEND_API_KEY` — from https://resend.com (verify the sending domain first)
- `EMAIL_FROM` — keep `contact@thehrplayhousehub.org` (must be on the verified Resend domain)
- `FRONTEND_URL` — your production frontend origin (for CORS + reset links)

> The `.env` file is git-ignored — it never gets committed.

---

## 3. Issue the TLS certificate (one time)

Nginx's config references certs that don't exist yet, so we issue them with a temporary HTTP-only step.

**a. Start mongo + backend + nginx**, but nginx will fail on the missing cert — so first bring up everything *except* swap to a bootstrap. Easiest path: comment out the `listen 443` server block in `nginx/conf.d/hrplayhouse.conf`, then:

```bash
docker compose up -d --build
```

**b. Run certbot** against the webroot nginx is already serving:

```bash
docker run --rm \
  -v "$PWD/nginx/certbot/conf:/etc/letsencrypt" \
  -v "$PWD/nginx/certbot/www:/var/www/certbot" \
  certbot/certbot certonly --webroot -w /var/www/certbot \
  -d api.thehrplayhousehub.org \
  --email enochid200@gmail.com --agree-tos --no-eff-email
```

**c. Re-enable the `listen 443` block** (uncomment it) and reload:

```bash
docker compose restart nginx
```

> The cert now lives in `nginx/certbot/conf/live/api.thehrplayhousehub.org/`.

---

## 4. Bring the full stack up

```bash
docker compose up -d --build
docker compose ps        # all three services should be "running"/"healthy"
```

---

## 5. Verify

```bash
curl -s https://api.thehrplayhousehub.org/api/health
# → {"status":"ok","timestamp":"..."}
```

Check logs if anything is off:

```bash
docker compose logs -f backend
docker compose logs -f nginx
```

---

## 6. Certificate auto-renewal

Add a cron job that renews and reloads nginx:

```bash
crontab -e
```

```cron
0 3 * * * cd /home/USER/thehrplayhouseplay && docker run --rm -v "$PWD/nginx/certbot/conf:/etc/letsencrypt" -v "$PWD/nginx/certbot/www:/var/www/certbot" certbot/certbot renew --quiet && docker compose restart nginx
```

---

## 7. Day-2 operations

**Deploy a new version:**
```bash
git pull
docker compose up -d --build backend
```

**Back up the database** (dumps to ./backup):
```bash
docker compose exec mongo sh -c 'mongodump --username "$MONGO_INITDB_ROOT_USERNAME" --password "$MONGO_INITDB_ROOT_PASSWORD" --authenticationDatabase admin --archive' > backup/hrplay-$(date +%F).archive
```

**Restore:**
```bash
docker compose exec -T mongo sh -c 'mongorestore --username "$MONGO_INITDB_ROOT_USERNAME" --password "$MONGO_INITDB_ROOT_PASSWORD" --authenticationDatabase admin --archive' < backup/hrplay-DATE.archive
```

**Stop / start:**
```bash
docker compose down       # stop (data volumes persist)
docker compose up -d      # start
```

---

## Notes

- **MongoDB is not exposed publicly** — it's bound to `127.0.0.1:27017` on the host and reachable by the backend over the internal Docker network only.
- **Uploads persist** in the `backend-uploads` volume across redeploys.
- **Email**: if `RESEND_API_KEY` is blank, the backend logs emails instead of sending them — useful for a first smoke test before the domain is verified.
