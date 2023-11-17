"use client";

import React from "react";
import dynamic from "next/dynamic";

const PayCard = dynamic(() => import("@/components/pay-card"), {});

export default function PayPage({ params }: { params: { address: string } }) {
  const recipient = params.address;
  return <PayCard recipient={recipient} />;
}
