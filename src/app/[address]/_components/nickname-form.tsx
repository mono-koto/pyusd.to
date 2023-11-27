'use client';

import { SubmitNicknameState, submitNickname } from '../actions';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFormState } from 'react-dom';

const initialState: SubmitNicknameState = {
  status: 'idle',
};

export default function NicknameForm() {
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
