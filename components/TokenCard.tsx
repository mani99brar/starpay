import { UserReserveData } from "@interfaces/userReserveData";

type TokenCardProps = {
  userReserveData: UserReserveData;
  symbol: string;
};

const TokenCard = ({ userReserveData, symbol }: TokenCardProps) => {
  return (
    <div className="border-t border-[#222] flex p-4 w-full text-center">
      <h1 className="w-[25%]">{symbol}</h1>
      <p className="w-[25%]">{userReserveData.currentStableDebt.toString()}</p>
      <p className="w-[25%]">
        {userReserveData.currentVariableDebt.toString()}
      </p>
      <div className="w-[25%]">
        <button className="w-[50%] bg-white p-2 text-[#141414] rounded-lg">
          Pay
        </button>
      </div>
    </div>
  );
};
export default TokenCard;
