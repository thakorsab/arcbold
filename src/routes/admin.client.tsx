import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { useAccount, useReadContract, useReadContracts } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ARCBOLD_ABI } from "../lib/web3/abi";
import { ADMIN_ADDRESS, ARCBOLD_ADDRESS } from "../lib/web3/config";
import { useTVL } from "../lib/web3/hooks";
import { fromUnits, shortAddress } from "../lib/web3/format";

export const Route = createFileRoute("/admin/client")({
  component: AdminPage,
});

function AdminPage() {
  const { address, isConnected } = useAccount();
  const isAdmin = isConnected && address?.toLowerCase() === ADMIN_ADDRESS.toLowerCase();

  if (!isConnected) {
    return (
      <div className="max-w-md mx-auto px-6 py-24 text-center">
        <div className="glass-card p-10">
          <h1 className="font-display font-black text-3xl mb-3">Admin Access</h1>
          <p className="text-[#8892A4] mb-6">Connect the owner wallet to continue.</p>
          <div className="inline-block"><ConnectButton /></div>
        </div>
      </div>
    );
  }
  if (!isAdmin) return <AccessDenied />;

  return <AdminDashboard />;
}

function AccessDenied() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring" }}
        className="text-center max-w-md">
        <motion.div
          animate={{ rotate: [0, -3, 3, -3, 0], textShadow: ["0 0 20px #FF3B3B", "0 0 40px #FF3B3B", "0 0 20px #FF3B3B"] }}
          transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 1.5 }}
          className="font-display font-black italic text-[clamp(3rem,12vw,7rem)] leading-none text-[#FF3B3B]"
          style={{ filter: "drop-shadow(0 0 30px rgba(255,59,59,0.5))" }}>
          ACCESS<br />DENIED
        </motion.div>
        <p className="mt-4 text-[#8892A4]">This area is restricted to the protocol owner.</p>
      </motion.div>
    </div>
  );
}

function AdminDashboard() {
  const { data: tvl } = useTVL();
  const { data: counter } = useReadContract({
    address: ARCBOLD_ADDRESS, abi: ARCBOLD_ABI, functionName: "positionCounter",
    query: { refetchInterval: 10000 },
  });
  const count = counter ? Number(counter) : 0;
  const [filter, setFilter] = useState<"all" | "paid" | "pending">("all");

  const calls = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      address: ARCBOLD_ADDRESS, abi: ARCBOLD_ABI, functionName: "getPosition" as const, args: [BigInt(i + 1)],
    })),
  [count]);
  const { data: positions } = useReadContracts({ contracts: calls, query: { enabled: count > 0, refetchInterval: 15000 } });

  const all = (positions ?? []).map((r, i) => ({ id: i + 1, p: r.result as any })).filter((x) => x.p);
  const filtered = all.filter((x) => filter === "all" || (filter === "paid" ? !x.p.active : x.p.active));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <div className="font-mono-tech text-[10px] tracking-[0.4em] text-[#00FFD1]">ADMIN · OWNER</div>
        <h1 className="font-display font-black italic text-4xl sm:text-6xl mt-2">
          Protocol <span className="text-gradient-bold">Control</span>
        </h1>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <Stat label="USDC TVL" value={fromUnits(tvl?.[0])} accent="#FF6B00" />
        <Stat label="EURC TVL" value={fromUnits(tvl?.[1])} accent="#FF0080" />
        <Stat label="Total Positions" value={count.toString()} accent="#00FFD1" />
      </div>

      <div className="flex gap-2 mb-4">
        {(["all", "pending", "paid"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-display font-bold text-xs uppercase tracking-widest ${
              filter === f ? "bg-[#FF6B00] text-[#060608]" : "bg-white/5 text-[#8892A4] hover:text-white"
            }`}>
            {f}
          </button>
        ))}
      </div>

      <div className="glass-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[10px] uppercase tracking-widest text-[#8892A4]">
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Borrower</th>
              <th className="px-4 py-3">Collateral</th>
              <th className="px-4 py-3">Borrowed</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-[#8892A4]">No positions match filter.</td></tr>
            )}
            {filtered.map(({ id, p }) => (
              <tr key={id} className="border-t border-white/5 font-mono-tech">
                <td className="px-4 py-3 text-[#FF6B00]">#{id}</td>
                <td className="px-4 py-3">{shortAddress(p.borrower)}</td>
                <td className="px-4 py-3">{fromUnits(p.collateralAmount)}</td>
                <td className="px-4 py-3">{fromUnits(p.borrowedAmount)}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-xs ${p.active ? "bg-[#FFD600]/15 text-[#FFD600]" : "bg-[#00FFD1]/15 text-[#00FFD1]"}`}>
                    {p.active ? "PENDING" : "PAID"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="glass-card p-5" style={{ borderColor: accent + "40" }}>
      <div className="text-[10px] uppercase tracking-widest text-[#8892A4]">{label}</div>
      <div className="font-mono-tech text-3xl font-black mt-2" style={{ color: accent, textShadow: `0 0 18px ${accent}55` }}>{value}</div>
    </div>
  );
}
