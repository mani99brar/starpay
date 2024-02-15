import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { UserReserveData } from "@interfaces/userReserveData";
import { getToken } from "@utils/helpers/getTokenAddress";
import QuoteSwap from "./QuoteSwap";
import { Token } from "@interfaces/token";
type TokenCardProps = {
  userReserveData: UserReserveData;
  symbol: string;
  payToken: Token | undefined;
};

const TokenCard = ({ userReserveData, symbol, payToken }: TokenCardProps) => {
  const tokenA = getToken(symbol);
  const [showAmount, setShowAmount] = useState(false);

  useEffect(() => {
    setShowAmount(false);
  }, [payToken]);
  function handleClick() {
    setShowAmount(true);
  }
  return (
    <div className="border-t border-[#222] flex p-4 w-full text-center items-center">
      <h1 className="w-[33%]">{symbol}</h1>
      <p className="w-[33%]">
        {parseFloat(
          ethers.utils.formatUnits(
            userReserveData.currentVariableDebt.toString(),
            tokenA?.decimals
          )
        ).toFixed(4)}
      </p>
      <div className="w-[33%]">
        {!showAmount &&
          !!tokenA &&
          !!payToken &&
          tokenA != payToken &&
          (userReserveData.currentVariableDebt.toString() === "0" ? (
            <p>No Debt to be paid</p>
          ) : (
            <button
              className="bg-white text-black px-4 py-2 rounded-lg"
              onClick={handleClick}
            >
              Calculate Tokens to Pay
            </button>
          ))}
        {showAmount && !!tokenA && !!payToken && (
          <QuoteSwap
            tokenA={tokenA}
            tokenB={payToken}
            userReserveData={userReserveData}
          />
        )}
      </div>
    </div>
  );
};
export default TokenCard;
