'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createSession, destroySession, getCurrentUser } from '@/lib/auth';
import {
  createPost,
  createUserWithBlog,
  deletePost,
  getBlogByOwner,
  getBlogBySlug,
  getPost,
  getUserByUsername,
  setPostHidden,
  updateBlog,
} from '@/lib/data';
import { verifyPassword } from '@/lib/password';
import {
  blogUpdateSchema,
  loginSchema,
  postSchema,
  signupSchema,
} from '@/lib/validation';

export type FormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
  success?: string;
  values?: Record<string, string>;
};

function fieldErrorsFrom(
  issues: { path: PropertyKey[]; message: string }[],
): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of issues) {
    const key = String(issue.path[0] ?? '');
    if (key && !errors[key]) {
      errors[key] = issue.message;
    }
  }
  return errors;
}

export async function signupAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const raw = {
    username: String(formData.get('username') ?? ''),
    email: String(formData.get('email') ?? ''),
    password: String(formData.get('password') ?? ''),
    blogTitle: String(formData.get('blogTitle') ?? ''),
    blogSlug: String(formData.get('blogSlug') ?? ''),
    blogDescription: String(formData.get('blogDescription') ?? ''),
  };

  const parsed = signupSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: fieldErrorsFrom(parsed.error.issues), values: raw };
  }

  const result = createUserWithBlog(parsed.data);
  if (!result.ok) {
    return { fieldErrors: { [result.field]: result.message }, values: raw };
  }

  await createSession(result.userId);
  redirect('/dashboard');
}

export async function loginAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const raw = {
    username: String(formData.get('username') ?? ''),
    password: String(formData.get('password') ?? ''),
  };

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: fieldErrorsFrom(parsed.error.issues), values: raw };
  }

  const user = getUserByUsername(parsed.data.username);
  if (!user || !verifyPassword(parsed.data.password, user.password_hash)) {
    return { error: 'Invalid username or password.', values: { username: raw.username } };
  }

  await createSession(user.id);
  redirect('/dashboard');
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect('/');
}

export async function createPostAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const slug = String(formData.get('slug') ?? '');
  const blog = getBlogBySlug(slug);

  if (!blog) {
    return { error: 'This blog no longer exists.' };
  }

  const raw = {
    authorName: String(formData.get('authorName') ?? '').trim(),
    title: String(formData.get('title') ?? ''),
    body: String(formData.get('body') ?? ''),
  };

  const parsed = postSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: fieldErrorsFrom(parsed.error.issues), values: raw };
  }

  createPost({
    blogId: blog.id,
    authorName: parsed.data.authorName || 'Anonymous',
    title: parsed.data.title,
    body: parsed.data.body,
  });

  revalidatePath(`/blog/${slug}`);
  return { success: 'Your post has been published!' };
}

export async function updateBlogAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await getCurrentUser();
  if (!user) {
    return { error: 'You must be signed in.' };
  }

  const blog = getBlogByOwner(user.id);
  if (!blog) {
    return { error: 'You do not have a blog yet.' };
  }

  const raw = {
    title: String(formData.get('title') ?? ''),
    description: String(formData.get('description') ?? ''),
  };

  const parsed = blogUpdateSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: fieldErrorsFrom(parsed.error.issues), values: raw };
  }

  updateBlog(blog.id, parsed.data);
  revalidatePath('/dashboard');
  revalidatePath(`/blog/${blog.slug}`);
  return { success: 'Blog details saved.' };
}

async function assertOwnsPost(postId: number): Promise<string | null> {
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }

  const blog = getBlogByOwner(user.id);
  if (!blog) {
    return null;
  }

  const post = getPost(postId);
  if (!post || post.blog_id !== blog.id) {
    return null;
  }

  return blog.slug;
}

export async function moderatePostAction(formData: FormData): Promise<void> {
  const postId = Number(formData.get('postId'));
  const intent = String(formData.get('intent') ?? '');
  const slug = await assertOwnsPost(postId);

  if (!slug) {
    return;
  }

  if (intent === 'delete') {
    deletePost(postId);
  } else if (intent === 'hide') {
    setPostHidden(postId, true);
  } else if (intent === 'show') {
    setPostHidden(postId, false);
  }

  revalidatePath('/dashboard');
  revalidatePath(`/blog/${slug}`);
}
