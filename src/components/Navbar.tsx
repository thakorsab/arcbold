import { Link } from "@tanstack/react-router";
import { WalletBadge } from "./WalletBadge";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { Menu, X } from "lucide-react";

const links = [
  { to: "/", label: "Dashboard" },
  { to: "/supply", label: "Supply" },
  { to: "/borrow", label: "Borrow" },
  { to: "/positions", label: "Positions" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#060608]/70 border-b border-[rgba(255,107,0,0.15)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <Logo />
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="px-4 py-2 text-sm font-semibold tracking-wide text-[#8892A4] hover:text-white transition relative group"
              activeProps={{ className: "px-4 py-2 text-sm font-semibold tracking-wide text-white relative" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
              <span className="absolute left-3 right-3 -bottom-0.5 h-[2px] bg-gradient-to-r from-[#FF6B00] to-[#FF0080] opacity-0 group-hover:opacity-100 group-data-[status=active]:opacity-100 transition shadow-[0_0_10px_#FF6B00]" />
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {mounted && <WalletBadge />}
          <button className="md:hidden p-2 text-white" onClick={() => setOpen(!open)} aria-label="menu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-[rgba(255,107,0,0.15)] bg-[#060608]/95">
          <div className="px-4 py-3 flex flex-col gap-1">
            {links.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="px-4 py-3 text-base font-semibold text-[#8892A4] hover:text-white" activeProps={{ className: "px-4 py-3 text-base font-semibold text-[#FF6B00]" }} activeOptions={{ exact: l.to === "/" }}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
