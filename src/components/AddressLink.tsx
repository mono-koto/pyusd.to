"use client";
import { Address } from "viem";
import BlockscannerLink from "./BlockscannerLink";
import { useEns } from "@/hooks/useEns";

type Props = {
  address: Address;
};

export default function AddressLink({ address }: Props) {
  const ens = useEns(address);
  if (ens.data.name) {
    return (
      <BlockscannerLink address={address}>{ens.data.name}</BlockscannerLink>
    );
  } else {
    return <BlockscannerLink address={address} short />;
  }
}
