"use client";
import UserRepayments from "@components/UserRepayments";
import Navbar from "@components/Navbar";
import Web3Provider from "@components/Web3Proivder";
import QuoteSwap from "@components/QuoteSwap";
export default function Home() {
  return (
    <Web3Provider>
      <Navbar />
      <UserRepayments />
    </Web3Provider>
  );
}
