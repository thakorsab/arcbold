export function Logo({ size = 36 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2.5 relative">
      <div className="relative pulse-glow" style={{ width: size, height: size }}>
        <svg viewBox="0 0 48 48" width={size} height={size}>
          <defs>
            <linearGradient id="lb-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FF6B00" />
              <stop offset="100%" stopColor="#FF0080" />
            </linearGradient>
            <linearGradient id="lb-chrome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="40%" stopColor="#FF6B00" />
              <stop offset="100%" stopColor="#FF0080" />
            </linearGradient>
          </defs>
          {/* Lightning bolt fused with $/€ flow */}
          <path
            d="M28 4 L10 26 L20 26 L16 44 L38 20 L26 20 L30 4 Z"
            fill="url(#lb-chrome)"
            stroke="url(#lb-grad)"
            strokeWidth="1"
          />
          <text x="14" y="20" fontFamily="Orbitron, monospace" fontWeight="900" fontSize="9" fill="#fff" opacity="0.85">$</text>
          <text x="24" y="36" fontFamily="Orbitron, monospace" fontWeight="900" fontSize="9" fill="#060608">€</text>
        </svg>
      </div>
      <div className="relative overflow-hidden">
        <div className="flex items-baseline font-display font-black tracking-tight italic text-2xl leading-none select-none">
          <span className="text-white">Arc</span>
          <span className="text-gradient-bold">Bold</span>
        </div>
        <div className="shine-sweep" />
      </div>
    </div>
  );
}
