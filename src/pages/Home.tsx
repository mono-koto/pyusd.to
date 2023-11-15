import { Separator } from "@/components/ui/separator";
import { HomeGetPaidCard } from "@/home/HomeGetPaidCard";
import { HomePayCard } from "@/home/HomePayCard";
import dogeImage from "../assets/img/doge-computer.png";
import hachathonImage from "../assets/img/hackathon_transparent.png";
import convoImage from "../assets/img/pyusd-convo-bg-mdjrny-2.jpg";
import heroImage from "../assets/img/pyusd-hero-bg-mdjrny.jpeg";

export default function Home() {
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

      <div className="container m-auto my-6 max-w-4xl">
        <div className="flex flex-col items-stretch justify-stretch gap-4 md:flex-row">
          <div className="flex-1">
            <HomePayCard />
          </div>
          <div className="flex-1">
            <HomeGetPaidCard />
          </div>
        </div>
      </div>

      <Separator className="my-6" />

      <div className="space-y-12">
        <div className="text-center">
          <h2>A three-step tango to your PYUSD fandango!</h2>
        </div>

        <div className="py-8 pl-8">
          <div className="container mx-auto flex max-w-5xl flex-row flex-wrap items-center gap-8  bg-no-repeat align-bottom md:flex-nowrap ">
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
            <img className="max-h-[300px] min-h-[100px]" src={hachathonImage} />
          </div>
        </div>
        <div
          className="flex w-full flex-col items-center justify-end bg-cover bg-center bg-no-repeat p-8 px-8 sm:min-h-[400px]"
          style={{
            backgroundImage: `url(${convoImage})`,
          }}
        >
          <div className="container mx-auto flex max-w-5xl flex-row items-center gap-8 align-bottom">
            <div className="mt-20 flex flex-row items-start gap-4 text-xl">
              <span className="flex-0 flex aspect-square h-10 w-10 items-center justify-center rounded-full border border-white  text-white">
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
          <div className="container mx-auto flex max-w-5xl flex-row flex-wrap items-center gap-8 align-bottom md:flex-nowrap ">
            <img src={dogeImage} className="max-h-[250px] min-h-[100px]" />
            <div className="flex flex-row items-start gap-4 text-xl  ">
              <span className="flex-0 flex aspect-square h-10 w-10 items-center justify-center rounded-full border border-foreground">
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
