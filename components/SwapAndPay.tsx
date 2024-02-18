import React, { useEffect } from "react";
import { Token } from "@interfaces/token";
import { UserReserveData } from "@interfaces/userReserveData";
import { useState } from "react";
import { ethers } from "ethers";
import { abi as starPayAbi } from "../contracts/out/StarPay.sol/StarPay.json";
import { abi as tokenAbi } from "../contracts/out/IERC20.sol/IERC20.json";
import { useWriteContract, useAccount, type BaseError } from "wagmi";

const STARPAY_CONTRACT = "0xaA5d4E34ba6D8079DCB6982Ef09b1175DE6b3414";

type SwapAndPayProps = {
  setPay: React.Dispatch<React.SetStateAction<boolean>>;
  tokenA: Token | undefined;
  tokenB: Token | undefined;
  userReserveData: UserReserveData;
  amountIn: string;
};

const SwapAndPay = ({
  setPay,
  tokenA,
  tokenB,
  userReserveData,
  amountIn,
}: SwapAndPayProps) => {
  const { data: hash, isPending, writeContract, error } = useWriteContract();
  const { address } = useAccount();
  const [stage, setStage] = useState(0);
  const closePay = () => {
    setPay(false);
  };
  const rawDebt = userReserveData.currentVariableDebt.toString();
  const debt = parseFloat(
    ethers.utils.formatUnits(rawDebt, tokenA?.decimals)
  ).toFixed(4);

  useEffect(() => {
    console.log(stage);
    if (stage === 1) {
      if (tokenA && tokenB) {
        approveToken(tokenB, amountIn);
      }
    } else if (stage === 3) {
      if (tokenA && tokenB) {
        approveToken(tokenA, debt);
      }
    } else if (stage === 5) {
      if (tokenA && tokenB) {
        payDebt(tokenA, tokenB, amountIn, debt);
      }
    }
    console.log(isPending);
  }, [stage]);
  useEffect(() => {
    if (hash === undefined) return;
    setStage((prevState) => {
      return prevState + 1;
    });
  }, [hash]);
  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);
  async function approveToken(token: Token, amount: string) {
    writeContract({
      address: token.tokenAddress as `0x${string}`,
      abi: tokenAbi,
      functionName: "approve",
      args: [STARPAY_CONTRACT, ethers.utils.parseUnits(amount, token.decimals)],
    });
  }

  async function payDebt(
    tokenA: Token,
    tokenB: Token,
    amountIn: string,
    debt: string
  ) {
    console.log("paying debt");
    console.log(
      ethers.utils.parseUnits(debt, tokenA?.decimals).toString(),
      ethers.utils
        .parseUnits((parseInt(amountIn) + 1).toString(), tokenB?.decimals)
        .toString()
    );
    writeContract({
      address: STARPAY_CONTRACT as `0x${string}`,
      abi: starPayAbi,
      functionName: "swapAndPayDebt",
      args: [
        tokenA?.tokenAddress,
        tokenB?.tokenAddress,
        ethers.utils.parseUnits(debt, tokenA?.decimals),
        ethers.utils.parseUnits(amountIn, tokenB?.decimals),
        address,
      ],
    });
  }

  const handleNext = () => {
    if (stage === 5 || stage === 4) return;
    setStage((prevState) => {
      if (prevState === 1 || prevState === 3) {
        return prevState + 1;
      } else return prevState + 2;
    });
  };
  const handlePrev = () => {
    setStage((prevState) => {
      if (prevState === 2 || prevState === 4) return prevState - 2;
      else if (prevState > 0) return prevState - 1;
      else return prevState;
    });
  };

  return (
    <div className="w-[100%] h-[100vh] absolute top-0 right-0 bg-slate-500 bg-opacity-55  flex justify-center items-center">
      <div className="w-[50%] h-[50%] flex justify-center items-center bg-black rounded-lg relative">
        <button
          className="bg-white absolute right-0 m-4 top-0  text-black px-4 py-2 rounded-lg"
          onClick={closePay}
        >
          X
        </button>
        <div className="flex flex-col absolute top-10">
          <h1 className="text-xl">Go next if already approved</h1>
          <div className="flex text-4xl justify-around mt-8">
            <button onClick={handlePrev}>{`<`}</button>
            <button onClick={handleNext}>{`>`}</button>
          </div>
        </div>
        {error ? (
          <div className="w-[50%]">
            <p className="bg-[#bf2db3] w-[100%] text-white px-4 py-2 rounded-lg">
              Pancake Slippage Error. Try another token or try after some time.
            </p>
          </div>
        ) : (
          <div className="w-[50%]">
            {(stage === 0 || stage === 1) && tokenA && (
              <div>
                {isPending ? (
                  <p className="bg-[#bf2db3] w-[100%] text-white px-4 py-2 rounded-lg">
                    Approving...
                  </p>
                ) : (
                  <button
                    onClick={() => setStage(1)}
                    className="bg-[#bf2db3] w-[100%] text-white px-4 py-2 rounded-lg"
                  >
                    Approve Token {tokenB?.symbol} of
                    {" " + parseFloat(amountIn).toFixed(4)} for swapping
                  </button>
                )}
              </div>
            )}
            {(stage === 2 || stage === 3) && (
              <div>
                {isPending ? (
                  <p className="bg-[#bf2db3] w-[100%] text-white px-4 py-2 rounded-lg">
                    Approving...
                  </p>
                ) : (
                  <button
                    onClick={() => setStage(3)}
                    className="bg-[#bf2db3] w-[100%] text-white px-4 py-2 rounded-lg"
                  >
                    Approve Token {tokenA?.symbol} of worth{debt} for repaying
                  </button>
                )}
              </div>
            )}
            {(stage === 4 || stage === 5) && (
              <div>
                {isPending ? (
                  <p className="bg-[#bf2db3] w-[100%] text-white px-4 py-2 rounded-lg">
                    Approving...
                  </p>
                ) : (
                  <button
                    onClick={() => setStage(5)}
                    className="bg-[#bf2db3] w-[100%] text-white px-4 py-2 rounded-lg"
                  >
                    Sign to repay the debt with Token {tokenB?.symbol}
                  </button>
                )}
              </div>
            )}
            {stage >= 6 && (isPending ? <p>Approving</p> : <p>Debt Repaid</p>)}
          </div>
        )}
        <div className="flex w-[50%] absolute bottom-10 justify-stretch items-center">
          <div className={`w-[20px] h-[20px] rounded-lg bg-[#bf2db3]`}></div>
          <div
            className={`w-[49%] h-[2px] ${
              stage >= 2 ? "bg-[#bf2db3]" : "bg-[#00eaff]"
            }`}
          ></div>
          <div
            className={`w-[20px] h-[20px] rounded-lg ${
              stage >= 3 ? "bg-[#bf2db3]" : "bg-[#00eaff]"
            }`}
          ></div>
          <div
            className={`w-[49%] h-[2px] ${
              stage >= 3 ? "bg-[#bf2db3]" : "bg-[#00eaff]"
            }`}
          ></div>
          <div
            className={`w-[20px] h-[20px] rounded-lg ${
              stage > 4 ? "bg-[#bf2db3]" : "bg-[#00eaff]"
            }`}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default SwapAndPay;
