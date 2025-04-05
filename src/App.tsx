
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LocationProvider from "@/components/LocationProvider";
import Welcome from "./pages/Welcome";
import Permissions from "./pages/Permissions";
import Survey from "./pages/Survey";
import GenerateID from "./pages/GenerateID";
import Dashboard from "./pages/Dashboard";
import Capture from "./pages/Capture";
import Profile from "./pages/Profile";
import WeatherDetails from "./pages/WeatherDetails";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import PlaceMapView from "./pages/PlaceMapView";
import PlacesList from "./pages/PlacesList";
import MusicLibrary from "./pages/MusicLibrary";
import MapSearch from "./pages/MapSearch";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LocationProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/permissions" element={<Permissions />} />
          <Route path="/survey" element={<Survey />} />
          <Route path="/generate-id" element={<GenerateID />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/capture" element={<Capture />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/weather-details" element={<WeatherDetails />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/places-list" element={<PlacesList />} />
          <Route path="/place-map-view" element={<PlaceMapView />} />
          <Route path="/music-library" element={<MusicLibrary />} />
          <Route path="/map-search" element={<MapSearch />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      </LocationProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
