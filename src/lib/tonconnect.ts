const FALLBACK_MANIFEST_URL =
  "https://ton-connect.github.io/demo-dapp-with-react-ui/tonconnect-manifest.json";

export const getTonConnectManifestUrl = () => {
  const overrideUrl = import.meta.env.VITE_TON_CONNECT_MANIFEST_URL as
    | string
    | undefined;

  if (overrideUrl) {
    return overrideUrl;
  }

  if (window.location.protocol === "https:") {
    return `${window.location.origin}/tonconnect-manifest.json`;
  }

  // Local HTTP development frequently fails wallet-side manifest validation.
  return FALLBACK_MANIFEST_URL;
};

export const shortenAddress = (address?: string, left = 6, right = 6) => {
  if (!address) return "";
  if (address.length <= left + right) return address;
  return `${address.slice(0, left)}...${address.slice(-right)}`;
};
