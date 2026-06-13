export const DECIMALS = 6;
export const SCALE = 10n ** BigInt(DECIMALS);

export function toUnits(amount: string): bigint {
  if (!amount || isNaN(Number(amount))) return 0n;
  const [whole = "0", frac = ""] = amount.split(".");
  const fracPadded = (frac + "0".repeat(DECIMALS)).slice(0, DECIMALS);
  return BigInt(whole) * SCALE + BigInt(fracPadded || "0");
}

export function fromUnits(amount: bigint | undefined, decimals = 2): string {
  if (amount === undefined) return "0.00";
  const whole = amount / SCALE;
  const frac = amount % SCALE;
  const fracStr = frac.toString().padStart(DECIMALS, "0").slice(0, decimals);
  return `${whole.toLocaleString("en-US")}${decimals > 0 ? "." + fracStr : ""}`;
}

export function fromUnitsNum(amount: bigint | undefined): number {
  if (amount === undefined) return 0;
  return Number(amount) / Number(SCALE);
}

export function shortAddress(addr?: string): string {
  if (!addr) return "";
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}
