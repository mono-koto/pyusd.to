'use client';

import { Form } from '@/components/ui/form';
import { SubmitNicknameState, submitNickname } from './actions';

import { useFormState } from 'react-dom';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const initialState: SubmitNicknameState = {
  status: 'idle',
};

export default async function NicknameForm() {
  const [state, formAction] = useFormState(submitNickname, initialState);

  return (
    <>
      <form action={formAction}>
        <Label htmlFor="nickname">Nickname</Label>
        <Input id="nickname" name="nickname" />

        <Label htmlFor="address">Address</Label>
        <Input id="address" name="address" />

        <button type="submit">Send</button>
        <p aria-live="polite" role="status">
          {state.message}
        </p>
        {state.status === 'error' && (
          <p className="text-red-500">{state.message}</p>
        )}
      </form>
    </>
  );
}
