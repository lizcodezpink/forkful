'use client';

import { useActionState } from 'react';
import { SubmitButton } from '@/components/submit-button';
import { TextAreaField, TextField } from '@/components/form-field';
import { updateBlogAction, type FormState } from '../actions';

const initialState: FormState = {};

export function BlogSettingsForm({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const [state, formAction] = useActionState(updateBlogAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      {state.success ? (
        <p className="rounded-xl bg-basil-500/10 px-4 py-3 text-sm font-medium text-basil-600">
          {state.success}
        </p>
      ) : null}
      {state.error ? (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>
      ) : null}

      <TextField
        label="Blog title"
        name="title"
        required
        defaultValue={state.values?.title ?? title}
        error={state.fieldErrors?.title}
      />
      <TextAreaField
        label="Description"
        name="description"
        rows={3}
        defaultValue={state.values?.description ?? description}
        error={state.fieldErrors?.description}
      />

      <SubmitButton pendingLabel="Saving…">Save changes</SubmitButton>
    </form>
  );
}
