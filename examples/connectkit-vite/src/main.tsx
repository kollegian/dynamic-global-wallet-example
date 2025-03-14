import { FC, PropsWithChildren, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { WagmiProvider, createConfig, http } from "wagmi";
import {seiTestnet} from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  ConnectKitButton,
  ConnectKitProvider,
  getDefaultConfig,
} from "connectkit";


import '@sei-js/sei-account/eip6963';

import ContractInteraction from "./contractInteraction";


const config = createConfig(
  getDefaultConfig({
    chains: [seiTestnet],
    transports: {
      [seiTestnet.id]: http(),
    },
    walletConnectProjectId: "9e559740664b49ec6bdaec33fdb7232c",
    appName: "Example App",
  })
);

const queryClient = new QueryClient();

export const Web3Provider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Web3Provider>
      <ConnectKitButton />
      <ContractInteraction />
    </Web3Provider>
  </StrictMode>
);
