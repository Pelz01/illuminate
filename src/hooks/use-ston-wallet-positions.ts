import { useQuery } from "@tanstack/react-query";
import {
  OperationType,
  StonApiClient,
  type AssetInfo,
  type PoolInfo,
} from "@ston-fi/api";

const apiClient = new StonApiClient();
const OPERATION_LOOKBACK_DAYS = 180;
const OPERATION_LOOKBACK_MS = OPERATION_LOOKBACK_DAYS * 24 * 60 * 60 * 1000;
const MAX_POSITIONS_RETURNED = 200;

type WalletPool = PoolInfo;

const normalizeAddress = (value?: string) => (value ?? "").trim().toLowerCase();

const safeNumber = (value?: string) => {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const toDisplayUnits = (value: string, decimals?: number) => {
  const parsed = safeNumber(value);
  if (parsed === null) return null;
  if (decimals === undefined) return parsed;
  return parsed / 10 ** decimals;
};

const getAssetPriceUsd = (asset?: AssetInfo) =>
  safeNumber(asset?.dexPriceUsd) ?? safeNumber(asset?.thirdPartyPriceUsd);

const formatSymbol = (address: string, assetsByAddress: Map<string, AssetInfo>) => {
  const normalized = normalizeAddress(address);
  if (normalized === "ton") return "TON";
  return assetsByAddress.get(normalized)?.symbol ?? `${address.slice(0, 4)}...`;
};

const computePositionValueUsd = (pool: WalletPool) => {
  const lpBalance = safeNumber(pool.lpBalance);
  const lpTotalSupply = safeNumber(pool.lpTotalSupply);
  const lpTotalSupplyUsd = safeNumber(pool.lpTotalSupplyUsd);

  if (lpBalance === null || lpTotalSupply === null || lpTotalSupplyUsd === null) {
    return null;
  }
  if (lpTotalSupply <= 0) {
    return null;
  }

  return (lpBalance / lpTotalSupply) * lpTotalSupplyUsd;
};

const hasActiveLpBalance = (pool: WalletPool) => {
  const lpBalance = safeNumber(pool.lpBalance);
  return lpBalance !== null && lpBalance > 0;
};

type PoolTokenFlow = {
  token0: number;
  token1: number;
};

const isLiquiditySettlementOp = (rawType: string) => {
  const type = rawType.toLowerCase();
  return type === "add_liquidity" || type === "withdraw_liquidity";
};

export type WalletPosition = {
  poolAddress: string;
  pair: string;
  token0Symbol: string;
  token1Symbol: string;
  apyPct: number | null;
  valueUsd: number | null;
  holdValueUsd: number | null;
  netVsHoldUsd: number | null;
  attributionOpsCount: number;
  deprecated: boolean;
};

export const useStonWalletPositions = (walletAddress?: string) => {
  return useQuery({
    queryKey: ["ston-wallet-positions", walletAddress],
    enabled: Boolean(walletAddress),
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const [assets, walletPools] = await Promise.all([
        apiClient.getAssets(),
        apiClient.getWalletPools({
          walletAddress: walletAddress!,
          dexV2: true,
        }),
      ]);

      const activeWalletPools = walletPools.filter(hasActiveLpBalance);
      if (activeWalletPools.length === 0) {
        return [];
      }

      const activePoolKeys = new Set(
        activeWalletPools.map((pool) => normalizeAddress(pool.address))
      );
      const until = new Date();
      const since = new Date(until.getTime() - OPERATION_LOOKBACK_MS);

      const [addLiquidityOps, withdrawLiquidityOps] = await Promise.all([
        apiClient.getWalletOperations({
          walletAddress: walletAddress!,
          since,
          until,
          dexV2: true,
          opType: OperationType.AddLiquidity,
        }),
        apiClient.getWalletOperations({
          walletAddress: walletAddress!,
          since,
          until,
          dexV2: true,
          opType: OperationType.WithdrawLiquidity,
        }),
      ]);
      const walletOperations = [...addLiquidityOps, ...withdrawLiquidityOps];

      const assetsByAddress = new Map<string, AssetInfo>();
      for (const asset of assets) {
        assetsByAddress.set(normalizeAddress(asset.contractAddress), asset);
      }

      const tonAsset =
        assets.find((asset) => asset.symbol.toUpperCase() === "TON") ?? null;
      const operationsByPool = new Map<string, PoolTokenFlow>();
      const opCountByPool = new Map<string, number>();

      for (const item of walletOperations) {
        const op = item.operation;
        if (!op.success || !isLiquiditySettlementOp(op.operationType)) continue;

        const poolKey = normalizeAddress(op.poolAddress);
        if (!poolKey) continue;
        if (!activePoolKeys.has(poolKey)) continue;
        const currentFlow = operationsByPool.get(poolKey) ?? { token0: 0, token1: 0 };
        const token0Amount = toDisplayUnits(
          op.asset0Amount,
          item.asset0Info?.decimals
        );
        const token1Amount = toDisplayUnits(
          op.asset1Amount,
          item.asset1Info?.decimals
        );

        operationsByPool.set(poolKey, {
          token0: currentFlow.token0 + (token0Amount ?? 0),
          token1: currentFlow.token1 + (token1Amount ?? 0),
        });
        opCountByPool.set(poolKey, (opCountByPool.get(poolKey) ?? 0) + 1);
      }

      const positions: WalletPosition[] = activeWalletPools.map((pool) => {
        const token0Symbol = formatSymbol(pool.token0Address, assetsByAddress);
        const token1Symbol = formatSymbol(pool.token1Address, assetsByAddress);
        const pair = `${token0Symbol} / ${token1Symbol}`;
        const apyPct =
          safeNumber(pool.apy30D) ??
          safeNumber(pool.apy7D) ??
          safeNumber(pool.apy1D);
        const valueUsd = computePositionValueUsd(pool);

        const poolKey = normalizeAddress(pool.address);
        const flow = operationsByPool.get(poolKey);
        const token0Asset =
          normalizeAddress(pool.token0Address) === "ton"
            ? tonAsset ?? undefined
            : assetsByAddress.get(normalizeAddress(pool.token0Address));
        const token1Asset =
          normalizeAddress(pool.token1Address) === "ton"
            ? tonAsset ?? undefined
            : assetsByAddress.get(normalizeAddress(pool.token1Address));
        const token0PriceUsd = getAssetPriceUsd(token0Asset);
        const token1PriceUsd = getAssetPriceUsd(token1Asset);
        const token0BalanceUnits =
          pool.token0Balance !== undefined
            ? toDisplayUnits(pool.token0Balance, token0Asset?.decimals)
            : null;
        const token1BalanceUnits =
          pool.token1Balance !== undefined
            ? toDisplayUnits(pool.token1Balance, token1Asset?.decimals)
            : null;
        const valueFromTokenBalancesUsd =
          token0PriceUsd !== null &&
          token1PriceUsd !== null &&
          (token0BalanceUnits !== null || token1BalanceUnits !== null)
            ? (token0BalanceUnits ?? 0) * token0PriceUsd +
              (token1BalanceUnits ?? 0) * token1PriceUsd
            : null;
        const effectiveValueUsd = valueUsd ?? valueFromTokenBalancesUsd;

        const holdValueUsd =
          flow &&
          token0PriceUsd !== null &&
          token1PriceUsd !== null
            ? flow.token0 * token0PriceUsd + flow.token1 * token1PriceUsd
            : null;
        const netVsHoldUsd =
          effectiveValueUsd !== null && holdValueUsd !== null
            ? effectiveValueUsd - holdValueUsd
            : null;

        return {
          poolAddress: pool.address,
          pair,
          token0Symbol,
          token1Symbol,
          apyPct,
          valueUsd: effectiveValueUsd,
          holdValueUsd,
          netVsHoldUsd,
          attributionOpsCount: opCountByPool.get(poolKey) ?? 0,
          deprecated: pool.deprecated,
        };
      });

      const rankedPositions = [...positions].sort((a, b) => {
        const aSort = a.valueUsd ?? a.holdValueUsd ?? -1;
        const bSort = b.valueUsd ?? b.holdValueUsd ?? -1;
        return bSort - aSort;
      });

      return rankedPositions.slice(0, MAX_POSITIONS_RETURNED);
    },
  });
};
