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
import { Suspense, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import HomeAnimation from '@/components/home-animation';
import { PayPalDialogLink } from '@/components/info-dialogs/paypal-dialog-link';

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
    [router]
  );

  return (
    <>
      <div className="container mt-20 w-full space-y-6 text-center">
        <h1 className="text-4xl font-bold animate-in fade-in-50">
          Send payment to PayPal accounts using whatever tokens
        </h1>
        <h2 className="text-xl text-pink-600 ">
          Easily zap your tokens to PYUSD into any wallet. Share custom links.
          Just gas + swap fees.
        </h2>

        <Card className="text-1xl mx-auto bg-opacity-70 dark:bg-opacity-70 lg:w-2/3">
          <CardContent className="space-y-8 p-6 text-center">
            <form onSubmit={handleSubmit}>
              <div className="w-full">
                <div className="space-y-2">
                  <Label htmlFor="input" className="text-xl">
                    Who is getting paid?
                  </Label>
                  <div className="flex w-full items-center justify-stretch space-x-2 ">
                    <Button
                      type="submit"
                      size="icon"
                      variant="outline"
                      className="flex-shrink-0 flex-grow-0 opacity-0"
                      disabled={loading}
                    >
                      {loading ? (
                        <LuLoader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <LuChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                    <div className="flex-1">
                      <Input
                        id="input"
                        className="w-full text-center text-xl"
                        placeholder="ENS, public key, or custom pyusd.to name"
                        spellCheck={false}
                        autoCapitalize="off"
                        autoCorrect="off"
                        autoComplete="off"
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      size="icon"
                      variant="outline"
                      className="flex-shrink-0 flex-grow-0  disabled:opacity-50"
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
            </form>
            <div className="text-xl">
              <PayPalDialogLink content="I'm a PayPal user! How do I do this?" />
            </div>
          </CardContent>
        </Card>
      </div>
      <Suspense fallback={<div />}>
        <HomeAnimation />
      </Suspense>
    </>
  );
}
