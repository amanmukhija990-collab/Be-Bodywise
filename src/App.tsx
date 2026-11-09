import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { MatchPage } from './pages/MatchPage';
import { RoutineTestPage } from './pages/RoutineTestPage';
import { ShelfPage } from './pages/ShelfPage';
import { DecoderPage } from './pages/DecoderPage';
import { JourneyPage } from './pages/JourneyPage';

// Protected Route wrapper that redirects unauthenticated users to /login
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoggedIn } = useApp();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// Layout wrapper conditionally hiding Navbar/Footer on Auth pages
const AppLayout: React.FC = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F0] text-[#172319] selection:bg-[#E29D52]/30 selection:text-[#172319]">
      {!isAuthPage && <Navbar />}
      <main className="flex-1 flex flex-col">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/signup" element={<AuthPage />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/match"
            element={
              <ProtectedRoute>
                <MatchPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/routine-test"
            element={
              <ProtectedRoute>
                <RoutineTestPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/shelf"
            element={
              <ProtectedRoute>
                <ShelfPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/decoder"
            element={
              <ProtectedRoute>
                <DecoderPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/journey"
            element={
              <ProtectedRoute>
                <JourneyPage />
              </ProtectedRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isAuthPage && <Footer />}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </AppProvider>
  );
}
