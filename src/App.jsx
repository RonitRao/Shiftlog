import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import Dashboard from "@/pages/Dashboard";
import LogsPage from "@/pages/LogsPage";
import AiScannerPage from "@/pages/AiScannerPage";
import ProfilePage from "@/pages/ProfilePage";

// Protected Route Wrapper to satisfy requirements
const ProtectedRoute = ({ children, session }) => {
  return session ? children : <Navigate to="/login" />;
};

function App() {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage session={session} />} />
        <Route path="/login" element={<LoginPage />} /> 
        <Route path="/signup" element={<LoginPage />} />  
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute session={session}>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/logs" element={
          <ProtectedRoute session={session}>
            <LogsPage />
          </ProtectedRoute>
        } />
        <Route path="/scanner" element={
          <ProtectedRoute session={session}>
            <AiScannerPage />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={<ProtectedRoute session={session}><ProfilePage /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;