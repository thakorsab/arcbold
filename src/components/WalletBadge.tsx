import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useTokenBalance } from "../lib/web3/hooks";
import { USDC_ADDRESS, EURC_ADDRESS } from "../lib/web3/config";
import { fromUnits, shortAddress } from "../lib/web3/format";
import { useDisconnect } from "wagmi";
import { LogOut, Copy, Check } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export function WalletBadge() {
  return (
    <ConnectButton.Custom>
      {({ account, chain, openConnectModal, mounted }) => {
        const ready = mounted;
        if (!ready) return <div style={{ opacity: 0, pointerEvents: "none", userSelect: "none" }} aria-hidden />;
        if (!account || !chain) {
          return (
            <button onClick={openConnectModal} type="button" className="btn-neon-orange text-sm py-2 px-4">
              Connect Wallet
            </button>
          );
        }
        return <ConnectedCard address={account.address as `0x${string}`} />;
      }}
    </ConnectButton.Custom>
  );
}

function ConnectedCard({ address }: { address: `0x${string}` }) {
  const { data: usdc } = useTokenBalance(USDC_ADDRESS);
  const { data: eurc } = useTokenBalance(EURC_ADDRESS);
  const { disconnect } = useDisconnect();
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-2 sm:gap-3 rounded-xl px-2 sm:px-3 py-1.5 bg-[#0a0a0f]/80 border border-[#FF6B00]/60 shadow-[0_0_18px_rgba(255,107,0,0.35)] hover:shadow-[0_0_28px_rgba(255,107,0,0.6)] transition"
    >
      <div className="hidden sm:flex items-center gap-3 pr-3 border-r border-[#FF6B00]/30">
        <Bal label="USDC" value={fromUnits(usdc as bigint | undefined, 2)} color="#FF6B00" />
        <Bal label="EURC" value={fromUnits(eurc as bigint | undefined, 2)} color="#00FFD1" />
      </div>
      <a
        href={`https://testnet.arcscan.app/address/${address}`}
        target="_blank"
        rel="noopener noreferrer"
        className="font-mono-tech text-xs sm:text-sm font-bold text-white hover:text-[#FF6B00] transition"
        title="View on ArcScan"
      >
        {shortAddress(address)}
      </a>
      <button onClick={copy} className="text-[#8892A4] hover:text-white transition p-1" aria-label="copy address">
        {copied ? <Check size={14} className="text-[#00FFD1]" /> : <Copy size={14} />}
      </button>
      <button
        onClick={() => disconnect()}
        className="ml-1 text-xs font-bold uppercase tracking-wider text-[#FF6B00] hover:text-white border border-[#FF6B00]/50 hover:border-[#FF6B00] hover:bg-[#FF6B00]/10 rounded-lg px-2 py-1 transition flex items-center gap-1"
        aria-label="disconnect"
      >
        <LogOut size={12} />
        <span className="hidden md:inline">Disconnect</span>
      </button>
    </motion.div>
  );
}

function Bal({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="leading-tight">
      <div className="text-[9px] uppercase tracking-widest" style={{ color }}>{label}</div>
      <div className="font-mono-tech text-xs font-bold text-white">{value}</div>
    </div>
  );
}
