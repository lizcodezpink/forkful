import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import Database from 'better-sqlite3';

const DB_PATH = process.env.FOODBLOG_DB_PATH ?? join(process.cwd(), 'data', 'foodblog.db');

const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  username      TEXT NOT NULL UNIQUE,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS blogs (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  owner_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  slug        TEXT NOT NULL UNIQUE,
  title       TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS posts (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  blog_id     INTEGER NOT NULL REFERENCES blogs(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  title       TEXT NOT NULL,
  body        TEXT NOT NULL,
  hidden      INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sessions (
  id         TEXT PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  expires_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_posts_blog ON posts(blog_id);
CREATE INDEX IF NOT EXISTS idx_blogs_owner ON blogs(owner_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
`;

// Reuse a single connection across hot reloads in development.
const globalForDb = globalThis as unknown as { __foodblogDb?: Database.Database };

function createDatabase(): Database.Database {
  mkdirSync(dirname(DB_PATH), { recursive: true });

  const db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  db.exec(SCHEMA);

  return db;
}

export function getDb(): Database.Database {
  if (!globalForDb.__foodblogDb) {
    globalForDb.__foodblogDb = createDatabase();
  }

  return globalForDb.__foodblogDb;
}
