import { useEffect, useState } from "react";
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { ARCBOLD_ABI, ERC20_ABI } from "../lib/web3/abi";
import { ARCBOLD_ADDRESS, USDC_ADDRESS, EURC_ADDRESS } from "../lib/web3/config";
import { fromUnits, fromUnitsNum } from "../lib/web3/format";
import { HealthGauge } from "./HealthGauge";
import { useToast } from "./TxToast";
import { motion } from "framer-motion";

function tokenLabel(addr: string) {
  if (addr.toLowerCase() === USDC_ADDRESS.toLowerCase()) return "USDC";
  if (addr.toLowerCase() === EURC_ADDRESS.toLowerCase()) return "EURC";
  return addr.slice(0, 6);
}

export function BorrowPositionCard({ positionId }: { positionId: bigint }) {
  const { data: pos } = useReadContract({
    address: ARCBOLD_ADDRESS, abi: ARCBOLD_ABI, functionName: "getPosition", args: [positionId],
    query: { refetchInterval: 15000 },
  });
  const { data: hf } = useReadContract({
    address: ARCBOLD_ADDRESS, abi: ARCBOLD_ABI, functionName: "getHealthFactor", args: [positionId],
    query: { refetchInterval: 10000 },
  });

  const [tickInterest, setTickInterest] = useState(0);
  useEffect(() => {
    if (!pos || !pos.active) return;
    const compute = () => {
      const borrowed = fromUnitsNum(pos.borrowedAmount);
      const elapsed = Math.max(0, Math.floor(Date.now() / 1000) - Number(pos.borrowedAt));
      setTickInterest((borrowed * 5 * elapsed) / (100 * 365 * 24 * 3600));
    };
    compute();
    const id = setInterval(compute, 1000);
    return () => clearInterval(id);
  }, [pos]);

  const { push } = useToast();
  const { writeContract: approve, data: approveHash, isPending: approving } = useWriteContract();
  const { writeContract: repay, data: repayHash, isPending: repaying } = useWriteContract();
  const { isLoading: waitingApprove, isSuccess: approved } = useWaitForTransactionReceipt({ hash: approveHash });
  const { isLoading: waitingRepay, isSuccess: repaid } = useWaitForTransactionReceipt({ hash: repayHash });

  useEffect(() => { if (approved) push({ title: "Approval confirmed", kind: "success", hash: approveHash }); }, [approved]);
  useEffect(() => { if (repaid) push({ title: "Loan repaid", kind: "success", hash: repayHash }); }, [repaid]);

  if (!pos) {
    return <div className="glass-card p-6 animate-pulse h-48" />;
  }
  if (!pos.active) return null;

  const hfNum = hf !== undefined ? Number(hf) : 999;
  const borderColor = hfNum >= 130 ? "rgba(0,255,209,0.4)" : hfNum >= 100 ? "rgba(255,214,0,0.4)" : "rgba(255,59,59,0.5)";
  const totalDue = pos.borrowedAmount + BigInt(Math.floor(tickInterest * 1_000_000));

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6"
      style={{ borderColor, boxShadow: `0 0 30px ${borderColor}` }}>
      <div className="grid md:grid-cols-[1fr_auto] gap-6 items-center">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="font-mono-tech text-xs px-2 py-1 rounded bg-white/5 text-[#FF6B00]">#{positionId.toString()}</span>
            <span className="font-display font-black text-lg text-white">
              {tokenLabel(pos.collateralToken)} → {tokenLabel(pos.borrowToken)}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <Stat label="Collateral" value={`${fromUnits(pos.collateralAmount)} ${tokenLabel(pos.collateralToken)}`} />
            <Stat label="Borrowed" value={`${fromUnits(pos.borrowedAmount)} ${tokenLabel(pos.borrowToken)}`} />
            <Stat label="Interest" value={`+${tickInterest.toFixed(6)}`} tick />
            <Stat label="Total Due" value={fromUnits(totalDue, 4)} />
          </div>
          <div className="flex gap-2 pt-2">
            <button
              disabled={approving || waitingApprove}
              onClick={() => approve({
                address: pos.borrowToken as `0x${string}`, abi: ERC20_ABI, functionName: "approve",
                args: [ARCBOLD_ADDRESS, totalDue * 2n],
              })}
              className="btn-neon-teal text-sm"
            >
              {approving || waitingApprove ? "Approving…" : "1. Approve"}
            </button>
            <button
              disabled={repaying || waitingRepay || !approved}
              onClick={() => repay({ address: ARCBOLD_ADDRESS, abi: ARCBOLD_ABI, functionName: "repay", args: [positionId] })}
              className="btn-neon-orange text-sm py-2.5 px-4"
            >
              {repaying || waitingRepay ? "Repaying…" : "2. Repay"}
            </button>
          </div>
        </div>
        <HealthGauge value={hfNum} size={150} />
      </div>
    </motion.div>
  );
}

function Stat({ label, value, tick }: { label: string; value: string; tick?: boolean }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-[#8892A4]">{label}</div>
      <div className={`font-mono-tech font-bold text-white mt-0.5 ${tick ? "text-[#00FFD1]" : ""}`}>{value}</div>
    </div>
  );
}

export function SupplyPositionCard({ supplyId }: { supplyId: bigint }) {
  const { data: pos } = useReadContract({
    address: ARCBOLD_ADDRESS, abi: ARCBOLD_ABI, functionName: "getSupplyPosition", args: [supplyId],
    query: { refetchInterval: 15000 },
  });

  const [earned, setEarned] = useState(0);
  useEffect(() => {
    if (!pos) return;
    const compute = () => {
      const supplied = fromUnitsNum(pos.amount);
      const elapsed = Math.max(0, Math.floor(Date.now() / 1000) - Number(pos.suppliedAt));
      setEarned((supplied * 5 * elapsed) / (100 * 365 * 24 * 3600));
    };
    compute();
    const id = setInterval(compute, 1000);
    return () => clearInterval(id);
  }, [pos]);

  const { push } = useToast();
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: waiting, isSuccess } = useWaitForTransactionReceipt({ hash });
  useEffect(() => { if (isSuccess) push({ title: "Withdrawn", kind: "success", hash }); }, [isSuccess]);

  if (!pos) return <div className="glass-card p-6 animate-pulse h-32" />;
  if (pos.amount === 0n) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card glass-card-hover p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="font-mono-tech text-xs px-2 py-1 rounded bg-white/5 text-[#FF0080]">#{supplyId.toString()}</span>
            <span className="font-display font-black text-lg text-white">Supplied {tokenLabel(pos.token)}</span>
            <span className="text-xs font-mono-tech px-2 py-0.5 rounded bg-[#00FFD1]/10 text-[#00FFD1]">5% APR</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-sm">
            <Stat label="Principal" value={`${fromUnits(pos.amount)} ${tokenLabel(pos.token)}`} />
            <Stat label="Earned (live)" value={`+${earned.toFixed(6)}`} tick />
            <Stat label="Since" value={new Date(Number(pos.suppliedAt) * 1000).toLocaleDateString()} />
          </div>
        </div>
        <button
          disabled={isPending || waiting}
          onClick={() => writeContract({ address: ARCBOLD_ADDRESS, abi: ARCBOLD_ABI, functionName: "withdraw", args: [supplyId] })}
          className="btn-neon-orange"
        >
          {isPending || waiting ? "Withdrawing…" : "Withdraw"}
        </button>
      </div>
    </motion.div>
  );
}
