import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { abi } from "@utils/abi/StarlayProtocolDataProvider.json";
import RESERVE_TOKENS from "@utils/constants/tokens/ReserveTokens.json";
import { token } from "@interfaces/token";
import { UserAllReserveData } from "@interfaces/userAllReserveData";
import { UserReserveData } from "@interfaces/userReserveData";

const CONTRACT_ADDRESS = "0x5BF9B2644E273D92ff1C31A83476314c95953133";
const RPC_ENDPOINT = "https://astar.public.blastapi.io";

const UserRepayments = () => {
  const [userData, setUserData] = useState<UserAllReserveData>({});

  async function getAllReservesTokens(tokenInfo: token) {
    try {
      const provider = new ethers.providers.JsonRpcProvider(RPC_ENDPOINT);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
      const userReserveData: UserReserveData =
        await contract.getUserReserveData(
          tokenInfo.tokenAddress,
          "0xFa00D29d378EDC57AA1006946F0fc6230a5E3288"
        );
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

  useEffect(() => {
    const fetchUserReserveData = async () => {
      for (const tokenInfo of RESERVE_TOKENS) {
        await getAllReservesTokens(tokenInfo);
      }
    };
    fetchUserReserveData();
    console.log(userData);
  }, []);

  return (
    <div>
      <ul>
        {Object.entries(userData).map(([symbol, userReserveData]) => (
          <li key={symbol}>
            {symbol}: {userReserveData.liquidityRate.toString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserRepayments;
