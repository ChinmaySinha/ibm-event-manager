import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import CreateEventPage from './pages/CreateEventPage';
import EventDetailPage from './pages/EventDetailPage';
import AnimatedBackground from './components/AnimatedBackground';

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6">
        <AnimatedBackground />
        <div className="glass-static p-10 rounded-2xl flex flex-col items-center gap-5">
          <div className="spinner" />
          <p className="text-[var(--color-cream-faint)] font-[var(--font-serif)] text-sm">
            IBM Event Manager
          </p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/signup" element={user ? <Navigate to="/" replace /> : <SignupPage />} />
      <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/create" element={<ProtectedRoute><CreateEventPage /></ProtectedRoute>} />
      <Route path="/event/:id" element={<ProtectedRoute><EventDetailPage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}
