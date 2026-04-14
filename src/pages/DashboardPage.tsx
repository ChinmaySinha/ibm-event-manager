import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import GlassNavbar from '../components/GlassNavbar';
import GlassCard from '../components/GlassCard';
import AnimatedBackground from '../components/AnimatedBackground';
import { Calendar, MapPin, Clock, Plus } from 'lucide-react';
import type { EventData } from '../types/event';

const DEMO_EVENTS: EventData[] = [
  {
    id: 'demo-1',
    title: 'Annual Tech Summit 2026',
    description: 'Join industry leaders for a day of innovation, networking, and cutting-edge tech talks.',
    date: '2026-05-15', startTime: '09:00', endTime: '18:00',
    location: 'San Francisco Convention Center', locationType: 'in-person',
    hostName: 'Demo User', hostId: 'demo-user-001',
    coverUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    rsvps: { 'demo-user-001': 'yes', 'user-2': 'yes', 'user-3': 'yes', 'user-4': 'maybe' },
  },
  {
    id: 'demo-2',
    title: 'Design Systems Workshop',
    description: 'A hands-on workshop about building and maintaining scalable design systems.',
    date: '2026-05-20', startTime: '14:00', endTime: '17:00',
    location: 'https://meet.google.com/abc-xyz', locationType: 'virtual',
    hostName: 'Demo User', hostId: 'demo-user-001',
    coverUrl: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&q=80',
    rsvps: { 'demo-user-001': 'yes', 'user-5': 'yes' },
  },
  {
    id: 'demo-3',
    title: 'Team Building & Networking Night',
    description: 'An evening of fun activities, great food, and making new connections.',
    date: '2026-06-01', startTime: '19:00', endTime: '22:00',
    location: 'Rooftop Lounge, 5th Avenue', locationType: 'in-person',
    hostName: 'Demo User', hostId: 'demo-user-001',
    coverUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80',
    rsvps: { 'user-6': 'yes', 'user-7': 'maybe', 'user-8': 'yes', 'user-9': 'yes', 'user-10': 'no' },
  },
];

export default function DashboardPage() {
  const { user, demoMode } = useAuth();
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (demoMode) { setEvents(DEMO_EVENTS); setLoading(false); return; }
    try {
      const q = query(collection(db, 'events'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const evts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as EventData));
        setEvents(evts); setLoading(false);
      }, (err) => { console.warn('Firestore error:', err); setEvents(DEMO_EVENTS); setLoading(false); });
      return unsubscribe;
    } catch (err) { console.warn('Firestore not available'); setEvents(DEMO_EVENTS); setLoading(false); }
  }, [demoMode]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return { month: '', day: 0, full: '' };
    const d = new Date(dateStr);
    return {
      month: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
      day: d.getDate(),
      full: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }),
    };
  };

  const formatTime = (timeStr: string) => {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':');
    const hour = parseInt(h);
    return `${hour % 12 || 12}:${m} ${hour >= 12 ? 'PM' : 'AM'}`;
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const totalAttendees = events.reduce((sum, e) => sum + Object.values(e.rsvps || {}).filter(v => v === 'yes').length, 0);

  return (
    <>
      <GlassNavbar />
      <AnimatedBackground />

      <div className="min-h-screen pt-28 pb-24">
        <div className="w-full max-w-[1200px] mx-auto px-6">
          {/* Demo banner */}
          {demoMode && (
            <div className="mb-8 bg-gradient-to-r from-[rgba(61,214,200,0.06)] to-[rgba(124,91,245,0.05)] border border-[rgba(61,214,200,0.12)] rounded-2xl py-4 px-6 text-center text-sm text-[var(--color-text-secondary)]">
              🚀 <strong className="text-[var(--color-text-primary)]">Demo Mode</strong> — You're viewing sample data. Connect Firebase to go live!
            </div>
          )}

          {/* Header */}
          <div className="pb-10 animate-[fadeIn_0.6s_ease_forwards]">
            <div className="flex items-center justify-between gap-6 flex-wrap">
              <div>
                <h1 className="font-[var(--font-serif)] text-3xl md:text-4xl font-bold mb-2">
                  {getGreeting()}, {(user as any)?.displayName || 'there'} 👋
                </h1>
                <p className="text-sm text-[var(--color-text-tertiary)]">Here's what's happening with your events.</p>
              </div>
              <Link to="/create" className="glass-button glass-button-primary no-underline">
                <Plus size={18} /> Create Event
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-10">
              {[
                { value: events.length, label: 'Total Events' },
                { value: events.filter(e => new Date(e.date) >= new Date()).length, label: 'Upcoming' },
                { value: totalAttendees, label: 'Total Attendees' },
              ].map((s, i) => (
                <GlassCard key={i} className="py-7 px-6 text-center">
                  <div className="font-[var(--font-serif)] text-4xl font-extrabold bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-violet)] bg-clip-text text-transparent">
                    {s.value}
                  </div>
                  <div className="text-[0.7rem] text-[var(--color-text-tertiary)] uppercase tracking-widest mt-2">{s.label}</div>
                </GlassCard>
              ))}
            </div>
          </div>

          {/* Section header */}
          <div className="flex items-center justify-between mt-4 mb-8">
            <h2 className="font-[var(--font-serif)] text-xl font-semibold">Your Events</h2>
          </div>

          {/* Event grid */}
          {loading ? (
            <div className="flex items-center justify-center min-h-[40vh]"><div className="spinner" /></div>
          ) : events.length === 0 ? (
            <GlassCard className="text-center py-20 px-6">
              <div className="text-5xl mb-6 opacity-20">📅</div>
              <h3 className="font-[var(--font-serif)] mb-3">No events yet</h3>
              <p className="text-[var(--color-text-tertiary)] mb-8">Create your first event and start inviting guests!</p>
              <Link to="/create" className="glass-button glass-button-primary no-underline"><Plus size={18} /> Create Your First Event</Link>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {events.map((event, idx) => {
                const dateInfo = formatDate(event.date);
                const rsvps = event.rsvps || {};
                const yesCount = Object.values(rsvps).filter(v => v === 'yes').length;
                const userRsvp = user ? rsvps[(user as any).uid] : null;

                return (
                  <Link key={event.id} to={`/event/${event.id}`} className="no-underline text-inherit">
                    <GlassCard
                      className="overflow-hidden animate-[fadeIn_0.5s_ease_forwards] opacity-0 group"
                      style={{ animationDelay: `${idx * 0.08}s` }}
                    >
                      {/* Cover */}
                      <div className="h-48 bg-gradient-to-br from-[rgba(61,214,200,0.06)] to-[rgba(124,91,245,0.05)] relative overflow-hidden">
                        {event.coverUrl && (
                          <img src={event.coverUrl} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                        )}
                        <div className="absolute top-4 right-4 px-3 py-2 bg-black/55 backdrop-blur-sm rounded-xl text-center">
                          <div className="text-[0.6rem] uppercase tracking-wider text-[var(--color-accent-light)] font-semibold">{dateInfo.month}</div>
                          <div className="text-xl font-extrabold font-[var(--font-serif)] leading-none text-white">{dateInfo.day}</div>
                        </div>
                      </div>

                      {/* Body */}
                      <div className="px-6 pt-5 pb-3">
                        <h3 className="font-[var(--font-serif)] text-lg font-semibold mb-3 line-clamp-2">{event.title}</h3>
                        <div className="flex flex-col gap-2 text-xs text-[var(--color-text-tertiary)]">
                          {event.location && (
                            <span className="flex items-center gap-2"><MapPin size={13} className="opacity-50" /> {event.location}</span>
                          )}
                          {event.startTime && (
                            <span className="flex items-center gap-2">
                              <Clock size={13} className="opacity-50" />
                              {formatTime(event.startTime)}{event.endTime && ` — ${formatTime(event.endTime)}`}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between px-6 pt-3 pb-5">
                        <div className="flex items-center">
                          {yesCount > 0 && (
                            <>
                              {[...Array(Math.min(yesCount, 3))].map((_, i) => (
                                <div key={i} className="w-7 h-7 rounded-full border-2 border-[var(--color-bg-deep)] bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-violet)] flex items-center justify-center text-[0.55rem] font-bold -ml-2 first:ml-0 text-[#06091a]" />
                              ))}
                              <span className="text-xs text-[var(--color-text-tertiary)] ml-2.5">{yesCount} going</span>
                            </>
                          )}
                        </div>
                        {userRsvp && (
                          <span className={`px-3 py-1.5 rounded-full text-[0.65rem] font-semibold uppercase tracking-wide border ${
                            userRsvp === 'yes' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                            userRsvp === 'maybe' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                            'bg-red-500/10 text-red-400 border-red-500/20'
                          }`}>
                            {userRsvp === 'yes' ? 'Going' : userRsvp === 'maybe' ? 'Maybe' : 'Not Going'}
                          </span>
                        )}
                      </div>
                    </GlassCard>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
