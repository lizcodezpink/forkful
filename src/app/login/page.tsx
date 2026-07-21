import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { LoginForm } from './login-form';

export const metadata: Metadata = {
  title: 'Log in — Forkful',
};

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-3xl border border-crust-100 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-crust-800">Welcome back</h1>
        <p className="mt-1 text-crust-600">Log in to manage your blog.</p>
        <div className="mt-6">
          <LoginForm />
        </div>
        <p className="mt-6 text-sm text-crust-600">
          New here?{' '}
          <Link href="/signup" className="font-semibold text-crust-700 underline">
            Start your blog
          </Link>
        </p>
      </div>
    </div>
  );
}
