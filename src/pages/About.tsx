// Simple about page component

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Link } from "wouter";

export const About = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>☁️ Fluffy Clouds ☁️</CardTitle>
        <CardDescription>
          Easy and efficient conversion to PYUSD
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <p>Fluffy Clouds lets you easily receive PayPal PYUSD! </p>

        <ul className="list-disc list-outside pl-4 space-y-3">
          <li>Static and IPFS-hosted. No signup, no KYC.</li>

          <li>
            Uses CowSwap. You get MEV protection and optimized swap pricing.
          </li>
          <li>Open source and MIT licensed.</li>
        </ul>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button asChild>
          <Link href="/">👍</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default About;
