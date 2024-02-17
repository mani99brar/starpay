import React from "react";
import { Token } from "@interfaces/token";
import { UserReserveData } from "@interfaces/userReserveData";
import { useState } from "react";
import { ethers } from "ethers";
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
  const [stage, setStage] = useState(0);
  const closePay = () => {
    setPay(false);
  };
  const rawDebt = userReserveData.currentVariableDebt.toString();
  const debt = parseFloat(
    ethers.utils.formatUnits(rawDebt, tokenA?.decimals)
  ).toFixed(4);
  function approveToken() {
    if (stage === 1) {
      setStage(2);
    } else if (stage === 0) {
      setStage(1);
    }
  }
  return (
    <div className="w-[100%] h-[100vh] absolute top-0 right-0 bg-slate-500 bg-opacity-55  flex justify-center items-center">
      <div className="w-[50%] h-[50%] flex justify-center items-center bg-black rounded-lg relative">
        <button
          className="bg-white absolute right-0 m-4 top-0  text-black px-4 py-2 rounded-lg"
          onClick={closePay}
        >
          X
        </button>
        <div className="w-[50%]">
          {stage === 0 && tokenA && (
            <div>
              <button
                onClick={approveToken}
                className="bg-[#bf2db3] w-[100%] text-white px-4 py-2 rounded-lg"
              >
                Approve Token {tokenB?.symbol} of worth {amountIn} for swapping
              </button>
            </div>
          )}
          {stage === 1 && (
            <div>
              <button
                onClick={approveToken}
                className="bg-[#bf2db3] w-[100%] text-white px-4 py-2 rounded-lg"
              >
                Approve Token {tokenA?.symbol} of worth{debt} for repaying
              </button>
            </div>
          )}
          {stage === 2 && (
            <div>
              <button className="bg-[#bf2db3] w-[100%] text-white px-4 py-2 rounded-lg">
                Sign to repay the debt with Token {tokenB?.symbol}
              </button>
            </div>
          )}
        </div>
        <div className="flex w-[50%] absolute bottom-10 justify-stretch items-center">
          <div className={`w-[20px] h-[20px] rounded-lg bg-[#bf2db3]`}></div>
          <div
            className={`w-[49%] h-[2px] ${
              stage >= 1 ? "bg-[#bf2db3]" : "bg-[#00eaff]"
            }`}
          ></div>
          <div
            className={`w-[20px] h-[20px] rounded-lg ${
              stage >= 1 ? "bg-[#bf2db3]" : "bg-[#00eaff]"
            }`}
          ></div>
          <div
            className={`w-[49%] h-[2px] ${
              stage == 2 ? "bg-[#bf2db3]" : "bg-[#00eaff]"
            }`}
          ></div>
          <div
            className={`w-[20px] h-[20px] rounded-lg ${
              stage == 2 ? "bg-[#bf2db3]" : "bg-[#00eaff]"
            }`}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default SwapAndPay;
