import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Landing from "./pages/Landing";
import Wardrobe from "./pages/Wardrobe";
import UploadClothes from "./pages/UploadClothes";
import OutfitGenerator from "./pages/OutfitGenerator";
import SavedOutfitsPage from "./pages/SavedOutfits";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Feed from "./pages/Feed";
import Planner from "./pages/Planner";
import Sustainability from "./pages/Sustainability";
import WardrobeGaps from "./pages/WardrobeGaps";
import Settings from "./pages/Settings";
import Help from "./pages/Help";
import ClothingDetail from "./pages/ClothingDetail";
import FavoriteOutfits from "./pages/FavoriteOutfits";
import OutfitHistory from "./pages/OutfitHistory";
import PackingAssistant from "./pages/PackingAssistant";

// Admin pages
import AdminOverview from "./pages/admin/AdminOverview";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminClothes from "./pages/admin/AdminClothes";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminAlgorithm from "./pages/admin/AdminAlgorithm";
import AdminPerformance from "./pages/admin/AdminPerformance";
import AdminResearch from "./pages/admin/AdminResearch";
import AdminThesis from "./pages/admin/AdminThesis";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/wardrobe" element={<Wardrobe />} />
          <Route path="/wardrobe/:id" element={<ClothingDetail />} />
          <Route path="/favorites" element={<FavoriteOutfits />} />
          <Route path="/history" element={<OutfitHistory />} />
          <Route path="/packing" element={<PackingAssistant />} />
          <Route path="/upload" element={<UploadClothes />} />
          <Route path="/outfits" element={<OutfitGenerator />} />
          <Route path="/saved" element={<SavedOutfitsPage />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/sustainability" element={<Sustainability />} />
          <Route path="/gaps" element={<WardrobeGaps />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/help" element={<Help />} />
          <Route path="/login" element={<Login />} />
          {/* Admin routes */}
          <Route path="/admin" element={<AdminOverview />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/clothes" element={<AdminClothes />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/algorithm" element={<AdminAlgorithm />} />
          <Route path="/admin/performance" element={<AdminPerformance />} />
          <Route path="/admin/research" element={<AdminResearch />} />
          <Route path="/admin/thesis" element={<AdminThesis />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
