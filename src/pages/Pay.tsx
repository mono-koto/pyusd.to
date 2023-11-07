import BlockscannerLink from "@/components/BlockscannerLink";
import EnsAvatar from "@/components/EnsAvatar";
import PayForm from "@/components/PayForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEns } from "@/hooks/useEns";
import { useParams } from "wouter";
import { HeartCrack, Loader2 } from "lucide-react";

export default function Pay() {
  const params = useParams();
  const recipient = params.address;

  const ens = useEns(recipient);

  if (ens.data.name && ens.isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 opacity-70">
        <Loader2 className="h-12 w-12 animate-spin" />
        Reticulating splines for {recipient}...
      </div>
    );
  }

  if (ens.isFetched && ens.data.name && !ens.data.address) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 opacity-70">
        <HeartCrack className="h-12 w-12" />
        Unabled to find address for {recipient}...
      </div>
    );
  }

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
      </CardHeader>
      <CardContent>
        <PayForm recipient={recipient} />
      </CardContent>
    </Card>
  );
}
