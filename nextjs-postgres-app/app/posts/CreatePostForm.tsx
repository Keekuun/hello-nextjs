'use client';

import { createPost } from '@/app/actions/postActions';
import {useActionState} from "react";

function SubmitButton({isPending}: {isPending: boolean}) {
  return (
    <button type="submit" disabled={isPending}>
      {isPending ? 'Submitting...' : 'Create Post'}
    </button>
  );
}

export function CreatePostForm() {
  const initialState = { message: '', errors: undefined };
  // useFormState 是处理 Server Action 响应的 React Hook
  const [state, formAction, isPending] = useActionState(createPost, initialState);

  return (
    <form action={formAction}>
      <input name="title" placeholder="Post Title" required />
      {state.errors?.title && <p style={{ color: 'red' }}>{state.errors.title}</p>}

      <textarea name="content" placeholder="Post Content" />

      <SubmitButton isPending={isPending}/>

      {state.message && <p>{state.message}</p>}
    </form>
  );
}
