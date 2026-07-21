# 🍴 Forkful

A cozy blogging platform for food enthusiasts. Anyone can sign up, get their own
blog (and become its admin), and any visitor — no account required — can post to
any blog.

Built as a self-contained **Next.js (App Router) + SQLite** app.

## Features

- **Sign up → your own blog.** Creating an account provisions a blog at
  `/blog/<your-slug>` and makes you its **admin**.
- **Anonymous posting.** Any visitor can submit a post (name optional) to any
  blog. No login needed.
- **Admin dashboard.** Blog owners can edit their blog's title/description and
  **hide** or **delete** posts on their blog.
- **Sessions & auth.** Cookie-based sessions with passwords hashed using Node's
  `scrypt` (no third-party auth service).
- **Local persistence.** Data is stored in a local SQLite database via
  `better-sqlite3`; the schema is created automatically on first run.

## Tech stack

| Concern        | Choice                                    |
| -------------- | ----------------------------------------- |
| Framework      | Next.js 16 (App Router, Server Actions)   |
| UI             | React 19 + Tailwind CSS v4                |
| Persistence    | SQLite (`better-sqlite3`)                 |
| Validation     | Zod                                       |
| Auth           | Cookie sessions + `scrypt` password hashing |

## Getting started

Requires **Node >= 22** and **pnpm**.

```bash
pnpm install
pnpm seed        # optional: add a few sample blogs & posts
pnpm dev         # http://localhost:3000
```

The database file is created at `data/foodblog.db` (override with the
`FOODBLOG_DB_PATH` env var). The `data/` directory is git-ignored.

### Seeded demo accounts

`pnpm seed` creates a few blogs. Each demo account uses the password
`password123`:

- `chef_maria` → `/blog/weeknight-kitchen`
- `bakerben` → `/blog/sourdough-diaries`
- `spicequeen` → `/blog/fire-and-spice`

## Scripts

| Script           | Description                          |
| ---------------- | ------------------------------------ |
| `pnpm dev`       | Start the dev server                 |
| `pnpm build`     | Production build (also type-checks)  |
| `pnpm start`     | Run the production build             |
| `pnpm lint`      | ESLint                               |
| `pnpm typecheck` | `tsc --noEmit`                       |
| `pnpm seed`      | Insert sample data                   |

## Project structure

```
src/
  app/
    actions.ts            # server actions (signup, login, posting, moderation)
    page.tsx              # home — discover blogs
    signup/ login/        # auth pages + forms
    blog/[slug]/          # public blog page + anonymous post form
    dashboard/            # admin: blog settings + post moderation
  components/             # shared form field + submit button UI
  lib/
    db.ts                 # SQLite connection + schema
    data.ts               # typed queries
    auth.ts               # session cookies + current user
    password.ts           # scrypt hash/verify
    validation.ts         # zod schemas
scripts/seed.ts           # sample data
```

## Data model

- **users** — account credentials (username, email, `scrypt` hash).
- **blogs** — one per user; `owner_id` is the admin.
- **posts** — belong to a blog; `author_name` is free-text (anonymous), `hidden`
  flag toggled by the admin.
- **sessions** — server-side session tokens referenced by an httpOnly cookie.

## Notes & tradeoffs

- SQLite + `better-sqlite3` keeps the app fully self-contained and easy to run
  locally. For multi-instance production hosting, swap in a networked database.
- Posting is open by design (the requested behavior). Basic length/validation
  guards are in place; add rate-limiting or spam filtering before real-world use.
