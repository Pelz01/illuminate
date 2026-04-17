import { useQuery } from "@tanstack/react-query";
import { StonApiClient, type AssetInfo, type PoolInfo } from "@ston-fi/api";

const apiClient = new StonApiClient();

type WalletPool = PoolInfo;

const normalizeAddress = (value?: string) => (value ?? "").trim().toLowerCase();

const safeNumber = (value?: string) => {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

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

export type WalletPosition = {
  poolAddress: string;
  pair: string;
  token0Symbol: string;
  token1Symbol: string;
  apyPct: number | null;
  valueUsd: number | null;
  deprecated: boolean;
};

export const useStonWalletPositions = (walletAddress?: string) => {
  return useQuery({
    queryKey: ["ston-wallet-positions", walletAddress],
    enabled: Boolean(walletAddress),
    queryFn: async () => {
      const [assets, walletPools] = await Promise.all([
        apiClient.getAssets(),
        apiClient.getWalletPools({
          walletAddress: walletAddress!,
          dexV2: true,
        }),
      ]);

      const assetsByAddress = new Map<string, AssetInfo>();
      for (const asset of assets) {
        assetsByAddress.set(normalizeAddress(asset.contractAddress), asset);
      }

      const positions: WalletPosition[] = walletPools.map((pool) => {
        const token0Symbol = formatSymbol(pool.token0Address, assetsByAddress);
        const token1Symbol = formatSymbol(pool.token1Address, assetsByAddress);
        const pair = `${token0Symbol} / ${token1Symbol}`;
        const apyPct =
          safeNumber(pool.apy30D) ??
          safeNumber(pool.apy7D) ??
          safeNumber(pool.apy1D);

        return {
          poolAddress: pool.address,
          pair,
          token0Symbol,
          token1Symbol,
          apyPct,
          valueUsd: computePositionValueUsd(pool),
          deprecated: pool.deprecated,
        };
      });

      return positions;
    },
  });
};
