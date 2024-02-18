"use client";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { abi } from "@utils/abi/StarlayProtocolDataProvider.json";
import RESERVE_TOKENS from "@utils/constants/tokens/ReserveTokens.json";
import POOL_PAIRS from "@utils/constants/addresses/PoolPairs.json";
import { Token } from "@interfaces/token";
import { UserAllReserveData } from "@interfaces/userAllReserveData";
import { UserReserveData } from "@interfaces/userReserveData";
import { useAccount } from "wagmi";
import { getToken } from "@utils/helpers/getTokenAddress";
import TokenCard from "./TokenCard";
const CONTRACT_ADDRESS = "0x5BF9B2644E273D92ff1C31A83476314c95953133";
const RPC_ENDPOINT = "https://astar.public.blastapi.io";

const UserRepayments = () => {
  const [userData, setUserData] = useState<UserAllReserveData>({});
  const [payToken, setPayToken] = useState<Token>();
  const { address, isConnecting, isDisconnected } = useAccount();

  async function getAllReservesTokens(tokenInfo: Token) {
    try {
      const provider = new ethers.providers.JsonRpcProvider(RPC_ENDPOINT);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
      const userReserveData: UserReserveData =
        await contract.getUserReserveData(tokenInfo.tokenAddress, address);

      setUserData((prevUserData) => {
        return {
          ...prevUserData,
          [tokenInfo.symbol]: userReserveData,
        };
      });
    } catch (error) {
      console.error("Error fetching token data with ethers.js:", error);
    }
  }
  const fetchUserReserveData = async () => {
    for (const tokenInfo of RESERVE_TOKENS) {
      await getAllReservesTokens(tokenInfo);
    }
  };

  useEffect(() => {
    if (address) {
      fetchUserReserveData();
    }

    console.log(userData);
  }, [address]);
  function handlePayTokenChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const token = getToken(event.target.value);
    setPayToken(token);
  }
  if (isDisconnected)
    return (
      <div className="w-full flex justify-center items-center">
        <p className="text-4xl m-10">Connect Your Wallet</p>
      </div>
    );
  if (isConnecting)
    return (
      <div className="w-full flex justify-center items-center">
        <p className="text-4xl m-10">Connecting...</p>
      </div>
    );

  return (
    <div className="w-full flex justify-center">
      <div className="w-[80%]">
        <h1 className="text-4xl text-center font-bold">User's Repayments</h1>
        {address && (
          <ul className="rounded-xl w-full mt-8 bg-[#141414] border-t flex flex-col justify-around border-[#222] text-center">
            <li className="flex text-xl border-t border-[#222] p-4">
              <h1 className="w-[33%]">Asset</h1>
              <h1 className="w-[33%]">Variable Debt</h1>
              <select
                defaultValue="none"
                name=""
                id=""
                className="text-white bg-black w-[33%] p-2"
                onChange={handlePayTokenChange}
              >
                <option value="none" disabled>
                  Choose Token to Repay
                </option>
                {POOL_PAIRS.map((token) => (
                  <option key={token.symbol} value={token.symbol}>
                    {token.symbol}
                  </option>
                ))}
              </select>
            </li>
            {Object.entries(userData).map(([symbol, userReserveData]) => (
              <TokenCard
                key={symbol}
                userReserveData={userReserveData}
                symbol={symbol}
                payToken={payToken}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UserRepayments;
