import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import LoginPage from "@/pages/login";
import RegisterPage from "@/pages/register";
import UserListingPage from "@/pages/user";
import MusicListingPage from "@/pages/music";
import ArtistListingPage from "@/pages/artist";
import { Toaster } from "@/components/ui/toaster";
import AuthorizeRoute from "./components/AuthorizeRoute";
import Homepage from "./pages";

export const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/users" element={<AuthorizeRoute><UserListingPage /></AuthorizeRoute>} />
              <Route path="/music" element={<AuthorizeRoute><MusicListingPage /></AuthorizeRoute>} />
              <Route path="/artists" element={<AuthorizeRoute><ArtistListingPage /></AuthorizeRoute>} />
              <Route path="/artists/:id" element={<AuthorizeRoute><MusicListingPage /></AuthorizeRoute>} />

              <Route path="/" element={<Homepage />} />
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
