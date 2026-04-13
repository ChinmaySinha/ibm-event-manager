import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FcGoogle } from 'react-icons/fc';
import '../styles/Login.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle, loginAsDemo } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err?.message?.replace('Firebase: ', '').replace(/\(auth\/.*\)/, '') || 'Sign in failed');
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setError('');
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (err) {
      setError(err?.message?.replace('Firebase: ', '').replace(/\(auth\/.*\)/, '') || 'Google sign in failed');
    }
  };

  const handleDemo = () => {
    loginAsDemo();
    navigate('/');
  };

  return (
    <div className="login-page">
      {/* Background layers */}
      <div className="app-background" />
      <div className="ambient-orb ambient-orb--purple" />
      <div className="ambient-orb ambient-orb--blue" />
      <div className="ambient-orb ambient-orb--pink" />

      <div className="login-container">
        <div className="login-card">
          <div className="login-card__brand">
            <div className="login-card__brand-icon">EM</div>
            <h1>IBM Event Manager</h1>
          </div>
          <p className="login-card__subtitle">Sign in to your account</p>

          <form className="login-form" onSubmit={handleSubmit}>
            {error && <div className="login-error">{error}</div>}

            <div className="form-group">
              <label className="form-label" htmlFor="login-email">Email</label>
              <input
                id="login-email"
                className="form-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="login-password">Password</label>
              <input
                id="login-password"
                className="form-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="login-divider">or</div>

          <button className="btn btn-google" onClick={handleGoogle} type="button">
            <FcGoogle size={20} />
            Continue with Google
          </button>

          <button
            className="btn btn-secondary"
            onClick={handleDemo}
            type="button"
            style={{ width: '100%', marginTop: 10, borderRadius: 'var(--radius-md)' }}
          >
            🚀 Try Demo
          </button>

          <p className="login-card__footer">
            Don't have an account? <Link to="/signup">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
