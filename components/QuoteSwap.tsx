import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { abi as tokenPairAbi } from "../contracts/out/IPancakePair.sol/IUniswapV2Pair.json";
import { abi as routerAbi } from "../contracts/out/IPancakeRouter01.sol/IPancakeRouter01.json";
import { getPairPool } from "@utils/helpers/getTokenAddress";
const ROUTER_CONTRACT = "0xE915D2393a08a00c5A463053edD31bAe2199b9e7";
const RPC_ENDPOINT = "https://astar.public.blastapi.io";

//Add token decimals

type TokenPair = {
  tokenA: string;
  tokenB: string;
};

const QuoteSwap = ({ tokenA, tokenB }: TokenPair) => {
  const [amountIn, setAmountIn] = useState("");
  const [returnMsg, setReturnMsg] = useState("");

  if (tokenA === undefined || tokenB === undefined) return <p>Not Supported</p>;
  async function getReserve({ tokenA, tokenB }: TokenPair) {
    if (tokenA === tokenB) {
      return;
    }
    //get token0 and token1 and compare
    const pairPool = getPairPool(tokenA, tokenB);
    console.log(pairPool);
    if (pairPool === undefined) {
      setReturnMsg("Not Supported");
      return;
    }
    try {
      const provider = new ethers.providers.JsonRpcProvider(RPC_ENDPOINT);
      const pairContract = new ethers.Contract(
        pairPool,
        tokenPairAbi,
        provider
      );
      const routerContract = new ethers.Contract(
        ROUTER_CONTRACT,
        routerAbi,
        provider
      );

      try {
        const quoteAmount = await routerContract.getAmountsIn(
          ethers.utils.parseEther("10"),
          [tokenB, tokenA]
        );

        console.log(
          ethers.utils.formatEther(quoteAmount[0]),
          ethers.utils.formatEther(quoteAmount[1])
        );
        setAmountIn(ethers.utils.formatEther(quoteAmount[0]));
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.error("Error fetching token data with ethers.js:", error);
      setAmountIn("");
    }
  }
  useEffect(() => {
    getReserve({ tokenA, tokenB });
  }, []);
  return (
    <div>
      {amountIn != "" && <p>{amountIn}</p>}
      {returnMsg != "" && <p>{returnMsg}</p>}
    </div>
  );
};

export default QuoteSwap;
