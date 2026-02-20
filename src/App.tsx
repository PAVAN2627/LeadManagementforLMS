import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { LoadingScreen } from "@/components/LoadingScreen";
import Index from "./pages/Index";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Benefits from "./pages/Benefits";
import Features from "./pages/Features";
import Roles from "./pages/Roles";
import Lifecycle from "./pages/Lifecycle";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLeads from "./pages/admin/AdminLeads";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminReports from "./pages/admin/AdminReports";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminProfile from "./pages/admin/AdminProfile";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import ManagerTeam from "./pages/manager/ManagerTeam";
import ManagerReports from "./pages/manager/ManagerReports";
import ManagerLeads from "./pages/manager/ManagerLeads";
import ManagerSettings from "./pages/manager/ManagerSettings";
import ManagerProfile from "./pages/manager/ManagerProfile";
import AgentDashboard from "./pages/agent/AgentDashboard";
import MyLeads from "./pages/agent/MyLeads";
import AddLeadPage from "./pages/agent/AddLeadPage";
import Settings from "./pages/agent/Settings";
import AgentProfile from "./pages/agent/AgentProfile";
import NotFound from "./pages/NotFound";

import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => {
  const [showLoading, setShowLoading] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          {showLoading && <LoadingScreen onLoadingComplete={() => setShowLoading(false)} />}
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/home" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/benefits" element={<Benefits />} />
              <Route path="/features" element={<Features />} />
              <Route path="/roles" element={<Roles />} />
              <Route path="/lifecycle" element={<Lifecycle />} />

              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/leads" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminLeads />
                </ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminUsers />
                </ProtectedRoute>
              } />
              <Route path="/admin/reports" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminReports />
                </ProtectedRoute>
              } />
              <Route path="/admin/profile" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminProfile />
                </ProtectedRoute>
              } />
              <Route path="/admin/settings" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminSettings />
                </ProtectedRoute>
              } />

              {/* Manager Routes */}
              <Route path="/manager" element={
                <ProtectedRoute allowedRoles={['manager']}>
                  <ManagerDashboard />
                </ProtectedRoute>
              } />
              <Route path="/manager/leads" element={
                <ProtectedRoute allowedRoles={['manager']}>
                  <ManagerLeads />
                </ProtectedRoute>
              } />
              <Route path="/manager/team" element={
                <ProtectedRoute allowedRoles={['manager']}>
                  <ManagerTeam />
                </ProtectedRoute>
              } />
              <Route path="/manager/reports" element={
                <ProtectedRoute allowedRoles={['manager']}>
                  <ManagerReports />
                </ProtectedRoute>
              } />
              <Route path="/manager/profile" element={
                <ProtectedRoute allowedRoles={['manager']}>
                  <ManagerProfile />
                </ProtectedRoute>
              } />
              <Route path="/manager/settings" element={
                <ProtectedRoute allowedRoles={['manager']}>
                  <ManagerSettings />
                </ProtectedRoute>
              } />

              {/* Agent Routes */}
              <Route path="/agent" element={
                <ProtectedRoute allowedRoles={['agent']}>
                  <AgentDashboard />
                </ProtectedRoute>
              } />
              <Route path="/agent/leads" element={
                <ProtectedRoute allowedRoles={['agent']}>
                  <MyLeads />
                </ProtectedRoute>
              } />
              <Route path="/agent/add-lead" element={
                <ProtectedRoute allowedRoles={['agent']}>
                  <AddLeadPage />
                </ProtectedRoute>
              } />
              <Route path="/agent/profile" element={
                <ProtectedRoute allowedRoles={['agent']}>
                  <AgentProfile />
                </ProtectedRoute>
              } />
              <Route path="/agent/settings" element={
                <ProtectedRoute allowedRoles={['agent']}>
                  <Settings />
                </ProtectedRoute>
              } />
              <Route path="/agent/*" element={
                <ProtectedRoute allowedRoles={['agent']}>
                  <AgentDashboard />
                </ProtectedRoute>
              } />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
