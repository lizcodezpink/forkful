'use client';

import { useActionState, useEffect, useRef } from 'react';
import { SubmitButton } from '@/components/submit-button';
import { TextAreaField, TextField } from '@/components/form-field';
import { createPostAction, type FormState } from '../../actions';

const initialState: FormState = {};

export function PostForm({ slug }: { slug: string }) {
  const [state, formAction] = useActionState(createPostAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <input type="hidden" name="slug" value={slug} />

      {state.success ? (
        <p className="rounded-xl bg-basil-500/10 px-4 py-3 text-sm font-medium text-basil-600">
          {state.success}
        </p>
      ) : null}
      {state.error ? (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>
      ) : null}

      <TextField
        label="Your name"
        name="authorName"
        placeholder="Anonymous"
        hint="Optional — leave blank to post as Anonymous."
        defaultValue={state.values?.authorName}
        error={state.fieldErrors?.authorName}
      />
      <TextField
        label="Title"
        name="title"
        placeholder="My take on this recipe…"
        required
        defaultValue={state.values?.title}
        error={state.fieldErrors?.title}
      />
      <TextAreaField
        label="Your post"
        name="body"
        rows={5}
        placeholder="Share a tip, a variation, or your own food story…"
        required
        defaultValue={state.values?.body}
        error={state.fieldErrors?.body}
      />

      <SubmitButton pendingLabel="Posting…">Post to this blog</SubmitButton>
    </form>
  );
}
