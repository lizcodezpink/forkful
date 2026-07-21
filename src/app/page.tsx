import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { listBlogs } from '@/lib/data';

export default async function HomePage() {
  const [blogs, user] = await Promise.all([
    Promise.resolve(listBlogs()),
    getCurrentUser(),
  ]);

  return (
    <div className="space-y-12">
      <section className="rounded-3xl bg-gradient-to-br from-crust-100 to-crust-200 px-6 py-14 text-center sm:px-12">
        <h1 className="mx-auto max-w-2xl text-balance text-4xl font-bold text-crust-800 sm:text-5xl">
          Every food lover deserves their own kitchen table.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-crust-700">
          Start your own food blog in seconds. Share recipes and stories, and let anyone who
          stops by pull up a chair and post too.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {user ? (
            <Link
              href="/dashboard"
              className="rounded-full bg-crust-600 px-6 py-3 font-semibold text-white transition hover:bg-crust-700"
            >
              Go to your dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/signup"
                className="rounded-full bg-crust-600 px-6 py-3 font-semibold text-white transition hover:bg-crust-700"
              >
                Start your blog — it&apos;s free
              </Link>
              <Link
                href="/login"
                className="rounded-full border border-crust-300 px-6 py-3 font-semibold text-crust-700 transition hover:bg-white"
              >
                Log in
              </Link>
            </>
          )}
        </div>
      </section>

      <section>
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-crust-800">Discover food blogs</h2>
            <p className="text-crust-600">Browse blogs from the community and leave a post.</p>
          </div>
        </div>

        {blogs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-crust-200 bg-white/60 px-6 py-16 text-center">
            <p className="text-lg font-medium text-crust-700">No blogs yet.</p>
            <p className="mt-1 text-crust-600">
              Be the first to{' '}
              <Link href="/signup" className="font-semibold text-crust-700 underline">
                start a food blog
              </Link>
              .
            </p>
          </div>
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <li key={blog.id}>
                <Link
                  href={`/blog/${blog.slug}`}
                  className="flex h-full flex-col rounded-2xl border border-crust-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <h3 className="text-lg font-bold text-crust-800">{blog.title}</h3>
                  <p className="mt-1 line-clamp-3 flex-1 text-sm text-crust-600">
                    {blog.description || 'A food blog waiting to be filled with deliciousness.'}
                  </p>
                  <div className="mt-4 flex items-center justify-between text-xs text-crust-500">
                    <span>by @{blog.owner_username}</span>
                    <span>
                      {blog.post_count} {blog.post_count === 1 ? 'post' : 'posts'}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
