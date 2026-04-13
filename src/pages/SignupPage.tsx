import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FcGoogle } from 'react-icons/fc';
import AnimatedBackground from '../components/AnimatedBackground';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) { return setError('Password must be at least 6 characters'); }
    setLoading(true);
    try {
      await signup(email, password, name);
      navigate('/');
    } catch (err: any) {
      setError(err.message.replace('Firebase: ', '').replace(/\(auth\/.*\)/, ''));
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setError('');
    try { await loginWithGoogle(); navigate('/'); }
    catch (err: any) { setError(err.message.replace('Firebase: ', '').replace(/\(auth\/.*\)/, '')); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      <AnimatedBackground />

      <div className="flex flex-col items-center w-full max-w-[440px] animate-[fadeIn_0.8s_ease_forwards]">
        <div className="glass-static w-full px-9 pt-11 pb-9 relative overflow-hidden rounded-2xl shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset,0_20px_80px_rgba(0,0,0,0.6),0_0_120px_rgba(201,168,76,0.03)]">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent opacity-50" />

          <div className="text-center mb-1">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-dark)] rounded-xl font-extrabold text-sm font-[var(--font-serif)] mb-4 shadow-[0_4px_24px_rgba(201,168,76,0.25)] text-[var(--color-emerald-deep)]">
              EM
            </div>
            <h1 className="font-[var(--font-serif)] text-2xl font-bold text-[var(--color-cream)] tracking-tight">
              IBM Event Manager
            </h1>
          </div>
          <p className="text-center text-sm text-[var(--color-cream-faint)] mb-8">
            Create your account to get started
          </p>

          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)] text-red-400 py-3 px-4 rounded-xl text-sm text-center">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="form-label" htmlFor="signup-name">Full Name</label>
              <input id="signup-name" className="glass-input" type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="form-label" htmlFor="signup-email">Email</label>
              <input id="signup-email" className="glass-input" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="form-label" htmlFor="signup-password">Password</label>
              <input id="signup-password" className="glass-input" type="password" placeholder="Min. 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" />
            </div>

            <button className="glass-button glass-button-primary w-full mt-2 py-3.5" type="submit" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="flex items-center gap-4 my-6 text-[var(--color-cream-faint)] text-xs uppercase tracking-widest">
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span>or</span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          <button className="glass-button glass-button-google w-full py-3.5" onClick={handleGoogle} type="button">
            <FcGoogle size={20} /> Continue with Google
          </button>

          <p className="text-center mt-7 text-sm text-[var(--color-cream-faint)]">
            Already have an account? <Link to="/login" className="font-semibold text-[var(--color-gold)]">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
