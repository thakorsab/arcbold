# ArcBold Lending

Build a complete Web3 DeFi application called "ArcBold" — a Multi-Currency Lending Protocol on Arc Testnet. Build this as a production-ready, professional dApp with stunning animations.

═══════════════════════════════════════
PROJECT OVERVIEW
═══════════════════════════════════════

Name: ArcBold
Tagline: "Lend Bold. Borrow Smart."
Description: Cross-currency lending protocol on Arc Testnet. Supply USDC or EURC to earn interest. Use one as collateral to borrow the other. Powered by Arc's native programmable money.

═══════════════════════════════════════
NETWORK CONFIGURATION
═══════════════════════════════════════

Network Name: Arc Testnet
Chain ID: 5042002
RPC URL: https://rpc.testnet.arc.network
Explorer: https://testnet.arcscan.app
Native Gas Token: USDC
USDC Address: 0x3600000000000000000000000000000000000000
EURC Address: 0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a

═══════════════════════════════════════
SMART CONTRACT
═══════════════════════════════════════

Contract Address: 0xd68F0bC66eBF5FF78c741Ee93A607360DD0b6F37
Owner Wallet: 0xeED2122c193E4530531b0250a11A4B0a1aC78F11

Contract ABI Functions:
- supply(address token, uint256 amount)
- borrow(address collateralToken, address borrowToken, uint256 collateralAmount)
- repay(uint256 positionId)
- withdraw(uint256 supplyId)
- calculateInterest(uint256 positionId) → returns uint256
- getHealthFactor(uint256 positionId) → returns uint256
- getUserPositions(address user) → returns uint256[]
- getUserSupplyPositions(address user) → returns uint256[]
- getPosition(uint256 positionId) → returns Position struct
- getSupplyPosition(uint256 supplyId) → returns SupplyPosition struct
- getTVL() → returns (usdcTVL, eurcTVL)
- totalSupplied(address token) → returns uint256
- totalBorrowed(address token) → returns uint256
- positionCounter() → returns uint256
- supplyCounter() → returns uint256

Position Struct:
{
  borrower: address,
  collateralToken: address,
  borrowToken: address,
  collateralAmount: uint256,
  borrowedAmount: uint256,
  borrowedAt: uint256,
  active: bool
}

SupplyPosition Struct:
{
  supplier: address,
  token: address,
  amount: uint256,
  suppliedAt: uint256
}

═══════════════════════════════════════
TECH STACK
═══════════════════════════════════════

- React + Vite + TypeScript
- Tailwind CSS
- Wagmi v2.9.0
- Viem v2.17.0
- RainbowKit v2.2.0
- @tanstack/react-query v5.28.0
- Framer Motion (animations)
- React Router DOM v6

package.json:
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.22.0",
    "wagmi": "^2.9.0",
    "@rainbow-me/rainbowkit": "^2.2.0",
    "viem": "^2.17.0",
    "@tanstack/react-query": "^5.28.0",
    "framer-motion": "^11.0.0"
  }
}

WalletConnect Project ID: 459ebef47ea52e82a2c67f58eea39242

═══════════════════════════════════════
LOGO DESIGN
═══════════════════════════════════════

Design a professional SVG logo for ArcBold:
- Icon: A bold lightning bolt shape made of two interlocking currency flows ($ and €)
- The flows merge into an upward shooting arc
- Colors: Bright Orange (#FF6B00) + Hot Pink (#FF0080) with chrome/metallic shine
- Neon glow effect: orange outer glow pulsing slowly
- Text: "Arc" in white heavy bold + "Bold" in orange-to-pink gradient
- Font: Black/Heavy weight, very tight letter spacing, slightly italic
- Add chrome shine sweep animation across logo every 3 seconds
- Use this logo in: navbar, favicon, loading screen

═══════════════════════════════════════
DESIGN SYSTEM
═══════════════════════════════════════

Theme: Neon Dark — High Contrast, Shiny, Electric

Color Palette:
- Background: #060608 (pure dark)
- Surface: #0E0E16
- Card: rgba(255,107,0,0.04)
- Primary: #FF6B00 (electric orange)
- Secondary: #FF0080 (hot pink/magenta)
- Tertiary: #00FFD1 (neon teal — accent)
- Danger: #FF3B3B (red)
- Success: #00FFD1 (teal)
- Warning: #FFD600 (yellow)
- Text Primary: #FFFFFF
- Text Secondary: #8892A4
- Border: rgba(255,107,0,0.20)

Gradients:
- Hero gradient: linear-gradient(135deg, #FF6B00 0%, #FF0080 100%)
- Card shine: linear-gradient(135deg, rgba(255,107,0,0.06) 0%, rgba(255,0,128,0.06) 100%)
- Neon glow: 0 0 30px rgba(255,107,0,0.4), 0 0 60px rgba(255,0,128,0.2)
- Text gradient: background-clip text, -webkit-text-fill-color transparent

Typography:
- Font: Syne (Google Fonts) — futuristic, bold, unique
- Headings: 800-900 weight, tight tracking
- Numbers: Orbitron font (Google Fonts) — digital/tech feel
- Body: Syne 400-500

Glassmorphism Cards:
- background: rgba(255,107,0,0.04)
- backdrop-filter: blur(24px) saturate(180%)
- border: 1px solid rgba(255,107,0,0.15)
- border-radius: 24px
- box-shadow: 0 8px 32px rgba(255,107,0,0.08), inset 0 1px 0 rgba(255,255,255,0.06)
- On hover: border color brightens, subtle orange glow appears

═══════════════════════════════════════
ANIMATED BACKGROUND — CONNECTED PARTICLE NETWORK
═══════════════════════════════════════

Create a stunning Connected Particle Network background — completely different from any blob/orb animation:

Particle System:
- 60 particles total
- Colors: mix of #FF6B00, #FF0080, #00FFD1, #FFFFFF
- Sizes: 2px to 4px randomly
- Move: random slow directional movement, bounce off edges
- Each particle connects with lines to nearby particles (within 120px)
- Line color: gradient from particle to particle color
- Line opacity: based on distance (closer = more opaque)

Special Effects:
- 5 larger "node" particles (8px) — orange, slowly pulsing with glow
- When two nodes come close — bright flash connection line
- Occasional particle "burst" — one particle splits into 3 briefly
- Overall feel: blockchain network visualization

Canvas Implementation:
- Use HTML5 Canvas for performance
- RequestAnimationFrame loop
- Responsive — resize with window

Additional layers:
- Horizontal scan line slowly moving top to bottom, opacity 0.03
- Corner vignette — dark edges, bright center
- Very subtle orange radial glow at hero section center

═══════════════════════════════════════
PAGES & FEATURES
═══════════════════════════════════════

PAGE 1 — DASHBOARD (/)

Hero Section:
- Massive heading: "LEND" (white) + "BOLD." (orange-pink gradient) — huge font
- Second line: "BORROW" (white) + "SMART." (teal)
- Subtext: "Cross-currency lending on Arc Testnet. Supply USDC, borrow EURC. Or flip it."
- Two CTA buttons:
  * "Start Lending →" — orange gradient, neon glow on hover
  * "Borrow Now →" — pink outline, pink glow on hover
- Animated counter numbers for stats

Stats Bar (4 cards):
- Total Value Locked
- Total USDC Supplied
- Total EURC Supplied
- Active Borrow Positions
- Numbers use Orbitron font
- Count-up animation on load

How It Works (3 steps):
- Step 1: Supply tokens → Earn 5% APR
- Step 2: Deposit collateral → Borrow other currency
- Step 3: Repay anytime → Get collateral back
- Each step: large neon number, icon, animated connector line between steps

Your Positions (if wallet connected):
- Active borrows with health factor
- Supply positions with earned interest

PAGE 2 — SUPPLY (/supply)

Two supply cards:
- USDC Card: orange theme
- EURC Card: pink theme

Each card:
- Token logo + name + APR badge (5%)
- Total supplied in protocol
- Your supplied amount
- Available liquidity progress bar
- Amount input with max button
- "Approve + Supply" button
- "Withdraw" button

Supply Positions table below

PAGE 3 — BORROW (/borrow)

Borrow Interface:
- Select Collateral: USDC or EURC (toggle cards)
- Borrow token auto-selects opposite
- Collateral amount input
- Live preview panel:
  * Collateral amount
  * You receive (collateral * 100/150)
  * Collateral Ratio: 150%
  * Interest Rate: 5% APR
  * Health Factor gauge

Health Factor Gauge:
- Circular arc gauge (not linear)
- Animated needle/fill
- Color zones: Green > 130, Yellow 100-130, Red < 100
- Glowing indicator dot

Borrow button → approve collateral → borrow()

Borrow Positions table

PAGE 4 — POSITIONS (/positions)

Two tabs: Supply | Borrow

Borrow position cards:
- Neon border based on health (green/yellow/red)
- Real-time interest counter (ticking up every second visually)
- Health factor circular indicator
- Repay button with approve step

Supply position cards:
- Real-time earned interest display
- Withdraw button

PAGE 5 — ADMIN (/admin)
- Only wallet: 0xeED2122c193E4530531b0250a11A4B0a1aC78F11
- Access denied screen for others (with cool animation)
- All positions overview
- Platform TVL charts
- Filter: All / Paid / Pending

═══════════════════════════════════════
WALLET CONFIG
═══════════════════════════════════════

const arcTestnet = {
  id: 5042002,
  name: 'Arc Testnet',
  nativeCurrency: {
    decimals: 6,
    name: 'USDC',
    symbol: 'USDC',
  },
  rpcUrls: {
    default: { http: ['https://rpc.testnet.arc.network'] },
  },
  blockExplorers: {
    default: { name: 'ArcScan', url: 'https://testnet.arcscan.app' },
  },
}

RainbowKit:
- WalletConnect Project ID: 459ebef47ea52e82a2c67f58eea39242
- darkTheme with orange accent (#FF6B00)
- Only Arc Testnet
- NO network switch banner
- NO wrong network warning
- NO chain switching UI

═══════════════════════════════════════
TECHNICAL NOTES
═══════════════════════════════════════

Token Decimals: Both USDC and EURC = 6 decimals
- User inputs "100" → send 100000000
- Display: divide by 1000000
- Always use BigInt

Two-Step for Supply:
1. approve() on token contract → spender = ArcBold contract
2. supply()

Two-Step for Borrow:
1. approve() collateral token
2. borrow()

For Repay:
1. approve() borrow token for repay + interest
2. repay(positionId)

Real-time interest (frontend):
const interest = (borrowedAmount * 5 * timeElapsed) / (100 * 365 * 24 * 3600)

Health Factor:
const hf = (collateralAmount * 100) / (totalDebt * 150 / 100)

Explorer: https://testnet.arcscan.app
Faucet: https://faucet.circle.com/

═══════════════════════════════════════
ANIMATIONS
═══════════════════════════════════════

- Page transitions: slide + fade
- Cards: stagger reveal on scroll
- Numbers: count up with Orbitron font
- Health gauge: animated arc fill
- Interest counter: real-time tick
- Button hover: scale + glow intensify
- Loading: pulsing orange skeleton
- Success: neon flash + checkmark
- Toast: slide from right, neon border

═══════════════════════════════════════
NAVBAR
═══════════════════════════════════════

- Logo left (chrome shine animation)
- Links: Dashboard | Supply | Borrow | Positions
- Connect Wallet right (RainbowKit)
- Sticky — backdrop blur + dark bg
- Active link: orange underline glow
- Mobile: hamburger with slide menu

═══════════════════════════════════════
FOOTER
═══════════════════════════════════════

- Center bottom
- "Built by Thakor"
- X logo → https://x.com/thakorsabG new tab
- Orange top border with glow
- "Powered by Arc Testnet"

═══════════════════════════════════════
MOBILE RESPONSIVE
═══════════════════════════════════════

- Full mobile responsive
- Hamburger menu
- Cards stack vertically
- Tables → cards on mobile
- Touch buttons min 48px

═══════════════════════════════════════
DO NOT INCLUDE
═══════════════════════════════════════

- No network switch banner
- No wrong network warning
- No chain switching UI
- No mock data
- No placeholder values

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://arcbold.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/543495e0-f292-45b2-b02a-8a1678627071).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
