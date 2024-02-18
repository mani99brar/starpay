import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { abi as routerAbi } from "../contracts/out/IPancakeRouter01.sol/IPancakeRouter01.json";
import { Token } from "@interfaces/token";
import SwapAndPay from "./SwapAndPay";
import { UserReserveData } from "@interfaces/userReserveData";
const ROUTER_CONTRACT = "0xE915D2393a08a00c5A463053edD31bAe2199b9e7";
const RPC_ENDPOINT = "https://astar.public.blastapi.io";

type QuoteProps = {
  tokenA: Token | undefined;
  tokenB: Token | undefined;
  userReserveData: UserReserveData;
};

type TokenPair = {
  tokenA: Token | undefined;
  tokenB: Token | undefined;
};

const QuoteSwap = ({ tokenA, tokenB, userReserveData }: QuoteProps) => {
  const [amountIn, setAmountIn] = useState("");
  const [returnMsg, setReturnMsg] = useState("");
  const [pay, setPay] = useState(false);
  const rawDebt = userReserveData.currentVariableDebt.toString();
  const debt = ethers.utils.formatUnits(rawDebt, tokenA?.decimals);
  if (tokenA === undefined || tokenB === undefined) return <p>Not Supported</p>;
  async function getReserve({ tokenA, tokenB }: TokenPair) {
    if (tokenA === tokenB) {
      return;
    }

    try {
      const provider = new ethers.providers.JsonRpcProvider(RPC_ENDPOINT);
      const routerContract = new ethers.Contract(
        ROUTER_CONTRACT,
        routerAbi,
        provider
      );

      try {
        const quoteAmount = await routerContract.getAmountsIn(
          ethers.utils.parseUnits(debt, tokenA?.decimals),
          [tokenB?.tokenAddress, tokenA?.tokenAddress]
        );

        console.log(
          ethers.utils.formatEther(quoteAmount[0]),
          ethers.utils.formatEther(quoteAmount[1])
        );
        setAmountIn(ethers.utils.formatUnits(quoteAmount[0], tokenB?.decimals));
      } catch (error) {
        console.error("Error fetching quote amount");
        setReturnMsg("Not Supported");
      }
    } catch (error) {
      console.error("Error fetching token data with ethers.js:", error);
      setAmountIn("");
    }
  }
  const handlePay = () => {
    window.scrollTo(0, 0);
    setPay(true);
  };
  useEffect(() => {
    getReserve({ tokenA, tokenB });
  }, []);

  return (
    <div>
      {amountIn != "" && (
        <button
          className="bg-white text-black px-4 py-2 rounded-lg"
          onClick={handlePay}
        >
          Pay with {parseFloat(amountIn).toFixed(4)}
        </button>
      )}
      {pay && (
        <SwapAndPay
          setPay={setPay}
          tokenA={tokenA}
          tokenB={tokenB}
          amountIn={amountIn}
          userReserveData={userReserveData}
        />
      )}
      {returnMsg != "" && <p>{returnMsg}</p>}
    </div>
  );
};

export default QuoteSwap;
