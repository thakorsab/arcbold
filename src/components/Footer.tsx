export function Footer() {
  return (
    <footer className="relative mt-24 border-t-2 border-[#FF6B00] shadow-[0_-10px_40px_rgba(255,107,0,0.2)]">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col items-center gap-3">
        <div className="text-sm text-[#8892A4] font-display">
          Built by{" "}
          <a
            href="https://x.com/thakorsabG"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white font-bold hover:text-[#FF6B00] transition inline-flex items-center gap-1"
          >
            Thakor
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
        </div>
        <div className="text-xs font-mono-tech tracking-widest text-[#FF6B00]/70">POWERED BY ARC TESTNET</div>
      </div>
    </footer>
  );
}
