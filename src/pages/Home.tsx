import { GetLink } from "@/components/GetLink";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { useCanonicalSlug } from "@/hooks/useCanonicalSlug";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { Copy } from "lucide-react";
import { useAccount } from "wagmi";
import dogeImage from "../assets/img/doge-computer.png";
import hachathonImage from "../assets/img/hackathon_transparent.png";
import convoImage from "../assets/img/pyusd-convo-bg-mdjrny-2.jpg";
import heroImage from "../assets/img/pyusd-hero-bg-mdjrny.jpeg";

export default function Home() {
  const account = useAccount();
  const modal = useConnectModal();

  const canonicalSlug = useCanonicalSlug(account.address);
  const baseUrl = "https://pyusd.to/#/";
  const url = canonicalSlug.data ? baseUrl + canonicalSlug.data : baseUrl;
  const { toast } = useToast();

  return (
    <>
      <div
        className="flex  w-full flex-col items-center justify-center bg-cover bg-center bg-no-repeat p-16 lg:min-h-[400px]"
        style={{
          backgroundImage: `url(${heroImage})`,
        }}
      >
        <div className="max-w-5xl space-y-8 text-center">
          <div
            className="space-y-8 text-white"
            style={{
              textShadow: "0 1px 9px rgba(0,0,0,0.7)",
            }}
          >
            <h1 className="text-5xl">Get paid anywhere, anytime, by anyone.</h1>
            <p className="text-2xl">
              Receive PYUSD into either your PayPal wallet or your crypto
              wallet. Split a bill with friends or accept payments from
              customers. Share your link and let anyone pay you with any token.
            </p>
          </div>
        </div>
      </div>

      <Separator className="my-6" />

      <GetLink />
      <div className="m-auto flex w-full flex-row justify-center p-6">
        {!account.isConnected && (
          <Button className="text-md p-6" onClick={modal.openConnectModal}>
            Create and share your link
          </Button>
        )}
        {account.isConnected && (
          <div
            className="space-y-2 hover:cursor-pointer"
            onClick={() => {
              navigator.clipboard.writeText(url);
              toast({
                description:
                  "Your unique address has been copied to your clipboard.",
                duration: 5000,
              });
            }}
          >
            <p>Your unique address:</p>
            <div className="relative">
              <Input
                spellCheck={false}
                readOnly
                size={60}
                className="bg-opacity-20 text-center  ring-offset-0
                  focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0
                  "
                value={url}
              />
              <Copy className=" absolute right-2 top-1/2 -translate-y-1/2 " />
            </div>
          </div>
        )}
      </div>

      <Separator className="my-6" />

      <div className="space-y-12">
        <div className="text-center">
          <h2>A three-step tango to your PYUSD fandango!</h2>
        </div>

        <div className="py-8 pl-8">
          <div className="flex flex-row items-center gap-8 bg-no-repeat  align-bottom ">
            <div className="flex flex-row items-start gap-4 text-xl  ">
              <span className=" flex-0 flex aspect-square h-10 w-10 items-center justify-center rounded-full border border-foreground">
                1
              </span>
              <div className="space-y-2">
                <h2>Create your PYUSD.TO link.</h2>
                <p className="text-md  text-gray-400">
                  Setting it up is a breeze! Just tell us where your wallet
                  hangs out, and voila craft your unique PYUSD.TO link in a
                  snap!
                </p>
              </div>
            </div>
            <img className="h-[300px]" src={hachathonImage} />
          </div>
        </div>
        <div
          className="flex w-full  flex-col items-center justify-end bg-cover bg-center bg-no-repeat p-8 px-8 sm:min-h-[400px]"
          style={{
            backgroundImage: `url(${convoImage})`,
          }}
        >
          <div className="flex flex-row items-center gap-8 align-bottom">
            <div className="flex flex-row items-start gap-4 text-xl  ">
              <span className=" flex-0 flex aspect-square h-10 w-10 items-center justify-center rounded-full border border-white  text-white">
                2
              </span>
              <div className="w-2/3 space-y-2 text-white">
                <h2>Share your link.</h2>
                <p className="text-md  text-white">
                  Send your link out on a social spree! It's a breeze to
                  remember compared to wallet addresses. Drop it in chats,
                  Telegram, Signal, Discord, or any place that's buzzing
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="px-8">
          <div className="flex flex-row items-center gap-8 align-bottom">
            <img src={dogeImage} className="w-1/3" />
            <div className="flex flex-row items-start gap-4 text-xl  ">
              <span className=" flex-0 flex aspect-square h-10 w-10 items-center justify-center rounded-full border border-foreground">
                3
              </span>
              <div className="space-y-2">
                <h2>Speedy payments, no hassle.</h2>
                <p className="text-md  text-gray-400">
                  Your link is a money magnet &ndash; choose an amount, any
                  token, and zing &ndash; it's PYUSD-ified! Enjoy a bulging
                  wallet from payments worldwide, free of currency conversion or
                  international fees!
                </p>
              </div>
            </div>
          </div>
          <Separator />
        </div>
      </div>
    </>
  );
}
