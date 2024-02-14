import { useEffect, useState } from "react";
import { UserReserveData } from "@interfaces/userReserveData";
import { getTokenAddress } from "@utils/helpers/getTokenAddress";
import QuoteSwap from "./QuoteSwap";
type TokenCardProps = {
  userReserveData: UserReserveData;
  symbol: string;
  payToken: string;
};

const TokenCard = ({ userReserveData, symbol, payToken }: TokenCardProps) => {
  const tokenA = getTokenAddress(symbol);
  const [showAmount, setShowAmount] = useState(false);

  useEffect(() => {
    setShowAmount(false);
  }, [payToken]);
  function handleClick() {
    setShowAmount(true);
  }
  return (
    <div className="border-t border-[#222] flex p-4 w-full text-center">
      <h1 className="w-[25%]">{symbol}</h1>
      <p className="w-[25%]">{userReserveData.currentStableDebt.toString()}</p>
      <p className="w-[25%]">
        {userReserveData.currentVariableDebt.toString()}
      </p>
      <div className="w-[25%]">
        {!showAmount && !!tokenA && !!payToken && tokenA != payToken && (
          <button onClick={handleClick}>Calculate Token to Pay</button>
        )}
        {showAmount && !!tokenA && !!payToken && (
          <QuoteSwap tokenA={tokenA} tokenB={payToken} />
        )}
      </div>
    </div>
  );
};
export default TokenCard;
