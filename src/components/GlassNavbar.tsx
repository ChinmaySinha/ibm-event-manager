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
        fixed top-0 left-0 right-0 z-50 h-[64px] px-6
        flex items-center
        transition-all duration-300 ease-in-out
        ${scrolled
          ? 'bg-[rgba(6,9,26,0.92)] backdrop-blur-2xl border-b border-white/[0.06] shadow-[0_4px_32px_rgba(0,0,0,0.4)]'
          : 'bg-[rgba(6,9,26,0.4)] backdrop-blur-xl border-b border-white/[0.03]'
        }
      `}
    >
      <div className="flex items-center justify-between w-full max-w-[1200px] mx-auto">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 no-underline group">
          <div className="w-9 h-9 bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-violet)] rounded-xl flex items-center justify-center font-extrabold text-[0.7rem] text-[#06091a] font-[var(--font-serif)] shadow-[0_2px_12px_rgba(61,214,200,0.25)]">
            EM
          </div>
          <span className="font-[var(--font-serif)] font-semibold text-[var(--color-text-primary)] text-[0.95rem] tracking-tight hidden sm:inline">
            IBM Event Manager
          </span>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-1">
          <Link
            to="/"
            className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 no-underline
              ${isActive('/') ? 'text-[var(--color-text-primary)] bg-white/[0.06]' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/[0.04]'}
            `}
          >
            Events
          </Link>
          <Link
            to="/create"
            className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 no-underline flex items-center gap-1.5
              ${isActive('/create') ? 'text-[var(--color-text-primary)] bg-white/[0.06]' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/[0.04]'}
            `}
          >
            <Plus size={15} /> Create
          </Link>
        </div>

        {/* User Avatar */}
        <div className="relative" ref={dropdownRef}>
          <div
            className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-violet)] flex items-center justify-center text-[0.7rem] font-bold uppercase text-[#06091a] cursor-pointer border-2 border-transparent hover:border-[rgba(61,214,200,0.35)] hover:scale-105 transition-all duration-200 shadow-[0_2px_12px_rgba(61,214,200,0.2)]"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {getInitials()}
          </div>

          {showDropdown && (
            <div className="absolute top-[calc(100%+10px)] right-0 min-w-[220px] bg-[rgba(10,15,44,0.96)] backdrop-blur-2xl border border-white/[0.08] rounded-2xl shadow-[0_16px_56px_rgba(0,0,0,0.6)] p-1.5 animate-[scaleIn_0.15s_ease]">
              <div className="px-4 py-3 pb-3 mb-1 border-b border-white/[0.06] cursor-default">
                <div className="font-semibold text-[var(--color-text-primary)] text-sm">
                  {(user as any)?.displayName || 'User'}
                </div>
                <div className="text-xs text-[var(--color-text-tertiary)] mt-0.5">
                  {(user as any)?.email}
                </div>
              </div>
              <button
                className="flex items-center gap-2.5 w-full px-4 py-3 text-sm text-[var(--color-text-secondary)] rounded-xl border-none bg-transparent font-[var(--font-sans)] cursor-pointer hover:bg-white/[0.05] hover:text-red-400 transition-all duration-200"
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
