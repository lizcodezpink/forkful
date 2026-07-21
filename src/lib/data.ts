import { getDb } from './db';
import { hashPassword } from './password';
import type { Blog, BlogWithOwner, Post, User } from './types';

type UserWithHash = User & { password_hash: string };

export function listBlogs(): BlogWithOwner[] {
  return getDb()
    .prepare(
      `SELECT b.*, u.username AS owner_username,
              (SELECT COUNT(*) FROM posts p WHERE p.blog_id = b.id AND p.hidden = 0) AS post_count
       FROM blogs b
       JOIN users u ON u.id = b.owner_id
       ORDER BY b.created_at DESC`,
    )
    .all() as BlogWithOwner[];
}

export function getBlogBySlug(slug: string): Blog | undefined {
  return getDb().prepare('SELECT * FROM blogs WHERE slug = ?').get(slug) as Blog | undefined;
}

export function getBlogByOwner(ownerId: number): Blog | undefined {
  return getDb().prepare('SELECT * FROM blogs WHERE owner_id = ?').get(ownerId) as Blog | undefined;
}

export function getUserByUsername(username: string): UserWithHash | undefined {
  return getDb().prepare('SELECT * FROM users WHERE username = ?').get(username) as
    | UserWithHash
    | undefined;
}

export function getUserById(id: number): User | undefined {
  return getDb()
    .prepare('SELECT id, username, email, created_at FROM users WHERE id = ?')
    .get(id) as User | undefined;
}

export type SignupInput = {
  username: string;
  email: string;
  password: string;
  blogTitle: string;
  blogSlug: string;
  blogDescription: string;
};

export type SignupResult =
  | { ok: true; userId: number }
  | { ok: false; field: 'username' | 'email' | 'blogSlug'; message: string };

export function createUserWithBlog(input: SignupInput): SignupResult {
  const db = getDb();

  if (getUserByUsername(input.username)) {
    return { ok: false, field: 'username', message: 'That username is already taken.' };
  }

  const emailTaken = db.prepare('SELECT 1 FROM users WHERE email = ?').get(input.email);
  if (emailTaken) {
    return { ok: false, field: 'email', message: 'An account with that email already exists.' };
  }

  if (getBlogBySlug(input.blogSlug)) {
    return { ok: false, field: 'blogSlug', message: 'That blog address is already taken.' };
  }

  const tx = db.transaction((data: SignupInput) => {
    const user = db
      .prepare('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)')
      .run(data.username, data.email, hashPassword(data.password));

    const userId = Number(user.lastInsertRowid);

    db.prepare('INSERT INTO blogs (owner_id, slug, title, description) VALUES (?, ?, ?, ?)').run(
      userId,
      data.blogSlug,
      data.blogTitle,
      data.blogDescription,
    );

    return userId;
  });

  return { ok: true, userId: tx(input) };
}

export function updateBlog(
  blogId: number,
  fields: { title: string; description: string },
): void {
  getDb()
    .prepare('UPDATE blogs SET title = ?, description = ? WHERE id = ?')
    .run(fields.title, fields.description, blogId);
}

export function listPosts(blogId: number, includeHidden = false): Post[] {
  const sql = includeHidden
    ? 'SELECT * FROM posts WHERE blog_id = ? ORDER BY created_at DESC'
    : 'SELECT * FROM posts WHERE blog_id = ? AND hidden = 0 ORDER BY created_at DESC';

  return getDb().prepare(sql).all(blogId) as Post[];
}

export function getPost(postId: number): Post | undefined {
  return getDb().prepare('SELECT * FROM posts WHERE id = ?').get(postId) as Post | undefined;
}

export function createPost(input: {
  blogId: number;
  authorName: string;
  title: string;
  body: string;
}): number {
  const result = getDb()
    .prepare('INSERT INTO posts (blog_id, author_name, title, body) VALUES (?, ?, ?, ?)')
    .run(input.blogId, input.authorName, input.title, input.body);

  return Number(result.lastInsertRowid);
}

export function setPostHidden(postId: number, hidden: boolean): void {
  getDb().prepare('UPDATE posts SET hidden = ? WHERE id = ?').run(hidden ? 1 : 0, postId);
}

export function deletePost(postId: number): void {
  getDb().prepare('DELETE FROM posts WHERE id = ?').run(postId);
}

export function slugExists(slug: string): boolean {
  return getBlogBySlug(slug) !== undefined;
}
