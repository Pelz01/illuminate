import { StonApiClient, type AssetInfo } from "@ston-fi/api";

export type SupportedPoolName =
  | "TON / USDT"
  | "TON / NOT"
  | "TON / STON"
  | "USDT / DOGS";

type PoolTokenSymbol = "TON" | "USDT" | "NOT" | "STON" | "DOGS";

const TONCENTER_MAINNET = "https://toncenter.com/api/v2/jsonRPC";
const DEFAULT_SLIPPAGE = "0.01";
const TON_ASSET_ALIAS = "ton";
const TON_ASSET_CONTRACT = "EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c";

const apiClient = new StonApiClient();
type StonSdkModule = typeof import("@ston-fi/sdk");

let sdkPromise: Promise<StonSdkModule> | null = null;
let tonClientPromise: Promise<import("@ston-fi/sdk").Client> | null = null;

const getSdk = () => {
  sdkPromise ??= import("@ston-fi/sdk");
  return sdkPromise;
};

const getTonClient = async () => {
  tonClientPromise ??= (async () => {
    const { Client } = await getSdk();
    return new Client({
      endpoint: TONCENTER_MAINNET,
    });
  })();

  return tonClientPromise;
};

const symbolAliases: Record<PoolTokenSymbol, string[]> = {
  TON: ["TON"],
  USDT: ["USD₮", "USDT", "jUSDT"],
  NOT: ["NOT"],
  STON: ["STON"],
  DOGS: ["DOGS"],
};

const parsePoolSymbols = (poolName: string): [PoolTokenSymbol, PoolTokenSymbol] => {
  const [left, right] = poolName.split("/").map((part) => part.trim().toUpperCase());
  return [left as PoolTokenSymbol, right as PoolTokenSymbol];
};

const findAssetBySymbol = (assets: AssetInfo[], symbol: PoolTokenSymbol) => {
  const aliases = symbolAliases[symbol];
  if (!aliases) return null;

  const aliasMatcher = new RegExp(
    aliases.map((alias) => alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|"),
    "i"
  );

  const candidates = assets.filter((asset) => {
    const symbolMatch = aliases.some(
      (alias) => asset.symbol.toUpperCase() === alias.toUpperCase()
    );
    const displayNameMatch = aliasMatcher.test(asset.displayName ?? "");
    return symbolMatch || displayNameMatch;
  });

  if (candidates.length === 0) return null;

  const score = (asset: AssetInfo) => {
    const tags = asset.tags ?? [];
    const hasVeryHighLiquidity = tags.includes("asset:liquidity:very_high");
    const hasHighLiquidity = tags.includes("asset:liquidity:high");
    const hasEssential = tags.includes("asset:essential");
    const hasPopular = tags.includes("asset:popular");
    const hasNoLiquidity =
      tags.includes("asset:liquidity:no") || tags.includes("no_liquidity");
    const hasFake = tags.includes("asset:fake");

    return (
      (hasVeryHighLiquidity ? 1000 : 0) +
      (hasHighLiquidity ? 200 : 0) +
      (hasEssential ? 100 : 0) +
      (hasPopular ? 60 : 0) +
      (asset.defaultSymbol ? 40 : 0) +
      (asset.priority ?? 0) * 2 +
      (asset.popularityIndex ?? 0) -
      (asset.deprecated ? 200 : 0) -
      (hasNoLiquidity ? 120 : 0) -
      (hasFake ? 200 : 0)
    );
  };

  return [...candidates].sort((a, b) => score(b) - score(a))[0];
};

const resolveAssetAddress = (assets: AssetInfo[], symbol: PoolTokenSymbol) => {
  if (symbol === "TON") return TON_ASSET_ALIAS;

  const asset = findAssetBySymbol(assets, symbol);
  if (!asset) {
    throw new Error(`Unable to resolve STON asset for token "${symbol}".`);
  }

  return asset.contractAddress;
};

const toApiPairAddress = (assetAddress: string) =>
  assetAddress === TON_ASSET_ALIAS ? TON_ASSET_CONTRACT : assetAddress;

const isTonAddress = (assetAddress: string) =>
  assetAddress === TON_ASSET_ALIAS || assetAddress === TON_ASSET_CONTRACT;

const pickBestPool = <T extends { deprecated: boolean; volume24HUsd?: string }>(
  pools: T[]
) => {
  const sorted = pools
    .filter((pool) => !pool.deprecated)
    .sort(
      (a, b) => Number(b.volume24HUsd ?? "0") - Number(a.volume24HUsd ?? "0")
    );

  return sorted[0] ?? pools[0];
};

const getTonUsdPrice = (assets: AssetInfo[]) => {
  const tonAsset = findAssetBySymbol(assets, "TON");
  const price = Number(
    tonAsset?.dexPriceUsd ?? tonAsset?.thirdPartyPriceUsd ?? "0"
  );

  if (!Number.isFinite(price) || price <= 0) {
    throw new Error("Unable to resolve TON/USD price from STON.fi API.");
  }

  return price;
};

const usdToTonAmount = (usdAmount: number, tonUsdPrice: number) => {
  const tonAmount = usdAmount / tonUsdPrice;
  const bounded = Math.max(0.05, tonAmount);

  return Number(bounded.toFixed(6));
};

export const fetchPoolApys = async (poolNames: SupportedPoolName[]) => {
  const assets = await apiClient.getAssets();
  const apyMap: Partial<Record<SupportedPoolName, number>> = {};

  await Promise.all(
    poolNames.map(async (poolName) => {
      try {
        const [base, quote] = parsePoolSymbols(poolName);
        const baseAddress = resolveAssetAddress(assets, base);
        const quoteAddress = resolveAssetAddress(assets, quote);
        const pools = await apiClient.getPoolsByAssetPair({
          asset0Address: toApiPairAddress(baseAddress),
          asset1Address: toApiPairAddress(quoteAddress),
        });

        if (!pools.length) return;

        const sorted = pools
          .filter((pool) => !pool.deprecated)
          .sort(
            (a, b) => Number(b.volume24HUsd ?? "0") - Number(a.volume24HUsd ?? "0")
          );
        const chosen = sorted[0] ?? pools[0];
        const apy =
          Number(chosen.apy30D ?? "0") ||
          Number(chosen.apy7D ?? "0") ||
          Number(chosen.apy1D ?? "0");

        if (Number.isFinite(apy) && apy > 0) {
          apyMap[poolName] = apy;
        }
      } catch {
        // Pool APY will remain unavailable in the UI if lookup fails.
      }
    })
  );

  return apyMap;
};

export const buildTonToJettonSwap = async ({
  targetSymbol,
  walletAddress,
  offerTonAmount,
  slippageTolerance = DEFAULT_SLIPPAGE,
  assets,
}: {
  targetSymbol: Exclude<PoolTokenSymbol, "TON">;
  walletAddress: string;
  offerTonAmount: number;
  slippageTolerance?: string;
  assets?: AssetInfo[];
}) => {
  const [{ toUnits, dexFactory }, tonClient] = await Promise.all([
    getSdk(),
    getTonClient(),
  ]);
  const resolvedAssets = assets ?? (await apiClient.getAssets());
  const askAddress = resolveAssetAddress(resolvedAssets, targetSymbol);
  const offerUnits = toUnits(offerTonAmount.toString(), 9).toString();

  const simulationResult = await apiClient.simulateSwap({
    offerAddress: "ton",
    askAddress,
    offerUnits,
    slippageTolerance,
  });

  const dexContracts = dexFactory(simulationResult.router);
  const router = tonClient.open(
    dexContracts.Router.create(simulationResult.router.address)
  );
  const proxyTon = dexContracts.pTON.create(
    simulationResult.router.ptonMasterAddress
  );

  const txParams = await router.getSwapTonToJettonTxParams({
    userWalletAddress: walletAddress,
    offerAmount: simulationResult.offerUnits,
    minAskAmount: simulationResult.minAskUnits,
    askJettonAddress: simulationResult.askAddress,
    proxyTon,
  });

  return {
    txParams,
    simulationResult,
    targetSymbol,
    offerTonAmount,
  };
};

export const buildOpenPositionTransaction = async ({
  poolName,
  walletAddress,
  depositUsd,
  slippageTolerance = DEFAULT_SLIPPAGE,
}: {
  poolName: SupportedPoolName;
  walletAddress: string;
  depositUsd: number;
  slippageTolerance?: string;
}) => {
  const [{ toUnits, dexFactory }, tonClient] = await Promise.all([
    getSdk(),
    getTonClient(),
  ]);
  if (!Number.isFinite(depositUsd) || depositUsd <= 0) {
    throw new Error("Deposit amount must be greater than 0.");
  }

  const assets = await apiClient.getAssets();
  const tonUsdPrice = getTonUsdPrice(assets);
  const offerTonAmount = usdToTonAmount(depositUsd, tonUsdPrice);
  const offerUnits = toUnits(offerTonAmount.toString(), 9).toString();
  const [base, quote] = parsePoolSymbols(poolName);

  const tokenAAddress = resolveAssetAddress(assets, base);
  const tokenBAddress = resolveAssetAddress(assets, quote);
  const poolContainsTon = isTonAddress(tokenAAddress) || isTonAddress(tokenBAddress);

  if (!poolContainsTon) {
    const targetSymbol = base as Exclude<PoolTokenSymbol, "TON">;
    const swapResult = await buildTonToJettonSwap({
      targetSymbol,
      walletAddress,
      offerTonAmount,
      slippageTolerance,
      assets,
    });

    return {
      mode: "swap" as const,
      ...swapResult,
      tonUsdPrice,
    };
  }

  const pools = await apiClient.getPoolsByAssetPair({
    asset0Address: toApiPairAddress(tokenAAddress),
    asset1Address: toApiPairAddress(tokenBAddress),
  });

  if (!pools.length) {
    throw new Error(`No active STON.fi pool was found for ${poolName}.`);
  }

  const chosenPool = pickBestPool(pools);
  const tonIsTokenA = isTonAddress(chosenPool.token0Address);

  const liquiditySimulation = await apiClient.simulateLiquidityProvision(
    (tonIsTokenA
      ? {
          provisionType: "Balanced",
          poolAddress: chosenPool.address,
          slippageTolerance,
          tokenA: tokenAAddress,
          tokenB: tokenBAddress,
          tokenAUnits: offerUnits,
        }
      : {
          provisionType: "Balanced",
          poolAddress: chosenPool.address,
          slippageTolerance,
          tokenA: tokenAAddress,
          tokenB: tokenBAddress,
          tokenBUnits: offerUnits,
        }) as Parameters<typeof apiClient.simulateLiquidityProvision>[0]
  );

  const dexContracts = dexFactory(liquiditySimulation.router);
  const router = tonClient.open(
    dexContracts.Router.create(liquiditySimulation.router.address)
  ) as {
    getSingleSideProvideLiquidityTonTxParams?: (params: {
      userWalletAddress: string;
      proxyTon: unknown;
      otherTokenAddress: string;
      sendAmount: string;
      minLpOut: string;
    }) => Promise<{
      to: { toString: () => string };
      value: bigint;
      body?: { toBoc: () => Buffer } | null;
    }>;
  };

  if (typeof router.getSingleSideProvideLiquidityTonTxParams !== "function") {
    const targetSymbol = (tonIsTokenA ? quote : base) as Exclude<PoolTokenSymbol, "TON">;
    const swapResult = await buildTonToJettonSwap({
      targetSymbol,
      walletAddress,
      offerTonAmount,
      slippageTolerance,
      assets,
    });

    return {
      mode: "swap" as const,
      ...swapResult,
      tonUsdPrice,
    };
  }

  const proxyTon = dexContracts.pTON.create(
    liquiditySimulation.router.ptonMasterAddress
  );
  const otherTokenAddress = tonIsTokenA
    ? chosenPool.token1Address
    : chosenPool.token0Address;

  const txParams = await router.getSingleSideProvideLiquidityTonTxParams({
    userWalletAddress: walletAddress,
    proxyTon,
    otherTokenAddress,
    sendAmount: offerUnits,
    minLpOut: liquiditySimulation.minLpUnits,
  });

  return {
    mode: "liquidity" as const,
    txParams,
    offerTonAmount,
    tonUsdPrice,
    poolAddress: chosenPool.address,
    liquiditySimulation,
  };
};

export const toTonConnectMessage = (txParams: {
  to: { toString: () => string };
  value: bigint;
  body?: { toBoc: () => Buffer } | null;
}) => ({
  address: txParams.to.toString(),
  amount: txParams.value.toString(),
  payload: txParams.body?.toBoc().toString("base64"),
});
