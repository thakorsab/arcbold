import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useEffect, useState } from "react";
import { ARCBOLD_ABI, ERC20_ABI } from "../lib/web3/abi";
import { ARCBOLD_ADDRESS, USDC_ADDRESS, EURC_ADDRESS } from "../lib/web3/config";
import { useAllowance, useTokenBalance, useTotals, useUserSupplyIds } from "../lib/web3/hooks";
import { fromUnits, toUnits } from "../lib/web3/format";
import { ToastProvider, useToast } from "../components/TxToast";
import { SupplyPositionCard } from "../components/PositionRow";

export const Route = createFileRoute("/supply")({
  component: () => (
    <ToastProvider>
      <SupplyPage />
    </ToastProvider>
  ),
});

function SupplyPage() {
  const { isConnected } = useAccount();
  const { data: ids } = useUserSupplyIds();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <div className="font-mono-tech text-[10px] tracking-[0.4em] text-[#FF6B00]">SUPPLY</div>
        <h1 className="font-display font-black italic text-4xl sm:text-6xl mt-2">
          Earn <span className="text-gradient-bold">5% APR</span>
        </h1>
        <p className="text-[#8892A4] mt-3 max-w-2xl">Deposit USDC or EURC into the ArcBold pool and earn passive yield. Withdraw anytime.</p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        <SupplyCard token={USDC_ADDRESS} symbol="USDC" themeColor="#FF6B00" />
        <SupplyCard token={EURC_ADDRESS} symbol="EURC" themeColor="#FF0080" />
      </div>

      {isConnected && (
        <div className="mt-14">
          <h2 className="font-display font-black text-2xl mb-4">Your Supply Positions</h2>
          <div className="space-y-3">
            {(ids ?? []).length === 0 && <div className="text-[#8892A4] text-sm">No active supply positions yet.</div>}
            {(ids ?? []).map((id) => (
              <SupplyPositionCard key={id.toString()} supplyId={id} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SupplyCard({ token, symbol, themeColor }: { token: `0x${string}`; symbol: string; themeColor: string }) {
  const { isConnected } = useAccount();
  const { data: balance } = useTokenBalance(token);
  const { data: allowance } = useAllowance(token);
  const { data: totals } = useTotals();
  const [amount, setAmount] = useState("");
  const units = toUnits(amount);
  const needsApproval = !allowance || allowance < units;

  const { push } = useToast();
  const { writeContract: approve, data: approveHash, isPending: approving } = useWriteContract();
  const { writeContract: supply, data: supplyHash, isPending: supplying } = useWriteContract();
  const { isLoading: waitApprove, isSuccess: approved } = useWaitForTransactionReceipt({ hash: approveHash });
  const { isLoading: waitSupply, isSuccess: supplied } = useWaitForTransactionReceipt({ hash: supplyHash });

  useEffect(() => { if (approved) push({ title: `${symbol} approved`, kind: "success", hash: approveHash }); }, [approved]);
  useEffect(() => { if (supplied) { push({ title: `Supplied ${symbol}`, kind: "success", hash: supplyHash }); setAmount(""); } }, [supplied]);

  const totalSuppliedIdx = symbol === "USDC" ? 0 : 1;
  const totalBorrowedIdx = symbol === "USDC" ? 2 : 3;
  const totalSupplied = totals?.[totalSuppliedIdx]?.result as bigint | undefined;
  const totalBorrowed = totals?.[totalBorrowedIdx]?.result as bigint | undefined;
  const utilization = totalSupplied && totalSupplied > 0n
    ? Number((totalBorrowed ?? 0n) * 10000n / totalSupplied) / 100
    : 0;

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="glass-card glass-card-hover p-6 sm:p-7"
      style={{ borderColor: themeColor + "40", boxShadow: `0 8px 40px ${themeColor}22` }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full flex items-center justify-center font-display font-black text-xl"
            style={{ background: `linear-gradient(135deg, ${themeColor}, ${themeColor}66)`, color: "#060608" }}>
            {symbol === "USDC" ? "$" : "€"}
          </div>
          <div>
            <div className="font-display font-black text-2xl">{symbol}</div>
            <div className="text-xs text-[#8892A4]">Lending Pool</div>
          </div>
        </div>
        <div className="text-xs font-mono-tech font-bold px-3 py-1.5 rounded-full" style={{ background: themeColor + "15", color: themeColor, border: `1px solid ${themeColor}55` }}>
          5.00% APR
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-[#8892A4]">Total Supplied</div>
          <div className="font-mono-tech text-lg font-bold mt-1">{fromUnits(totalSupplied)}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-widest text-[#8892A4]">Your Wallet</div>
          <div className="font-mono-tech text-lg font-bold mt-1">{fromUnits(balance)}</div>
        </div>
      </div>

      <div className="mt-5">
        <div className="flex justify-between text-[10px] uppercase tracking-widest text-[#8892A4] mb-1.5">
          <span>Utilization</span><span>{utilization.toFixed(1)}%</span>
        </div>
        <div className="h-2 rounded-full bg-white/5 overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${utilization}%` }} transition={{ duration: 1 }}
            className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${themeColor}, #FF0080)` }} />
        </div>
      </div>

      <div className="mt-5 relative">
        <input
          type="text"
          inputMode="decimal"
          value={amount}
          onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
          placeholder="0.00"
          className="neon-input pr-20"
        />
        <button
          type="button"
          onClick={() => balance && setAmount(fromUnits(balance, 6))}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold px-2 py-1 rounded"
          style={{ background: themeColor + "20", color: themeColor }}
        >
          MAX
        </button>
      </div>

      <div className="mt-4 flex gap-2">
        {needsApproval ? (
          <button
            disabled={!isConnected || !units || approving || waitApprove}
            onClick={() => approve({ address: token, abi: ERC20_ABI, functionName: "approve", args: [ARCBOLD_ADDRESS, units] })}
            className="btn-neon-orange flex-1"
          >
            {approving || waitApprove ? "Approving…" : `Approve ${symbol}`}
          </button>
        ) : (
          <button
            disabled={!isConnected || !units || supplying || waitSupply}
            onClick={() => supply({ address: ARCBOLD_ADDRESS, abi: ARCBOLD_ABI, functionName: "supply", args: [token, units] })}
            className="btn-neon-orange flex-1"
          >
            {supplying || waitSupply ? "Supplying…" : `Supply ${symbol}`}
          </button>
        )}
      </div>
    </motion.div>
  );
}
