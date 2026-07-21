'use client';

import { useFormStatus } from 'react-dom';

type SubmitButtonProps = {
  children: React.ReactNode;
  pendingLabel?: string;
  className?: string;
};

export function SubmitButton({ children, pendingLabel, className }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={
        className ??
        'inline-flex items-center justify-center rounded-full bg-crust-600 px-5 py-2.5 font-semibold text-white transition hover:bg-crust-700 disabled:cursor-not-allowed disabled:opacity-60'
      }
    >
      {pending ? (pendingLabel ?? 'Working…') : children}
    </button>
  );
}
