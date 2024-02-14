import RESERVE_TOKENS from "@utils/constants/tokens/ReserveTokens.json";
import tokenConnections from "@utils/constants/addresses/PoolPairs.json";
export function getTokenAddress(symbol: string): string | null {
  const token = RESERVE_TOKENS.find(t => t.symbol === symbol);
  return token ? token.tokenAddress : null;
}

interface TokenConnection {
  tokenA: string;
  symbol: string;
  connectedAddresses: ConnectedAddress[];
}

interface ConnectedAddress {
  symbol: string;
  tokenB: string;
  PoolPair: string;
}

export function getPairPool(tokenA: string, tokenB: string): string | undefined {
  // Iterate through each token connection to find the matching tokenA
  for (const tokenConnection of tokenConnections as TokenConnection[]) {
    if (tokenConnection.tokenA.toLowerCase() === tokenA.toLowerCase()) {
      // Once tokenA is found, search its connected addresses for the matching tokenB
      const connectedAddress = tokenConnection.connectedAddresses.find(
        (addr) => addr.tokenB.toLowerCase() === tokenB.toLowerCase()
      );

      // If a matching tokenB is found, return its PoolPair
      if (connectedAddress) {
        return connectedAddress.PoolPair;
      }
    }
  }

  // If no matching pair is found, return undefined
  return undefined;
}
