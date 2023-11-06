import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { isAddress } from "viem";
import { navigate } from "wouter/use-location";

interface FormElements extends HTMLFormControlsCollection {
  amount: HTMLInputElement;
}
interface UsernameFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

function isValidEnsName(name: string) {
  return name.length > 6 && name.endsWith(".eth");
}

export default function Home() {
  const [value, setValue] = useState<string>("");

  function handleSubmit(event: React.FormEvent<UsernameFormElement>) {
    event.preventDefault();
    navigate("/#/" + event.currentTarget.elements.amount.value);
  }

  const onInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    setValue(inputValue);

    if (inputValue.endsWith(".eth")) {
      if (isValidEnsName(inputValue)) {
        event.target.setCustomValidity("");
      } else {
        event.target.setCustomValidity("Invalid ENS name");
      }
    } else if (isAddress(inputValue)) {
      event.target.setCustomValidity("");
    } else {
      event.target.setCustomValidity("Invalid address");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>pyusd.to</CardTitle>
        <CardDescription>
          Pay with any token. Receiver gets PYUSD.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-2">
          <div className="grid w-full items-center gap-4">
            <div className="space-y-1">
              <Label htmlFor="name">Who are we paying?</Label>
              <div className="flex w-full md:max-w-md items-center space-x-2">
                <Input
                  id="amount"
                  placeholder="ENS or Public Key"
                  value={value}
                  onInput={onInput}
                  spellCheck={false}
                  autoCapitalize="off"
                  autoCorrect="off"
                  required
                />
                <Button
                  type="submit"
                  variant="outline"
                  size="icon"
                  className="disabled:opacity-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}
