import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getTonConnectManifestUrl } from "@/lib/tonconnect";
import Index from "./pages/Index.tsx";
import FeaturesPage from "./pages/FeaturesPage.tsx";
import SimulatorPage from "./pages/SimulatorPage.tsx";
import HowItWorksPage from "./pages/HowItWorksPage.tsx";
import NotFound from "./pages/NotFound.tsx";
import DashboardPage from "./pages/app/DashboardPage.tsx";
import PositionsPage from "./pages/app/PositionsPage.tsx";
import AlertsPage from "./pages/app/AlertsPage.tsx";
import RebalancePage from "./pages/app/RebalancePage.tsx";
import SettingsPage from "./pages/app/SettingsPage.tsx";
import AppSimulatorPage from "./pages/app/AppSimulatorPage.tsx";

const queryClient = new QueryClient();

const App = () => (
  <TonConnectUIProvider manifestUrl={getTonConnectManifestUrl()}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/simulator" element={<SimulatorPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/app" element={<DashboardPage />} />
            <Route path="/app/positions" element={<PositionsPage />} />
            <Route path="/app/alerts" element={<AlertsPage />} />
            <Route path="/app/rebalance" element={<RebalancePage />} />
            <Route path="/app/simulator" element={<AppSimulatorPage />} />
            <Route path="/app/settings" element={<SettingsPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </TonConnectUIProvider>
);

export default App;
