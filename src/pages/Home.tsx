import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "wouter";
import { navigate } from "wouter/use-location";

interface FormElements extends HTMLFormControlsCollection {
  amount: HTMLInputElement;
}
interface UsernameFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

export default function Home() {
  function handleSubmit(event: React.FormEvent<UsernameFormElement>) {
    event.preventDefault();
    navigate("/#/" + event.currentTarget.elements.amount.value);
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>PYUSD Inbox</CardTitle>
        <CardDescription>
          Send any token to an address. The recipient gets PYUSD
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Search</Label>
              <Input id="amount" placeholder="0x..." />
            </div>
          </div>
        </form>
        <div className="flex flex-col space-y-1.5">
          <Link className="text-xs" href="/about">
            PayPal user? Click here
          </Link>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button>Search</Button>
      </CardFooter>
    </Card>
  );
}
