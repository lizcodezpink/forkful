'use client';

import { useActionState } from 'react';
import { SubmitButton } from '@/components/submit-button';
import { TextField } from '@/components/form-field';
import { loginAction, type FormState } from '../actions';

const initialState: FormState = {};

export function LoginForm() {
  const [state, formAction] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-5">
      {state.error ? (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>
      ) : null}

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
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        error={state.fieldErrors?.password}
      />

      <SubmitButton pendingLabel="Logging in…">Log in</SubmitButton>
    </form>
  );
}
