import { GetLink } from "@/components/GetLink";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function HomeGetPaidCard() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Receive</CardTitle>
        <CardDescription>
          Get a PYUSD.to link for your PayPal or ETH wallet
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <GetLink />
      </CardContent>
    </Card>
  );
}
