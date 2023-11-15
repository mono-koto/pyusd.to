import EnterAddress from "@/components/EnterAddress";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function HomePayCard() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Send</CardTitle>
        <CardDescription>
          Pay any wallet address PYUSD using any token
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <EnterAddress />
      </CardContent>
    </Card>
  );
}
