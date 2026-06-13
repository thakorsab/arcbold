import { AnimatePresence, motion } from "framer-motion";
import { createContext, ReactNode, useCallback, useContext, useState } from "react";

type Toast = { id: number; title: string; kind: "info" | "success" | "error"; hash?: string };
const Ctx = createContext<{ push: (t: Omit<Toast, "id">) => void } | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = useCallback((t: Omit<Toast, "id">) => {
    const id = Date.now() + Math.random();
    setToasts((s) => [...s, { ...t, id }]);
    setTimeout(() => setToasts((s) => s.filter((x) => x.id !== id)), 6000);
  }, []);
  return (
    <Ctx.Provider value={{ push }}>
      {children}
      <div className="fixed top-20 right-4 z-[100] flex flex-col gap-2 max-w-sm">
        <AnimatePresence>
          {toasts.map((t) => {
            const color = t.kind === "success" ? "#00FFD1" : t.kind === "error" ? "#FF3B3B" : "#FF6B00";
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: 80 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 80 }}
                className="glass-card p-4 min-w-[260px]"
                style={{ borderColor: color, boxShadow: `0 0 24px ${color}55` }}
              >
                <div className="font-display font-bold text-white">{t.title}</div>
                {t.hash && (
                  <a href={`https://testnet.arcscan.app/tx/${t.hash}`} target="_blank" rel="noreferrer" className="text-xs font-mono-tech mt-1 block hover:underline" style={{ color }}>
                    View on ArcScan ↗
                  </a>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </Ctx.Provider>
  );
}

export function useToast() {
  const c = useContext(Ctx);
  if (!c) return { push: () => {} };
  return c;
}
