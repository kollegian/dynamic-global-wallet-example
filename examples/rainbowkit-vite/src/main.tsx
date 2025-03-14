import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import "@rainbow-me/rainbowkit/styles.css";
import {
  ConnectButton,
  getDefaultConfig,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import {http, WagmiProvider} from "wagmi";
import { seiTestnet } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import ContractInteraction from "./contractInteraction";

import '@sei-js/sei-account/eip6963';

const queryClient = new QueryClient();

const config = getDefaultConfig({
  appName: "My RainbowKit App",
  projectId: "9e559740664b49ec6bdaec33fdb7232c",
  transports: {
    [seiTestnet.id]: http(),
  },
  chains: [seiTestnet],
  ssr: true,
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <ConnectButton />
          <ContractInteraction />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>
);
