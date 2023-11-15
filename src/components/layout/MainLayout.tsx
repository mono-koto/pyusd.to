import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Helmet } from "react-helmet-async";
import { ThemeToggle } from "../ThemeToggle";
import { Toaster } from "../ui/toaster";
import { PayPalDocsDialogButton } from "../PayPalDocsDialogButton";
import { Card, CardHeader, CardDescription } from "../ui/card";
import { motion } from "framer-motion";
import { navigate } from "wouter/use-location";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const goHome = () => {
    navigate("/");
  };

  return (
    <>
      <Helmet>
        <title>PYUSD.to</title>
      </Helmet>

      <div className="flex h-full min-h-screen flex-col justify-between gap-4">
        <div>
          <nav className="items-top flex flex-row justify-between bg-accent p-4">
            <div className="flex flex-row items-center gap-4 text-2xl">
              <div
                className="cursor-pointer whitespace-nowrap font-sans text-3xl font-light"
                onClick={goHome}
              >
                PYUSD<span className="text-primary">.to</span>
              </div>
            </div>
            <div className="flex flex-row items-center gap-4">
              <ConnectButton />
              <ThemeToggle />
            </div>
          </nav>

          {children}
        </div>
        <Toaster />

        <footer className="mb-6 text-center text-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotateZ: -5 }}
            animate={{ opacity: 100, scale: 1, rotateZ: 0 }}
            transition={{ delay: 1, bounce: 0.6, type: "spring" }}
            className="inline-block"
          >
            <Card className="inline-block text-center">
              <CardHeader className="p-4">
                <CardDescription className="flex flex-row items-center gap-3 ">
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
