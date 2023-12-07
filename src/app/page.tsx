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
      <div className="container mt-6 w-full space-y-6 text-center lg:mt-20">
        <div className="mx-auto max-w-2xl space-y-2">
          <h1 className="text-4xl font-bold">
            <span className="bg-semi-transparent">
              Send payment to PayPal accounts using any tokens
            </span>
          </h1>
          <h2 className="text-xl text-pink-600 ">
            <span className="bg-semi-transparent">
              Easily swap your tokens to PYUSD, and zap them into any wallet
              (even PayPal / Venmo)! Claim your custom and easy-to-share link!
            </span>
          </h2>
        </div>

        <Card className="text-1xl mx-auto bg-opacity-70 dark:bg-opacity-70 lg:w-2/3">
          <CardContent className="space-y-8 p-6 text-center">
            <form onSubmit={handleSubmit}>
              <div className="w-full">
                <div className="space-y-2">
                  <Label htmlFor="input" className="text-xl">
                    Who is getting paid?
                  </Label>
                  <div className="flex w-full items-center justify-stretch space-x-2 ">
                    {/* Hiding this button for evenness */}

                    <div className="relative flex-1 self-center">
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
                      <Button
                        type="submit"
                        size="icon"
                        className="absolute right-0 top-0 flex-shrink-0 flex-grow-0 rounded-l-none disabled:opacity-50"
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
              </div>
            </form>
            <div className="text-xl">
              <PayPalDialogLink content="I'm a PayPal user! How do I do this?" />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
