import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { ARCBOLD_ABI, ERC20_ABI } from "../lib/web3/abi";
import { ARCBOLD_ADDRESS, USDC_ADDRESS, EURC_ADDRESS } from "../lib/web3/config";
import { useAllowance, useTokenBalance, useUserPositionIds } from "../lib/web3/hooks";
import { fromUnits, toUnits } from "../lib/web3/format";
import { HealthGauge } from "../components/HealthGauge";
import { ToastProvider, useToast } from "../components/TxToast";
import { BorrowPositionCard } from "../components/PositionRow";

export const Route = createFileRoute("/borrow")({
  component: () => (
    <ToastProvider>
      <BorrowPage />
    </ToastProvider>
  ),
});

function BorrowPage() {
  const { isConnected } = useAccount();
  const [collateral, setCollateral] = useState<"USDC" | "EURC">("USDC");
  const [amount, setAmount] = useState("");
  const collateralAddr = collateral === "USDC" ? USDC_ADDRESS : EURC_ADDRESS;
  const borrowSymbol = collateral === "USDC" ? "EURC" : "USDC";
  const borrowAddr = collateral === "USDC" ? EURC_ADDRESS : USDC_ADDRESS;

  const { data: balance } = useTokenBalance(collateralAddr);
  const { data: allowance } = useAllowance(collateralAddr);
  const units = toUnits(amount);
  const needsApproval = !allowance || allowance < units;
  const receive = units * 100n / 150n;
  const hf = useMemo(() => (amount ? 150 : 0), [amount]); // freshly opened: ratio 150 -> HF = 1.5x => 150

  const { push } = useToast();
  const { writeContract: approve, data: aHash, isPending: approving } = useWriteContract();
  const { writeContract: borrow, data: bHash, isPending: borrowing } = useWriteContract();
  const { isLoading: waitA, isSuccess: approved } = useWaitForTransactionReceipt({ hash: aHash });
  const { isLoading: waitB, isSuccess: borrowed } = useWaitForTransactionReceipt({ hash: bHash });
  useEffect(() => { if (approved) push({ title: `${collateral} approved`, kind: "success", hash: aHash }); }, [approved]);
  useEffect(() => { if (borrowed) { push({ title: `Borrowed ${borrowSymbol}`, kind: "success", hash: bHash }); setAmount(""); } }, [borrowed]);

  const { data: ids } = useUserPositionIds();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <div className="font-mono-tech text-[10px] tracking-[0.4em] text-[#FF0080]">BORROW</div>
        <h1 className="font-display font-black italic text-4xl sm:text-6xl mt-2">
          Borrow <span className="text-gradient-smart">Smart.</span>
        </h1>
        <p className="text-[#8892A4] mt-3 max-w-2xl">Lock collateral at 150% ratio. Borrow the opposite stablecoin. 5% APR interest.</p>
      </motion.div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-6">
        <div className="space-y-5">
          <div className="glass-card p-6">
            <div className="text-[10px] uppercase tracking-widest text-[#8892A4] mb-3">Choose collateral</div>
            <div className="grid grid-cols-2 gap-3">
              {(["USDC", "EURC"] as const).map((s) => {
                const active = collateral === s;
                const color = s === "USDC" ? "#FF6B00" : "#FF0080";
                return (
                  <button key={s} onClick={() => setCollateral(s)}
                    className="p-4 rounded-2xl border transition text-left"
                    style={{
                      borderColor: active ? color : "rgba(255,255,255,0.08)",
                      background: active ? `linear-gradient(135deg, ${color}18, transparent)` : "rgba(255,255,255,0.02)",
                      boxShadow: active ? `0 0 30px ${color}40` : "none",
                    }}
                  >
                    <div className="font-display font-black text-2xl">{s}</div>
                    <div className="text-xs text-[#8892A4]">Borrow {s === "USDC" ? "EURC" : "USDC"}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex justify-between text-[10px] uppercase tracking-widest text-[#8892A4]">
              <span>Collateral amount ({collateral})</span>
              <span>Wallet: {fromUnits(balance)} {collateral}</span>
            </div>
            <div className="mt-2 relative">
              <input
                type="text"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
                placeholder="0.00"
                className="neon-input pr-20"
              />
              <button onClick={() => balance && setAmount(fromUnits(balance, 6))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold px-2 py-1 rounded bg-[#FF6B00]/20 text-[#FF6B00]">
                MAX
              </button>
            </div>

            <div className="mt-4 flex gap-2">
              {needsApproval ? (
                <button disabled={!isConnected || !units || approving || waitA}
                  onClick={() => approve({ address: collateralAddr, abi: ERC20_ABI, functionName: "approve", args: [ARCBOLD_ADDRESS, units] })}
                  className="btn-neon-orange flex-1">
                  {approving || waitA ? "Approving…" : `Approve ${collateral}`}
                </button>
              ) : (
                <button disabled={!isConnected || !units || borrowing || waitB}
                  onClick={() => borrow({ address: ARCBOLD_ADDRESS, abi: ARCBOLD_ABI, functionName: "borrow", args: [collateralAddr, borrowAddr, units] })}
                  className="btn-neon-orange flex-1">
                  {borrowing || waitB ? "Borrowing…" : `Borrow ${borrowSymbol}`}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="glass-card p-6 h-fit">
          <div className="font-display font-black text-lg mb-4">Preview</div>
          <Row label="Collateral" value={`${amount || "0"} ${collateral}`} />
          <Row label="You receive" value={`${fromUnits(receive)} ${borrowSymbol}`} highlight />
          <Row label="Collateral ratio" value="150%" />
          <Row label="Interest rate" value="5.00% APR" />
          <div className="flex justify-center mt-6">
            <HealthGauge value={hf} size={170} />
          </div>
        </div>
      </div>

      {isConnected && (
        <div className="mt-14">
          <h2 className="font-display font-black text-2xl mb-4">Your Borrow Positions</h2>
          <div className="space-y-4">
            {(ids ?? []).length === 0 && <div className="text-[#8892A4] text-sm">No active borrow positions yet.</div>}
            {(ids ?? []).map((id) => (
              <BorrowPositionCard key={id.toString()} positionId={id} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between items-center py-2.5 border-b border-white/5 last:border-0">
      <span className="text-sm text-[#8892A4]">{label}</span>
      <span className={`font-mono-tech font-bold ${highlight ? "text-[#FF6B00]" : "text-white"}`}>{value}</span>
    </div>
  );
}
