export const ARCBOLD_ABI = [
  { type: "function", name: "supply", stateMutability: "nonpayable", inputs: [{ name: "token", type: "address" }, { name: "amount", type: "uint256" }], outputs: [] },
  { type: "function", name: "borrow", stateMutability: "nonpayable", inputs: [{ name: "collateralToken", type: "address" }, { name: "borrowToken", type: "address" }, { name: "collateralAmount", type: "uint256" }], outputs: [] },
  { type: "function", name: "repay", stateMutability: "nonpayable", inputs: [{ name: "positionId", type: "uint256" }], outputs: [] },
  { type: "function", name: "withdraw", stateMutability: "nonpayable", inputs: [{ name: "supplyId", type: "uint256" }], outputs: [] },
  { type: "function", name: "calculateInterest", stateMutability: "view", inputs: [{ name: "positionId", type: "uint256" }], outputs: [{ type: "uint256" }] },
  { type: "function", name: "getHealthFactor", stateMutability: "view", inputs: [{ name: "positionId", type: "uint256" }], outputs: [{ type: "uint256" }] },
  { type: "function", name: "getUserPositions", stateMutability: "view", inputs: [{ name: "user", type: "address" }], outputs: [{ type: "uint256[]" }] },
  { type: "function", name: "getUserSupplyPositions", stateMutability: "view", inputs: [{ name: "user", type: "address" }], outputs: [{ type: "uint256[]" }] },
  {
    type: "function", name: "getPosition", stateMutability: "view",
    inputs: [{ name: "positionId", type: "uint256" }],
    outputs: [{
      type: "tuple",
      components: [
        { name: "borrower", type: "address" },
        { name: "collateralToken", type: "address" },
        { name: "borrowToken", type: "address" },
        { name: "collateralAmount", type: "uint256" },
        { name: "borrowedAmount", type: "uint256" },
        { name: "borrowedAt", type: "uint256" },
        { name: "active", type: "bool" },
      ],
    }],
  },
  {
    type: "function", name: "getSupplyPosition", stateMutability: "view",
    inputs: [{ name: "supplyId", type: "uint256" }],
    outputs: [{
      type: "tuple",
      components: [
        { name: "supplier", type: "address" },
        { name: "token", type: "address" },
        { name: "amount", type: "uint256" },
        { name: "suppliedAt", type: "uint256" },
      ],
    }],
  },
  { type: "function", name: "getTVL", stateMutability: "view", inputs: [], outputs: [{ name: "usdcTVL", type: "uint256" }, { name: "eurcTVL", type: "uint256" }] },
  { type: "function", name: "totalSupplied", stateMutability: "view", inputs: [{ name: "token", type: "address" }], outputs: [{ type: "uint256" }] },
  { type: "function", name: "totalBorrowed", stateMutability: "view", inputs: [{ name: "token", type: "address" }], outputs: [{ type: "uint256" }] },
  { type: "function", name: "positionCounter", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "supplyCounter", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
] as const;

export const ERC20_ABI = [
  { type: "function", name: "approve", stateMutability: "nonpayable", inputs: [{ name: "spender", type: "address" }, { name: "amount", type: "uint256" }], outputs: [{ type: "bool" }] },
  { type: "function", name: "allowance", stateMutability: "view", inputs: [{ name: "owner", type: "address" }, { name: "spender", type: "address" }], outputs: [{ type: "uint256" }] },
  { type: "function", name: "balanceOf", stateMutability: "view", inputs: [{ name: "account", type: "address" }], outputs: [{ type: "uint256" }] },
  { type: "function", name: "decimals", stateMutability: "view", inputs: [], outputs: [{ type: "uint8" }] },
  { type: "function", name: "symbol", stateMutability: "view", inputs: [], outputs: [{ type: "string" }] },
] as const;
