import { motion } from "framer-motion";

export function HealthGauge({ value, size = 180 }: { value: number; size?: number }) {
  // value is the health factor scaled e.g. 150 = 1.5x
  const display = isFinite(value) ? value : 999;
  const clamped = Math.max(0, Math.min(200, display));
  const pct = clamped / 200; // 0..1
  const color = display >= 130 ? "#00FFD1" : display >= 100 ? "#FFD600" : "#FF3B3B";
  const r = size / 2 - 12;
  const c = 2 * Math.PI * r;
  const arc = c * 0.75; // 270deg arc
  const offset = arc * (1 - pct);
  const label = display >= 999 ? "∞" : (display / 100).toFixed(2);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-[135deg]">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" strokeDasharray={`${arc} ${c}`} strokeLinecap="round" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={`${arc} ${c}`}
          strokeLinecap="round"
          initial={{ strokeDashoffset: arc }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{ filter: `drop-shadow(0 0 8px ${color})` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-[10px] uppercase tracking-widest text-[#8892A4]">Health</div>
        <div className="font-mono-tech text-3xl font-black" style={{ color }}>
          {label}
        </div>
        <div className="text-[10px] uppercase tracking-widest" style={{ color }}>
          {display >= 130 ? "Safe" : display >= 100 ? "Caution" : "Liquidatable"}
        </div>
      </div>
    </div>
  );
}
