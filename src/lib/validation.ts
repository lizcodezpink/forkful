import { z } from 'zod';

export const slugSchema = z.preprocess(
  (value) =>
    typeof value === 'string'
      ? value.trim().toLowerCase().replace(/^-+|-+$/g, '')
      : value,
  z
    .string()
    .min(3, 'Blog address must be at least 3 characters.')
    .max(40, 'Blog address must be at most 40 characters.')
    .regex(/^[a-z0-9-]+$/, 'Use only lowercase letters, numbers, and hyphens.'),
);

export const signupSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, 'Username must be at least 3 characters.')
    .max(30, 'Username must be at most 30 characters.')
    .regex(/^[a-zA-Z0-9_]+$/, 'Use only letters, numbers, and underscores.'),
  email: z.string().trim().email('Enter a valid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters.').max(200),
  blogTitle: z.string().trim().min(2, 'Blog title must be at least 2 characters.').max(80),
  blogSlug: slugSchema,
  blogDescription: z.string().trim().max(280, 'Description must be at most 280 characters.'),
});

export const loginSchema = z.object({
  username: z.string().trim().min(1, 'Enter your username.'),
  password: z.string().min(1, 'Enter your password.'),
});

export const postSchema = z.object({
  authorName: z.string().trim().max(60, 'Name must be at most 60 characters.'),
  title: z.string().trim().min(2, 'Title must be at least 2 characters.').max(120),
  body: z.string().trim().min(10, 'Post must be at least 10 characters.').max(5000),
});

export const blogUpdateSchema = z.object({
  title: z.string().trim().min(2, 'Blog title must be at least 2 characters.').max(80),
  description: z.string().trim().max(280, 'Description must be at most 280 characters.'),
});

export function slugify(input: string): string {
  return slugifyInput(input).replace(/^-|-$/g, '');
}

/**
 * Live slug transform for typing: lowercases, converts spaces/underscores to
 * hyphens, and drops invalid characters — but keeps a trailing hyphen so the
 * user can type multi-word hyphenated slugs. Trailing hyphens are trimmed on
 * submit by {@link slugSchema} (`.trim()` + the server-side normalization).
 */
export function slugifyInput(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s_-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+/, '')
    .slice(0, 40);
}
