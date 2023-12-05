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
import { LuChevronRight, LuLoader2 } from 'react-icons/lu';
import { useCallback, useState } from 'react';
import { isAddress } from 'viem';
import { useRouter } from 'next/navigation';

interface FormElements extends HTMLFormControlsCollection {
  input: HTMLInputElement;
}
interface UsernameFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    (event: React.FormEvent<UsernameFormElement>) => {
      event.preventDefault();
      router.push('/' + event.currentTarget.elements.input.value);
      setLoading(true);
    },
    []
  );

  return (
    <div className="flex w-full flex-col items-center gap-8">
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
                    id="input"
                    placeholder="ENS, public key, or custom pyusd.to name"
                    spellCheck={false}
                    autoCapitalize="off"
                    autoCorrect="off"
                    autoComplete="off"
                    required
                  />
                  <Button
                    type="submit"
                    size="icon"
                    variant="outline"
                    className="disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? (
                      <LuLoader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <LuChevronRight className="h-4 w-4" />
                    )}
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
