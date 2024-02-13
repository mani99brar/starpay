import { WagmiProvider, createConfig, http } from "wagmi";
import { mainnet, astar } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";

const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [astar],
    transports: {
      // RPC URL for each chain
      [astar.id]: http(`https://astar.public.blastapi.io`),
    },
    walletConnectProjectId: "9dd8be5589c75a5fe769e3c2813137d1",
    appName: "starpay",
  })
);

const queryClient = new QueryClient();

const Web3Provider = ({ children }: any) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
export default Web3Provider;
