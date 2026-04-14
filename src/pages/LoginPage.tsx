import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FcGoogle } from 'react-icons/fc';
import AnimatedBackground from '../components/AnimatedBackground';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle, loginAsDemo } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err?.message?.replace('Firebase: ', '').replace(/\(auth\/.*\)/, '') || 'Sign in failed');
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setError('');
    try { await loginWithGoogle(); navigate('/'); }
    catch (err: any) { setError(err?.message?.replace('Firebase: ', '').replace(/\(auth\/.*\)/, '') || 'Google sign in failed'); }
  };

  const handleDemo = () => { loginAsDemo(); navigate('/'); };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 relative">
      <AnimatedBackground />

      <div className="flex flex-col items-center w-full max-w-[440px] animate-[fadeIn_0.8s_ease_forwards]">
        <div className="glass-static w-full px-10 pt-14 pb-12 relative overflow-hidden rounded-2xl shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset,0_24px_80px_rgba(0,0,0,0.55),0_0_120px_rgba(61,214,200,0.03)]">
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent opacity-50" />

          {/* Brand */}
          <div className="text-center mb-3">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-violet)] rounded-2xl font-extrabold text-base font-[var(--font-serif)] mb-6 shadow-[0_6px_28px_rgba(61,214,200,0.2)] text-[#06091a]">
              EM
            </div>
            <h1 className="font-[var(--font-serif)] text-[1.6rem] font-bold text-[var(--color-text-primary)] tracking-tight">
              IBM Event Manager
            </h1>
          </div>
          <p className="text-center text-sm text-[var(--color-text-tertiary)] mb-10">
            Sign in to your account
          </p>

          <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-[var(--color-danger-bg)] border border-[var(--color-danger-border)] text-red-400 py-3 px-4 rounded-xl text-sm text-center">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-2.5">
              <label className="form-label" htmlFor="login-email">Email</label>
              <input id="login-email" className="glass-input" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
            </div>

            <div className="flex flex-col gap-2.5">
              <label className="form-label" htmlFor="login-password">Password</label>
              <input id="login-password" className="glass-input" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
            </div>

            <button className="glass-button glass-button-primary w-full mt-2 py-4" type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8 text-[var(--color-text-tertiary)] text-xs uppercase tracking-widest">
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span>or</span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          <div className="flex flex-col gap-3">
            <button className="glass-button glass-button-google w-full py-4" onClick={handleGoogle} type="button">
              <FcGoogle size={20} /> Continue with Google
            </button>
            <button className="glass-button glass-button-secondary w-full py-4" onClick={handleDemo} type="button">
              🚀 Try Demo
            </button>
          </div>

          <p className="text-center mt-10 text-sm text-[var(--color-text-tertiary)]">
            Don't have an account? <Link to="/signup" className="font-semibold text-[var(--color-accent-light)]">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
