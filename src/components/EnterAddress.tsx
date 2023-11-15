import { ChevronRightIcon } from "lucide-react";
import { useState } from "react";
import { isAddress } from "viem";
import { navigate } from "wouter/use-location";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface FormElements extends HTMLFormControlsCollection {
  amount: HTMLInputElement;
}
interface UsernameFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

function isValidEnsName(name: string) {
  return name.length > 6 && name.endsWith(".eth");
}

export default function EnterAddress() {
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
    <form onSubmit={handleSubmit}>
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
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
