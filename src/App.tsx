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

// Admin pages
import AdminOverview from "./pages/admin/AdminOverview";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminClothes from "./pages/admin/AdminClothes";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminAlgorithm from "./pages/admin/AdminAlgorithm";
import AdminPerformance from "./pages/admin/AdminPerformance";

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
          <Route path="/upload" element={<UploadClothes />} />
          <Route path="/outfits" element={<OutfitGenerator />} />
          <Route path="/saved" element={<SavedOutfitsPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          {/* Admin routes */}
          <Route path="/admin" element={<AdminOverview />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/clothes" element={<AdminClothes />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/algorithm" element={<AdminAlgorithm />} />
          <Route path="/admin/performance" element={<AdminPerformance />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
