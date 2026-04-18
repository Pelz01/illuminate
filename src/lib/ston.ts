import { StonApiClient, type AssetInfo } from "@ston-fi/api";
import { Client, dexFactory, toUnits } from "@ston-fi/sdk";

export type SupportedPoolName =
  | "TON / USDT"
  | "TON / NOT"
  | "TON / STON"
  | "USDT / DOGS";

type PoolTokenSymbol = "TON" | "USDT" | "NOT" | "STON" | "DOGS";

const TONCENTER_MAINNET = "https://toncenter.com/api/v2/jsonRPC";
const DEFAULT_SLIPPAGE = "0.01";

const apiClient = new StonApiClient();
const tonClient = new Client({
  endpoint: TONCENTER_MAINNET,
});

const symbolAliases: Record<PoolTokenSymbol, string[]> = {
  TON: ["TON"],
  USDT: ["USDT", "jUSDT"],
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

  return (
    assets.find((asset) => aliases.includes(asset.symbol)) ??
    assets.find((asset) =>
      aliases.some((alias) =>
        asset.displayName?.toUpperCase().includes(alias.toUpperCase())
      )
    ) ??
    null
  );
};

const resolveAssetAddress = (assets: AssetInfo[], symbol: PoolTokenSymbol) => {
  if (symbol === "TON") return "ton";

  const asset = findAssetBySymbol(assets, symbol);
  if (!asset) {
    throw new Error(`Unable to resolve STON asset for token "${symbol}".`);
  }

  return asset.contractAddress;
};

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
        const pools = await apiClient.getPoolsByAssetPair({
          asset0Address: resolveAssetAddress(assets, base),
          asset1Address: resolveAssetAddress(assets, quote),
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
  const poolContainsTon = tokenAAddress === "ton" || tokenBAddress === "ton";

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
    asset0Address: tokenAAddress,
    asset1Address: tokenBAddress,
  });

  if (!pools.length) {
    throw new Error(`No active STON.fi pool was found for ${poolName}.`);
  }

  const chosenPool = pickBestPool(pools);
  const tonIsTokenA = chosenPool.token0Address === "ton";

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
