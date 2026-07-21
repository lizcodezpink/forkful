import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { getBlogBySlug, getUserById, listPosts } from '@/lib/data';
import { formatDate } from '@/lib/format';
import { PostForm } from './post-form';

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = getBlogBySlug(slug);

  if (!blog) {
    return { title: 'Blog not found — Forkful' };
  }

  return {
    title: `${blog.title} — Forkful`,
    description: blog.description || undefined,
  };
}

export default async function BlogPage({ params }: PageProps) {
  const { slug } = await params;
  const blog = getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  const [posts, owner, currentUser] = await Promise.all([
    Promise.resolve(listPosts(blog.id)),
    Promise.resolve(getUserById(blog.owner_id)),
    getCurrentUser(),
  ]);

  const isAdmin = currentUser?.id === blog.owner_id;

  return (
    <div className="space-y-10">
      <header className="rounded-3xl bg-gradient-to-br from-crust-100 to-crust-200 px-6 py-10 sm:px-10">
        <p className="text-sm font-medium text-crust-600">A food blog by @{owner?.username}</p>
        <h1 className="mt-1 text-3xl font-bold text-crust-800 sm:text-4xl">{blog.title}</h1>
        {blog.description ? (
          <p className="mt-3 max-w-2xl text-crust-700">{blog.description}</p>
        ) : null}
        {isAdmin ? (
          <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-sm text-crust-700">
            You&apos;re the admin here ·{' '}
            <Link href="/dashboard" className="font-semibold underline">
              Manage this blog
            </Link>
          </p>
        ) : null}
      </header>

      <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <section className="space-y-6">
          <h2 className="text-xl font-bold text-crust-800">
            {posts.length} {posts.length === 1 ? 'post' : 'posts'}
          </h2>

          {posts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-crust-200 bg-white/60 px-6 py-12 text-center text-crust-600">
              No posts yet. Be the first to share something!
            </div>
          ) : (
            <ul className="space-y-5">
              {posts.map((post) => (
                <li
                  key={post.id}
                  className="rounded-2xl border border-crust-100 bg-white p-6 shadow-sm"
                >
                  <h3 className="text-lg font-bold text-crust-800">{post.title}</h3>
                  <p className="mt-1 text-xs text-crust-500">
                    by {post.author_name} · {formatDate(post.created_at)}
                  </p>
                  <p className="mt-3 whitespace-pre-wrap text-crust-700">{post.body}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <aside className="lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-2xl border border-crust-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-crust-800">Add your post</h2>
            <p className="mt-1 text-sm text-crust-600">
              Anyone can post here — no account needed.
            </p>
            <div className="mt-5">
              <PostForm slug={blog.slug} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
