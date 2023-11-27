'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LuChevronRight } from 'react-icons/lu';
import { useState } from 'react';
import { isAddress } from 'viem';
import { useRouter } from 'next/navigation';

interface FormElements extends HTMLFormControlsCollection {
  amount: HTMLInputElement;
}
interface UsernameFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

function isValidEnsName(name: string) {
  return name.length > 6 && name.endsWith('.eth');
}

export default function Home() {
  const router = useRouter();
  const [value, setValue] = useState<string>('');

  function handleSubmit(event: React.FormEvent<UsernameFormElement>) {
    event.preventDefault();
    router.push('/' + event.currentTarget.elements.amount.value);
  }

  const onInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    setValue(inputValue);

    if (inputValue.endsWith('.eth')) {
      if (isValidEnsName(inputValue)) {
        event.target.setCustomValidity('');
      } else {
        event.target.setCustomValidity('Invalid ENS name');
      }
    } else if (isAddress(inputValue)) {
      event.target.setCustomValidity('');
    } else {
      event.target.setCustomValidity('Invalid address');
    }
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>pyusd.to</CardTitle>
          <CardDescription>
            Pay with any token. Receiver gets PYUSD.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-2">
            <div className="grid w-full items-center gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Who is getting paid?</Label>
                <div className="flex w-full items-center space-x-2 md:max-w-md">
                  <Input
                    id="amount"
                    placeholder="ENS or Public Key, e.g. vitalik.eth"
                    value={value}
                    onInput={onInput}
                    spellCheck={false}
                    autoCapitalize="off"
                    autoCorrect="off"
                    required
                  />
                  <Button
                    type="submit"
                    size="icon"
                    variant="outline"
                    className="disabled:opacity-50"
                  >
                    <LuChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
