# Carlos González (Gzo) — Portfolio Website

Full-stack artist portfolio built with Next.js 14, Tailwind CSS, PostgreSQL (Prisma), Cloudinary, and NextAuth.

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router, TypeScript) |
| Styling | Tailwind CSS, Playfair Display + Inter fonts |
| Database | PostgreSQL via Prisma ORM |
| Images | Cloudinary |
| Auth | NextAuth.js v4 (JWT, credentials) |
| Email | Resend |
| Deploy | Render.com |

---

## Local setup

### 1. Clone and install

```bash
git clone <your-repo>
cd carlosgonzales
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Fill in `.env`:

| Variable | Where to get it |
|----------|----------------|
| `DATABASE_URL` | Your local PostgreSQL or a Render/Supabase connection string |
| `NEXTAUTH_SECRET` | Run `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `http://localhost:3000` for local dev |
| `CLOUDINARY_*` | [cloudinary.com/console](https://cloudinary.com/console) |
| `RESEND_API_KEY` | [resend.com/api-keys](https://resend.com/api-keys) |
| `ADMIN_EMAIL` | The email address you'll log in with |
| `ADMIN_PASSWORD_HASH` | See step 3 |

### 3. Generate the admin password hash

```bash
npm run hash-password yourpassword
```

Copy the printed hash into `ADMIN_PASSWORD_HASH` in your `.env`.

### 4. Set up the database

```bash
# Push schema to your DB (first time)
npm run db:push

# Or run migrations (production-safe)
npx prisma migrate dev --name init

# Generate Prisma client
npm run db:generate

# Seed admin user + bio text
npm run db:seed
```

### 5. Run the dev server

```bash
npm run dev
# → http://localhost:3000
```

---

## Pages

| URL | Description |
|-----|-------------|
| `/` | Public gallery — masonry grid of paintings |
| `/painting/[id]` | Single painting detail |
| `/about` | Bio page |
| `/contact` | Contact form (sends email via Resend) |
| `/login` | Admin login |
| `/admin/paintings` | Manage all paintings |
| `/admin/paintings/new` | Upload a new painting |
| `/admin/paintings/[id]/edit` | Edit a painting |
| `/admin/bio` | Edit the bio text |

---

## Deploying to Render

### One-click (render.yaml)

1. Push this repo to GitHub.
2. Go to [render.com](https://render.com) → **New** → **Blueprint**.
3. Connect your repo. Render will read `render.yaml` and provision the web service + PostgreSQL database automatically.
4. After the first deploy, go to the web service's **Environment** tab and set the `sync: false` variables:
   - `NEXTAUTH_URL` → your Render URL, e.g. `https://carlosgonzales-portfolio.onrender.com`
   - All `CLOUDINARY_*`, `RESEND_API_KEY`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`
5. Trigger a manual deploy (or push a commit) to pick up the new env vars.
6. After the service is live, run the seed via **Shell** in the Render dashboard:
   ```bash
   npm run db:seed
   ```

### Manual deploy

```bash
# Build
npm run build

# Run migrations against your production DB
DATABASE_URL=<prod-url> npx prisma migrate deploy

# Start
npm start
```

---

## Cloudinary setup

- Create a free account at [cloudinary.com](https://cloudinary.com).
- Images are uploaded to the `carlosgonzales` folder in your cloud.
- When a painting is deleted, its Cloudinary asset is deleted automatically.

## Resend setup

- Create a free account at [resend.com](https://resend.com).
- The contact form sends from `onboarding@resend.dev` (Resend's shared domain — works immediately without DNS setup).
- To send from your own domain, verify it in the Resend dashboard and update the `from` field in `app/api/contact/route.ts`.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run db:seed` | Seed admin user + bio |
| `npm run db:push` | Push schema changes (dev) |
| `npm run db:migrate` | Run migrations (production) |
| `npm run hash-password <pw>` | Generate bcrypt hash for admin password |
