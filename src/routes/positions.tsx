import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useUserPositionIds, useUserSupplyIds } from "../lib/web3/hooks";
import { ToastProvider } from "../components/TxToast";
import { BorrowPositionCard, SupplyPositionCard } from "../components/PositionRow";

export const Route = createFileRoute("/positions")({
  component: () => (
    <ToastProvider>
      <PositionsPage />
    </ToastProvider>
  ),
});

function PositionsPage() {
  const { isConnected } = useAccount();
  const [tab, setTab] = useState<"supply" | "borrow">("borrow");
  const { data: borrowIds } = useUserPositionIds();
  const { data: supplyIds } = useUserSupplyIds();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="font-mono-tech text-[10px] tracking-[0.4em] text-[#00FFD1]">PORTFOLIO</div>
        <h1 className="font-display font-black italic text-4xl sm:text-6xl mt-2">
          Your <span className="text-gradient-bold">Positions</span>
        </h1>
      </motion.div>

      {!isConnected ? (
        <div className="glass-card p-12 text-center">
          <p className="text-[#8892A4] mb-6">Connect your wallet to view your positions.</p>
          <div className="inline-block"><ConnectButton /></div>
        </div>
      ) : (
        <>
          <div className="inline-flex p-1 rounded-xl bg-[#0E0E16] border border-[rgba(255,107,0,0.2)] mb-6">
            {(["borrow", "supply"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-6 py-2 rounded-lg font-display font-black text-sm uppercase tracking-wider transition ${
                  tab === t ? "bg-gradient-to-r from-[#FF6B00] to-[#FF0080] text-[#060608] shadow-[0_0_20px_rgba(255,107,0,0.5)]" : "text-[#8892A4] hover:text-white"
                }`}>
                {t}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {tab === "borrow" && (
              <>
                {(borrowIds ?? []).length === 0 && <div className="glass-card p-8 text-center text-[#8892A4]">No borrow positions yet.</div>}
                {(borrowIds ?? []).map((id) => <BorrowPositionCard key={id.toString()} positionId={id} />)}
              </>
            )}
            {tab === "supply" && (
              <>
                {(supplyIds ?? []).length === 0 && <div className="glass-card p-8 text-center text-[#8892A4]">No supply positions yet.</div>}
                {(supplyIds ?? []).map((id) => <SupplyPositionCard key={id.toString()} supplyId={id} />)}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
