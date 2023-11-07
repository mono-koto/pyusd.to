import { TokenSelect } from "@/components/TokenSelect";
import { useEns } from "@/hooks/useEns";
import { Label } from "@radix-ui/react-label";
import { Button } from "./ui/button";
import { TokenDisplay } from "./TokenDisplay";

interface PayFormProps {
  recipient?: string;
}

export default function PayForm({ recipient }: PayFormProps) {
  const ens = useEns(recipient);
  console.log(ens.data);

  return (
    <form className="flex flex-col gap-4">
      <div className="rounded-xl border-gray border p-2 flex flex-col">
        <Label className="text-sm">You pay</Label>
        <div className="flex flex-row justify-stretch">
          <input
            placeholder="0.0"
            className="w-full text-4xl h-12 border-none focus:ring-0 focus:outline-none"
          />
          <TokenSelect />
        </div>
        <div className="text-sm text-right">
          <span className="text-gray-500">Balance: 0.0</span>
        </div>
      </div>

      <div className="rounded-xl border-gray border p-2 flex flex-col">
        <Label className="text-sm">Recipient will get</Label>
        <div className="flex flex-row justify-stretch">
          <input
            placeholder="0.0"
            className="w-full text-4xl h-12 border-none focus:ring-0 focus:outline-none"
          />
          <Button className="h-fit rounded-xl p bg-pink-600 hover:bg-pink-500">
            <TokenDisplay token={value || defaultValue} />
          </Button>
        </div>
        <div className="text-sm text-right">
          <span className="text-gray-500">Balance: 0.0</span>
        </div>
      </div>
    </form>
  );
}
