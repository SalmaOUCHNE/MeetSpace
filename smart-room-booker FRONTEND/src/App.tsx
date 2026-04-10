import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppLayout from "@/components/AppLayout";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import Rooms from "@/pages/Rooms";
import Reserve from "@/pages/Reserve";
import MyReservations from "@/pages/MyReservations";
import AvailableRooms from "@/pages/AvailableRooms";
import AdminRooms from "@/pages/AdminRooms";
import RoomDetails from "@/pages/RoomDetails";
import NotFound from "@/pages/NotFound";
import AdminReservations from "@/pages/AdminReservations";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/rooms" element={<Rooms />} />
              <Route path="/rooms/:id" element={<RoomDetails />} />
              <Route path="/reserve" element={<Reserve />} />
              <Route path="/my-reservations" element={<MyReservations />} />
              <Route path="/available-rooms" element={<AvailableRooms />} />
              <Route path="/admin/rooms" element={<ProtectedRoute adminOnly><AdminRooms /></ProtectedRoute>} />
              <Route
  path="/admin/reservations"
  element={
    <ProtectedRoute adminOnly>
      <AdminReservations />
    </ProtectedRoute>
  }
/>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
