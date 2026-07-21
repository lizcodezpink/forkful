import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md rounded-3xl border border-crust-100 bg-white p-10 text-center shadow-sm">
      <p className="text-5xl">🍽️</p>
      <h1 className="mt-4 text-2xl font-bold text-crust-800">Nothing on this plate</h1>
      <p className="mt-2 text-crust-600">
        We couldn&apos;t find the page you were looking for.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-full bg-crust-600 px-5 py-2.5 font-semibold text-white transition hover:bg-crust-700"
      >
        Back to Forkful
      </Link>
    </div>
  );
}
