import type { Metadata } from 'next';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { logoutAction } from './actions';
import './globals.css';

export const metadata: Metadata = {
  title: 'Forkful — food blogs by enthusiasts',
  description:
    'Start your own food blog, share your recipes, and let fellow food lovers post their thoughts.',
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await getCurrentUser();

  return (
    <html lang="en">
      <body className="min-h-screen font-sans antialiased">
        <header className="border-b border-crust-100 bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold text-crust-700">
              <span aria-hidden className="text-2xl">
                🍴
              </span>
              Forkful
            </Link>
            <nav className="flex items-center gap-3 text-sm">
              <Link href="/" className="text-crust-700 hover:text-crust-900">
                Discover
              </Link>
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="text-crust-700 hover:text-crust-900"
                  >
                    Dashboard
                  </Link>
                  <span className="hidden text-crust-400 sm:inline">·</span>
                  <span className="hidden text-crust-600 sm:inline">@{user.username}</span>
                  <form action={logoutAction}>
                    <button
                      type="submit"
                      className="rounded-full border border-crust-200 px-3 py-1 text-crust-700 transition hover:bg-crust-100"
                    >
                      Sign out
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-crust-700 hover:text-crust-900">
                    Log in
                  </Link>
                  <Link
                    href="/signup"
                    className="rounded-full bg-crust-600 px-4 py-1.5 font-medium text-white transition hover:bg-crust-700"
                  >
                    Start your blog
                  </Link>
                </>
              )}
            </nav>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>

        <footer className="mt-16 border-t border-crust-100 py-8 text-center text-sm text-crust-400">
          Forkful · a cozy corner of the internet for food enthusiasts
        </footer>
      </body>
    </html>
  );
}
