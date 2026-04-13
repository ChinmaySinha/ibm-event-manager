import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AnimatedBackground from './AnimatedBackground';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6">
        <AnimatedBackground />
        <div className="glass-static p-10 rounded-2xl flex flex-col items-center gap-5">
          <div className="spinner" />
          <p className="text-[var(--color-cream-faint)] font-[var(--font-serif)] text-sm">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
