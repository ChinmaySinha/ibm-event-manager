import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Plus } from 'lucide-react';

export default function GlassNavbar() {
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try { await logout(); navigate('/login'); }
    catch (err) { console.error('Logout error:', err); }
  };

  const getInitials = () => {
    if (!user) return '?';
    const name = (user as any).displayName;
    if (name) return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
    return ((user as any).email)?.[0]?.toUpperCase() || '?';
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      className={`
        fixed top-0 left-0 right-0 z-50 h-16 px-6 flex items-center
        transition-all duration-300 ease-in-out
        ${scrolled
          ? 'bg-[rgba(10,31,26,0.85)] backdrop-blur-xl border-b border-white/6 shadow-[0_4px_30px_rgba(0,0,0,0.3)]'
          : 'bg-[rgba(10,31,26,0.3)] backdrop-blur-md border-b border-white/[0.03]'
        }
      `}
    >
      <div className="flex items-center justify-between w-full max-w-[1200px] mx-auto">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 no-underline group">
          <div className="w-8 h-8 bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-dark)] rounded-lg flex items-center justify-center font-extrabold text-xs text-[var(--color-emerald-deep)] font-[var(--font-serif)]">
            EM
          </div>
          <span className="font-[var(--font-serif)] font-semibold text-[var(--color-cream)] text-base tracking-tight hidden sm:inline">
            IBM Event Manager
          </span>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-1">
          <Link
            to="/"
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 no-underline
              ${isActive('/') ? 'text-[var(--color-cream)] bg-white/[0.04]' : 'text-[var(--color-cream-faint)] hover:text-[var(--color-cream)] hover:bg-white/[0.03]'}
            `}
          >
            Events
          </Link>
          <Link
            to="/create"
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 no-underline flex items-center gap-1.5
              ${isActive('/create') ? 'text-[var(--color-cream)] bg-white/[0.04]' : 'text-[var(--color-cream-faint)] hover:text-[var(--color-cream)] hover:bg-white/[0.03]'}
            `}
          >
            <Plus size={15} /> Create
          </Link>
        </div>

        {/* User Avatar */}
        <div className="relative" ref={dropdownRef}>
          <div
            className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-dark)] flex items-center justify-center text-xs font-bold uppercase text-[var(--color-emerald-deep)] cursor-pointer border-2 border-transparent hover:border-[rgba(201,168,76,0.4)] hover:scale-105 transition-all duration-200"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {getInitials()}
          </div>

          {showDropdown && (
            <div className="absolute top-[calc(100%+8px)] right-0 min-w-[210px] bg-[rgba(14,42,35,0.92)] backdrop-blur-xl border border-white/8 rounded-xl shadow-[0_12px_48px_rgba(0,0,0,0.5)] p-1 animate-[scaleIn_0.15s_ease]">
              <div className="px-3.5 py-2 pb-2.5 mb-1 border-b border-white/[0.05] cursor-default">
                <div className="font-semibold text-[var(--color-cream)] text-sm">
                  {(user as any)?.displayName || 'User'}
                </div>
                <div className="text-xs text-[var(--color-cream-faint)] mt-0.5">
                  {(user as any)?.email}
                </div>
              </div>
              <button
                className="flex items-center gap-2 w-full px-3.5 py-2.5 text-sm text-[var(--color-cream-muted)] rounded-lg border-none bg-transparent font-[var(--font-sans)] cursor-pointer hover:bg-white/[0.04] hover:text-red-400 transition-all duration-200"
                onClick={handleLogout}
              >
                <LogOut size={15} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
