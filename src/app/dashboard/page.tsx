import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { getBlogByOwner, listPosts } from '@/lib/data';
import { formatDate } from '@/lib/format';
import { moderatePostAction } from '../actions';
import { BlogSettingsForm } from './blog-settings-form';

export const metadata: Metadata = {
  title: 'Dashboard — Forkful',
};

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  const blog = getBlogByOwner(user.id);
  if (!blog) {
    redirect('/signup');
  }

  const posts = listPosts(blog.id, true);
  const visibleCount = posts.filter((p) => p.hidden === 0).length;

  return (
    <div className="space-y-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-crust-800">Dashboard</h1>
          <p className="text-crust-600">
            Managing <span className="font-semibold">{blog.title}</span>
          </p>
        </div>
        <Link
          href={`/blog/${blog.slug}`}
          className="rounded-full border border-crust-200 px-4 py-2 text-sm font-medium text-crust-700 transition hover:bg-crust-100"
        >
          View public blog →
        </Link>
      </header>

      <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
        <section className="lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-2xl border border-crust-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-crust-800">Blog settings</h2>
            <p className="mt-1 text-sm text-crust-600">
              Public link: <span className="font-mono text-crust-700">/blog/{blog.slug}</span>
            </p>
            <div className="mt-5">
              <BlogSettingsForm title={blog.title} description={blog.description} />
            </div>
          </div>
        </section>

        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-crust-800">Posts</h2>
            <p className="text-sm text-crust-500">
              {visibleCount} visible · {posts.length - visibleCount} hidden
            </p>
          </div>

          {posts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-crust-200 bg-white/60 px-6 py-12 text-center text-crust-600">
              No posts yet. Share your public link and let food lovers post!
            </div>
          ) : (
            <ul className="space-y-4">
              {posts.map((post) => (
                <li
                  key={post.id}
                  className={`rounded-2xl border p-5 shadow-sm ${
                    post.hidden
                      ? 'border-crust-100 bg-crust-50'
                      : 'border-crust-100 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-crust-800">
                        {post.title}
                        {post.hidden ? (
                          <span className="ml-2 rounded-full bg-crust-200 px-2 py-0.5 text-xs font-medium text-crust-700">
                            hidden
                          </span>
                        ) : null}
                      </h3>
                      <p className="mt-0.5 text-xs text-crust-500">
                        by {post.author_name} · {formatDate(post.created_at)}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <form action={moderatePostAction}>
                        <input type="hidden" name="postId" value={post.id} />
                        <input
                          type="hidden"
                          name="intent"
                          value={post.hidden ? 'show' : 'hide'}
                        />
                        <button
                          type="submit"
                          className="rounded-full border border-crust-200 px-3 py-1 text-xs font-medium text-crust-700 transition hover:bg-crust-100"
                        >
                          {post.hidden ? 'Show' : 'Hide'}
                        </button>
                      </form>
                      <form action={moderatePostAction}>
                        <input type="hidden" name="postId" value={post.id} />
                        <input type="hidden" name="intent" value="delete" />
                        <button
                          type="submit"
                          className="rounded-full border border-red-200 px-3 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </div>
                  <p className="mt-3 whitespace-pre-wrap text-sm text-crust-700">{post.body}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
