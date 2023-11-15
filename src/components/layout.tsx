import { ConnectButton } from "@rainbow-me/rainbowkit";
import { motion } from "framer-motion";
import { Suspense } from "react";
import { Helmet } from "react-helmet-async";
import { PayPalDocsDialogButton } from "./PayPalDocsDialogButton";
import SuspenseFallback from "./SuspenseFallback";
import { Card, CardDescription, CardHeader } from "./ui/card";
import { ThemeToggle } from "./ThemeToggle";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Helmet>
        <title>Fluffy Clouds</title>
      </Helmet>

      <div className="min-h-screen h-full flex flex-col justify-between p-5 gap-4">
        <nav className="flex flex-row justify-between  items-top">
          <div className="text-2xl flex flex-row gap-4 items-center">
            <div></div>
          </div>
          <div className="flex flex-row gap-4 items-center">
            <ConnectButton />
            <ThemeToggle />
          </div>
        </nav>

        <main className="container mx-auto max-w-xl">
          <Suspense fallback={<SuspenseFallback />}>{children}</Suspense>
        </main>

        <footer className="text-center text-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotateZ: -5 }}
            animate={{ opacity: 100, scale: 1, rotateZ: 0 }}
            transition={{ delay: 1, bounce: 0.6, type: "spring" }}
            className="inline-block"
          >
            <Card className="text-center inline-block">
              <CardHeader className="p-4">
                {/* <CardTitle className="text-lg">PayPal user?</CardTitle> */}
                <CardDescription className="flex flex-row gap-3 items-center ">
                  PayPal user?
                  <PayPalDocsDialogButton />
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        </footer>
      </div>
    </>
  );
}
