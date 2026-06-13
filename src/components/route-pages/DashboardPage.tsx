import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";

import { Counter } from "../Counter";
import { fromUnitsNum } from "../../lib/web3/format";
import { useTVL, useTotals } from "../../lib/web3/hooks";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.6, ease: "easeOut" as const } }),
};

export default function Dashboard() {
  const { data: tvl } = useTVL();
  const { data: totals } = useTotals();

  const usdcTvl = tvl ? fromUnitsNum(tvl[0]) : 0;
  const eurcTvl = tvl ? fromUnitsNum(tvl[1]) : 0;
  const total = usdcTvl + eurcTvl;
  const positionCount = totals?.[4]?.result ? Number(totals[4].result) : 0;

  const stats = [
    { label: "Total Value Locked", value: total, prefix: "$", decimals: 2 },
    { label: "USDC Supplied", value: usdcTvl, prefix: "", suffix: " USDC", decimals: 2 },
    { label: "EURC Supplied", value: eurcTvl, prefix: "", suffix: " EURC", decimals: 2 },
    { label: "Active Positions", value: positionCount, prefix: "", decimals: 0 },
  ];

  return (
    <div className="relative">
      <section className="relative px-4 sm:px-6 pt-16 sm:pt-24 pb-12 max-w-7xl mx-auto">
        <div className="hero-glow" />
        <motion.div initial="hidden" animate="show" className="relative text-center">
          <motion.h1 custom={0} variants={fadeUp} className="font-display font-black tracking-tighter leading-[0.9] italic text-[clamp(1.5rem,4.8vw,3.75rem)] whitespace-nowrap">
            <span className="text-white">SUPPLY </span>
            <span className="text-gradient-smart">ARC</span>
            <span className="text-white"> EARN </span>
            <span className="text-gradient-bold">BOLD</span>
          </motion.h1>
          <motion.p custom={2} variants={fadeUp} className="mt-6 max-w-2xl mx-auto text-[#8892A4] text-base sm:text-lg">
            Cross-currency lending on Arc Testnet. Supply USDC, borrow EURC. Or flip it.
          </motion.p>
          <motion.div custom={3} variants={fadeUp} className="mt-10 flex flex-wrap gap-4 justify-center">
            <Link to="/supply" className="btn-neon-orange">Start Lending →</Link>
            <Link to="/borrow" className="btn-neon-pink">Borrow Now →</Link>
          </motion.div>
        </motion.div>
      </section>

      <section className="px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5 }}
              className="glass-card glass-card-hover p-5">
              <div className="text-[10px] uppercase tracking-widest text-[#8892A4]">{s.label}</div>
              <div className="mt-3 font-mono-tech text-2xl sm:text-3xl font-black text-white">
                {s.prefix}<Counter value={s.value} decimals={s.decimals} />{s.suffix}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="px-4 sm:px-6 max-w-7xl mx-auto mt-24">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="font-display font-black text-4xl sm:text-5xl italic text-center mb-12">
          HOW IT <span className="text-gradient-bold">WORKS</span>
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-6 relative">
          {[
            { n: "01", t: "Supply Tokens", d: "Deposit USDC or EURC and earn a steady 5% APR while the protocol puts your liquidity to work.", c: "#FF6B00" },
            { n: "02", t: "Borrow The Other", d: "Lock collateral at 150% ratio and borrow the opposite stablecoin instantly.", c: "#FF0080" },
            { n: "03", t: "Repay Anytime", d: "Pay back principal plus a small interest fee and reclaim your collateral in one tx.", c: "#00FFD1" },
          ].map((s, i) => (
            <motion.div key={s.n} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}
              className="glass-card glass-card-hover p-7 relative">
              <div className="font-mono-tech text-5xl font-black" style={{ color: s.c, textShadow: `0 0 18px ${s.c}66` }}>{s.n}</div>
              <div className="mt-4 font-display text-xl font-black text-white">{s.t}</div>
              <p className="mt-2 text-sm text-[#8892A4] leading-relaxed">{s.d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="px-4 sm:px-6 max-w-7xl mx-auto mt-24 mb-16">
        <div className="glass-card p-8 sm:p-12 text-center">
          <div className="font-mono-tech text-[10px] tracking-[0.4em] text-[#FF6B00]">ARC TESTNET · CHAIN 5042002</div>
          <h3 className="mt-4 font-display text-3xl sm:text-4xl font-black italic">
            Ready to <span className="text-gradient-bold">go bold?</span>
          </h3>
          <p className="mt-3 text-[#8892A4] max-w-xl mx-auto">Connect your wallet, grab test USDC from the Circle faucet, and start lending in 30 seconds.</p>
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <a href="https://faucet.circle.com/" target="_blank" rel="noreferrer" className="btn-neon-teal">Get Test USDC</a>
            <a href="https://testnet.arcscan.app" target="_blank" rel="noreferrer" className="btn-neon-pink">View Explorer</a>
          </div>
        </div>
      </section>
    </div>
  );
}