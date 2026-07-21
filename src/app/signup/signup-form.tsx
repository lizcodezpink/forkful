'use client';

import { useActionState, useState } from 'react';
import { SubmitButton } from '@/components/submit-button';
import { TextAreaField, TextField } from '@/components/form-field';
import { slugifyInput } from '@/lib/validation';
import { signupAction, type FormState } from '../actions';

const initialState: FormState = {};

export function SignupForm() {
  const [state, formAction] = useActionState(signupAction, initialState);
  const [slug, setSlug] = useState(state.values?.blogSlug ?? '');

  return (
    <form action={formAction} className="space-y-5">
      {state.error ? (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Username"
          name="username"
          placeholder="chef_alex"
          autoComplete="username"
          required
          defaultValue={state.values?.username}
          error={state.fieldErrors?.username}
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
          defaultValue={state.values?.email}
          error={state.fieldErrors?.email}
        />
      </div>

      <TextField
        label="Password"
        name="password"
        type="password"
        placeholder="At least 8 characters"
        autoComplete="new-password"
        required
        error={state.fieldErrors?.password}
      />

      <hr className="border-crust-100" />
      <p className="text-sm font-semibold text-crust-700">Your blog</p>

      <TextField
        label="Blog title"
        name="blogTitle"
        placeholder="Alex's Kitchen Adventures"
        required
        defaultValue={state.values?.blogTitle}
        error={state.fieldErrors?.blogTitle}
      />

      <div className="space-y-1.5">
        <label htmlFor="blogSlug" className="block text-sm font-semibold text-crust-800">
          Blog address
        </label>
        <div className="flex items-stretch overflow-hidden rounded-xl border border-crust-200 bg-white shadow-sm focus-within:border-crust-400 focus-within:ring-2 focus-within:ring-crust-200">
          <span className="flex items-center whitespace-nowrap border-r border-crust-100 bg-crust-50 px-3 text-sm text-crust-500">
            /blog/
          </span>
          <input
            id="blogSlug"
            name="blogSlug"
            value={slug}
            onChange={(e) => setSlug(slugifyInput(e.target.value))}
            placeholder="alexs-kitchen"
            required
            className="w-full bg-white px-3.5 py-2.5 text-crust-900 outline-none placeholder:text-crust-300"
          />
        </div>
        {state.fieldErrors?.blogSlug ? (
          <p className="text-xs font-medium text-red-600">{state.fieldErrors.blogSlug}</p>
        ) : (
          <p className="text-xs text-crust-500">
            Lowercase letters, numbers, and hyphens. This is your blog&apos;s public link.
          </p>
        )}
      </div>

      <TextAreaField
        label="Short description"
        name="blogDescription"
        rows={3}
        placeholder="What's your blog about? Comfort food, baking, weeknight dinners…"
        defaultValue={state.values?.blogDescription}
        error={state.fieldErrors?.blogDescription}
      />

      <SubmitButton pendingLabel="Creating your blog…">Create my blog</SubmitButton>
    </form>
  );
}
