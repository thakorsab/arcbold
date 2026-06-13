import { useReadContract, useReadContracts, useAccount } from "wagmi";
import { ARCBOLD_ABI, ERC20_ABI } from "./abi";
import { ARCBOLD_ADDRESS, USDC_ADDRESS, EURC_ADDRESS } from "./config";

export function useTVL() {
  return useReadContract({
    address: ARCBOLD_ADDRESS,
    abi: ARCBOLD_ABI,
    functionName: "getTVL",
    query: { refetchInterval: 15000 },
  });
}

export function useTotals() {
  return useReadContracts({
    contracts: [
      { address: ARCBOLD_ADDRESS, abi: ARCBOLD_ABI, functionName: "totalSupplied", args: [USDC_ADDRESS] },
      { address: ARCBOLD_ADDRESS, abi: ARCBOLD_ABI, functionName: "totalSupplied", args: [EURC_ADDRESS] },
      { address: ARCBOLD_ADDRESS, abi: ARCBOLD_ABI, functionName: "totalBorrowed", args: [USDC_ADDRESS] },
      { address: ARCBOLD_ADDRESS, abi: ARCBOLD_ABI, functionName: "totalBorrowed", args: [EURC_ADDRESS] },
      { address: ARCBOLD_ADDRESS, abi: ARCBOLD_ABI, functionName: "positionCounter" },
    ],
    query: { refetchInterval: 15000 },
  });
}

export function useUserPositionIds() {
  const { address } = useAccount();
  return useReadContract({
    address: ARCBOLD_ADDRESS,
    abi: ARCBOLD_ABI,
    functionName: "getUserPositions",
    args: address ? [address] : undefined,
    query: { enabled: !!address, refetchInterval: 10000 },
  });
}

export function useUserSupplyIds() {
  const { address } = useAccount();
  return useReadContract({
    address: ARCBOLD_ADDRESS,
    abi: ARCBOLD_ABI,
    functionName: "getUserSupplyPositions",
    args: address ? [address] : undefined,
    query: { enabled: !!address, refetchInterval: 10000 },
  });
}

export function useTokenBalance(token: `0x${string}`) {
  const { address } = useAccount();
  return useReadContract({
    address: token,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address, refetchInterval: 10000 },
  });
}

export function useAllowance(token: `0x${string}`) {
  const { address } = useAccount();
  return useReadContract({
    address: token,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: address ? [address, ARCBOLD_ADDRESS] : undefined,
    query: { enabled: !!address, refetchInterval: 5000 },
  });
}
