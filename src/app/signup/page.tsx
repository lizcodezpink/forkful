import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { SignupForm } from './signup-form';

export const metadata: Metadata = {
  title: 'Start your food blog — Forkful',
};

export default async function SignupPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="mx-auto max-w-xl">
      <div className="rounded-3xl border border-crust-100 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-crust-800">Start your food blog</h1>
        <p className="mt-1 text-crust-600">
          Create an account and you&apos;ll be the admin of your very own blog.
        </p>
        <div className="mt-6">
          <SignupForm />
        </div>
        <p className="mt-6 text-sm text-crust-600">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-crust-700 underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
