import { http } from "wagmi";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import type { Chain } from "viem";

export const arcTestnet = {
  id: 5042002,
  name: "Arc Testnet",
  nativeCurrency: { decimals: 6, name: "USDC", symbol: "USDC" },
  rpcUrls: {
    default: { http: ["https://rpc.testnet.arc.network"] },
  },
  blockExplorers: {
    default: { name: "ArcScan", url: "https://testnet.arcscan.app" },
  },
  testnet: true,
} as const satisfies Chain;

export const ARCBOLD_ADDRESS = "0xd68F0bC66eBF5FF78c741Ee93A607360DD0b6F37" as const;
export const USDC_ADDRESS = "0x3600000000000000000000000000000000000000" as const;
export const EURC_ADDRESS = "0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a" as const;
export const ADMIN_ADDRESS = "0xeED2122c193E4530531b0250a11A4B0a1aC78F11" as const;

export const wagmiConfig = getDefaultConfig({
  appName: "ArcBold",
  projectId: "459ebef47ea52e82a2c67f58eea39242",
  chains: [arcTestnet],
  transports: {
    [arcTestnet.id]: http("https://rpc.testnet.arc.network"),
  },
  ssr: false,
});
