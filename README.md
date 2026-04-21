# ILuminate

ILuminate is a TON and STON.fi focused web app for liquidity provider visibility and decision support.

Current build priorities are:
- Live wallet LP position visibility from STON.fi APIs
- Clear product status messaging so live and coming-soon modules are easy to spot
- Safe wallet connected flows through TonConnect

## What It Does Today

### Live wallet pages
- Connect a TON wallet with TonConnect
- Load live LP positions from STON.fi
- Show a desktop-collapsible workspace sidebar and mobile slide-out navigation
- Show per-position:
  - pair, APY, current value
  - hold baseline (derived)
  - net vs hold (derived when attribution data is sufficient)

### Net-vs-hold attribution (current model)
- Uses wallet operations from the last `180` days
- Filters for liquidity settlement operations only:
  - `AddLiquidity`
  - `WithdrawLiquidity`
- Computes a baseline from token flows and current prices
- Leaves metrics as `Unavailable` when attribution is not reliable

### Simulator flows
- Public simulator (`/simulator`) with live APY lookups where available
- App simulator (`/app/simulator`) can prepare transaction params via STON SDK and send through TonConnect

## Coming Soon (Current Scope)

These modules are intentionally not faked in UI:
- Full impermanent loss attribution
- Realized fees attribution
- Live alert firing logic
- Live rebalance recommendation engine

The app surfaces these as "Coming soon" or "Unavailable" instead of returning mock data.

## Tech Stack

- React 18 + TypeScript + Vite
- Tailwind CSS + shadcn/ui
- TanStack Query
- TON Connect UI React
- STON.fi API + STON.fi SDK

## Data Sources

- STON.fi wallet pools endpoint
- STON.fi wallet operations endpoint
- STON.fi assets and pool-by-pair endpoints
- TON RPC via STON SDK transaction preparation

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Install

```bash
git clone https://github.com/Pelz01/illuminate.git
cd illuminate
npm install
```

### Run locally

```bash
npm run dev
```

Open:
- `http://127.0.0.1:5173`

### Build

```bash
npm run build
```

## Environment Variables

No required environment variables for basic local run.

Optional:
- `VITE_TON_CONNECT_MANIFEST_URL`
- `VITE_POLLINATIONS_API_KEY`

If not set:
- In HTTPS environments, app uses `https://<your-domain>/tonconnect-manifest.json`
- In local HTTP dev, app falls back to TON demo manifest for compatibility

If you want wallet prompts to show your own app identity during local testing, set:

```env
VITE_TON_CONNECT_MANIFEST_URL=https://your-domain/tonconnect-manifest.json
```

And ensure that manifest is reachable over HTTPS.

To enable streamed AI rebalance recommendations in the app:

```env
VITE_POLLINATIONS_API_KEY=pk_or_sk_key_here
```

Use `pk_` only for client-side testing and demos. Never expose `sk_` in public clients.

## Scripts

- `npm run dev` - start dev server
- `npm run build` - production build
- `npm run build:dev` - dev-mode build
- `npm run preview` - preview production build
- `npm run lint` - run eslint
- `npm run test` - run tests once
- `npm run test:watch` - run tests in watch mode

## Deployment Notes (Vercel)

The repo includes SPA rewrite routing in `vercel.json`:
- all routes rewrite to `/index.html`

This prevents 404 errors when refreshing nested routes like `/app/positions`.

## Project Structure

```text
src/
  components/
  hooks/
  lib/
  pages/
    app/
public/
```

## Status

This is an active build with live data integration and staged feature rollout.
The roadmap focuses on attribution quality and safe execution flows before enabling advanced automation.
