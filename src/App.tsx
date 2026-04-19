import { Suspense, lazy } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

const Index = lazy(() => import("./pages/Index.tsx"));
const FeaturesPage = lazy(() => import("./pages/FeaturesPage.tsx"));
const SimulatorPage = lazy(() => import("./pages/SimulatorPage.tsx"));
const HowItWorksPage = lazy(() => import("./pages/HowItWorksPage.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const DashboardPage = lazy(() => import("./pages/app/DashboardPage.tsx"));
const PositionsPage = lazy(() => import("./pages/app/PositionsPage.tsx"));
const AlertsPage = lazy(() => import("./pages/app/AlertsPage.tsx"));
const RebalancePage = lazy(() => import("./pages/app/RebalancePage.tsx"));
const SettingsPage = lazy(() => import("./pages/app/SettingsPage.tsx"));
const AppSimulatorPage = lazy(() => import("./pages/app/AppSimulatorPage.tsx"));
const TonProviderLayout = lazy(
  () => import("./components/app/TonProviderLayout.tsx")
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      gcTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense
          fallback={
            <div className="min-h-screen bg-background" aria-hidden="true" />
          }
        >
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/simulator" element={<SimulatorPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route element={<TonProviderLayout />}>
              <Route path="/app" element={<DashboardPage />} />
              <Route path="/app/positions" element={<PositionsPage />} />
              <Route path="/app/alerts" element={<AlertsPage />} />
              <Route path="/app/rebalance" element={<RebalancePage />} />
              <Route path="/app/simulator" element={<AppSimulatorPage />} />
              <Route path="/app/settings" element={<SettingsPage />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
