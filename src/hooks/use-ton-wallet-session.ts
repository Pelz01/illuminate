import {
  useTonAddress,
  useTonConnectUI,
  useTonWallet,
} from "@tonconnect/ui-react";
import { useMemo } from "react";
import { shortenAddress } from "@/lib/tonconnect";

export const useTonWalletSession = () => {
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();
  const address = useTonAddress();
  const rawAddress = useTonAddress(false);
  const connected = Boolean(wallet && address);

  const shortAddress = useMemo(
    () => shortenAddress(address || rawAddress),
    [address, rawAddress]
  );

  const connect = () => tonConnectUI.openModal();
  const disconnect = () => tonConnectUI.disconnect();

  return {
    wallet,
    address,
    rawAddress,
    shortAddress,
    connected,
    tonConnectUI,
    connect,
    disconnect,
  };
};
