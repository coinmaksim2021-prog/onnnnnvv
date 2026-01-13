import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";

// Pages
import ArkhamHome from "./pages/ArkhamHome";
import TokensPage from "./pages/TokensPage";
import TokenDetail from "./pages/TokenDetail";
import WalletsPage from "./pages/WalletsPage";
import Portfolio from "./pages/Portfolio";
import EntitiesPage from "./pages/EntitiesPage";
import EntityDetail from "./pages/EntityDetail";
import Watchlist from "./pages/Watchlist";
import AlertsPage from "./pages/AlertsPage";
import AddressDetail from "./pages/AddressDetail";
import StrategiesPage from "./pages/StrategiesPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main Navigation */}
        <Route path="/" element={<ArkhamHome />} />
        <Route path="/tokens" element={<TokensPage />} />
        <Route path="/wallets" element={<WalletsPage />} />
        <Route path="/entities" element={<EntitiesPage />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/alerts" element={<AlertsPage />} />
        <Route path="/strategies" element={<StrategiesPage />} />
        
        {/* Detail Pages */}
        <Route path="/token/:tokenId" element={<TokenDetail />} />
        <Route path="/portfolio/:address" element={<Portfolio />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/entity/:entityId" element={<EntityDetail />} />
        <Route path="/address/:address" element={<AddressDetail />} />
        
        {/* Fallback */}
        <Route path="/*" element={<ArkhamHome />} />
      </Routes>
      <Toaster position="top-right" />
    </BrowserRouter>
  );
}

export default App;
