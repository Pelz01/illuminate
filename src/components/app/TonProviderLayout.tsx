import { Outlet } from "react-router-dom";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { getTonConnectManifestUrl } from "@/lib/tonconnect";

const TonProviderLayout = () => {
  return (
    <TonConnectUIProvider manifestUrl={getTonConnectManifestUrl()}>
      <Outlet />
    </TonConnectUIProvider>
  );
};

export default TonProviderLayout;
