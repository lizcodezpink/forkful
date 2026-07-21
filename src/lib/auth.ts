import { randomBytes } from 'node:crypto';
import { cookies } from 'next/headers';
import { getDb } from './db';
import { getUserById } from './data';
import type { User } from './types';

const SESSION_COOKIE = 'foodblog_session';
const SESSION_TTL_DAYS = 30;
const SESSION_TTL_SECONDS = SESSION_TTL_DAYS * 24 * 60 * 60;

export async function createSession(userId: number): Promise<void> {
  const token = randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + SESSION_TTL_SECONDS * 1000).toISOString();

  getDb()
    .prepare('INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)')
    .run(token, userId, expiresAt);

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;

  if (token) {
    getDb().prepare('DELETE FROM sessions WHERE id = ?').run(token);
    store.delete(SESSION_COOKIE);
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  const session = getDb()
    .prepare('SELECT user_id, expires_at FROM sessions WHERE id = ?')
    .get(token) as { user_id: number; expires_at: string } | undefined;

  if (!session) {
    return null;
  }

  if (new Date(session.expires_at).getTime() < Date.now()) {
    getDb().prepare('DELETE FROM sessions WHERE id = ?').run(token);
    return null;
  }

  return getUserById(session.user_id) ?? null;
}
