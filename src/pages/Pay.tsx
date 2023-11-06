import { TokenCombobox } from "@/components/TokenComboBox";
import { TokenSelect } from "@/components/TokenSelect";
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

export default function Pay() {
  return (
    <Card>
      {/* <GetQuotePage /> */}
      <CardHeader>
        <CardTitle>PYUSD Inbox</CardTitle>
        <CardDescription>Send any token to …</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-row space-x-4">
          <TokenCombobox />
          <TokenSelect />
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Input id="amount" placeholder="0.1 ETH" />
              </div>
            </div>
          </form>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Send</Button>
      </CardFooter>
    </Card>
  );
}
