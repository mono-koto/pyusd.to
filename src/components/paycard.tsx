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
import { GetQuotePage } from "./quote";

export function PayCard() {
  return (
    <Card className="w-[350px]">
      <GetQuotePage />
      <CardHeader>
        <CardTitle>PYUSD Inbox</CardTitle>
        <CardDescription>Send any token to …</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Amount</Label>
              <Input id="amount" placeholder="0.1 ETH" />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Send</Button>
      </CardFooter>
    </Card>
  );
}
