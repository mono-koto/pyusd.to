import BlockscannerLink from "@/components/BlockscannerLink";
import EnsAvatar from "@/components/EnsAvatar";
import PayForm from "@/components/PayForm";
import { TokenSelect } from "@/components/TokenSelect";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEns } from "@/hooks/useEns";
import { Label } from "@radix-ui/react-label";
import { useParams } from "wouter";

export default function Pay() {
  const params = useParams();
  const recipient = params.address;

  const ens = useEns(recipient);
  console.log(ens.data);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-row gap-4 items-center">
          <EnsAvatar address={recipient} size={60} />
          <div className="space-y-1">
            <div>{ens.data.name}</div>
            <div className="text-foreground text-sm font-normal">
              <BlockscannerLink address={ens.data.address} />
            </div>
          </div>
        </CardTitle>
        {/* <CardDescription>{ens.data.address}</CardDescription> */}
      </CardHeader>
      <CardContent>
        <PayForm recipient={recipient} />
      </CardContent>
    </Card>
  );
}
