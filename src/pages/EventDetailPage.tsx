import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import GlassNavbar from '../components/GlassNavbar';
import GlassCard from '../components/GlassCard';
import AnimatedBackground from '../components/AnimatedBackground';
import RsvpToggle from '../components/RsvpToggle';
import { ArrowLeft, Calendar, MapPin, Clock, Users, Globe, Share2 } from 'lucide-react';
import type { EventData } from '../types/event';

const DEMO_EVENT: EventData = {
  id: 'demo-1',
  title: 'Annual Tech Summit 2026',
  description: 'Join industry leaders for a day of innovation, networking, and cutting-edge tech talks. This premier event brings together the brightest minds in technology for keynotes, workshops, and networking.\n\nHighlights:\n• Keynote by leading AI researchers\n• Hands-on workshops on cloud computing\n• Networking sessions with 500+ attendees',
  date: '2026-05-15', startTime: '09:00', endTime: '18:00',
  location: 'San Francisco Convention Center, 747 Howard St', locationType: 'in-person',
  hostName: 'Demo User', hostId: 'demo-user-001',
  coverUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80',
  rsvps: { 'demo-user-001': 'yes', 'user-2': 'yes', 'user-3': 'yes', 'user-4': 'maybe', 'user-5': 'yes' },
};

export default function EventDetailPage() {
  const { id } = useParams();
  const { user, demoMode } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);

  const isDemoEvent = id?.startsWith('demo');

  useEffect(() => {
    const handleDemoEvent = () => {
      const existingStr = localStorage.getItem('demo_events');
      const localEvents = existingStr ? JSON.parse(existingStr) : [];
      const found = localEvents.find((e: any) => e.id === id);
      setEvent(found || { ...DEMO_EVENT, id: id || 'demo-1' });
      setLoading(false);
    };

    if (demoMode || isDemoEvent) {
      handleDemoEvent();
      return;
    }
    const ref = doc(db, 'events', id!);
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) { setEvent({ id: snap.id, ...snap.data() } as EventData); }
      setLoading(false);
    }, () => { handleDemoEvent(); });
    return unsub;
  }, [id, demoMode, isDemoEvent]);

  const handleRsvp = async (status: string) => {
    if (!event || !user) return;
    const uid = (user as any).uid;
    const newRsvps = { ...event.rsvps, [uid]: status };
    setEvent(prev => prev ? { ...prev, rsvps: newRsvps } : prev);
    if (!demoMode && !isDemoEvent) {
      try { await updateDoc(doc(db, 'events', event.id), { rsvps: newRsvps }); }
      catch (err) { console.error('RSVP error:', err); }
    }
  };

  if (loading) return (
    <>
      <GlassNavbar /><AnimatedBackground />
      <div className="min-h-screen flex items-center justify-center"><div className="spinner" /></div>
    </>
  );

  if (!event) return (
    <>
      <GlassNavbar /><AnimatedBackground />
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <h2>Event not found</h2>
        <button className="glass-button glass-button-primary" onClick={() => navigate('/')}>Back to Events</button>
      </div>
    </>
  );

  const dateStr = event.date ? new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : '';
  const formatTime = (t: string) => { if (!t) return ''; const [h, m] = t.split(':'); const hour = parseInt(h); return `${hour % 12 || 12}:${m} ${hour >= 12 ? 'PM' : 'AM'}`; };
  const timeStr = [formatTime(event.startTime), formatTime(event.endTime)].filter(Boolean).join(' — ');
  const rsvps = event.rsvps || {};
  const counts = { yes: 0, maybe: 0, no: 0 };
  Object.values(rsvps).forEach(v => { if (v in counts) counts[v as keyof typeof counts]++; });
  const userRsvp = user ? rsvps[(user as any).uid] : null;

  return (
    <>
      <GlassNavbar /><AnimatedBackground />

      <div className="min-h-screen pt-28 pb-24">
        <div className="w-full max-w-[960px] mx-auto px-6">
          {/* Back */}
          <button
            className="w-11 h-11 rounded-full bg-white/5 border border-white/[0.06] text-[var(--color-text-secondary)] flex items-center justify-center cursor-pointer hover:bg-white/10 hover:text-[var(--color-text-primary)] transition-all duration-200 mb-8"
            type="button"
            onClick={() => navigate('/')}
          >
            <ArrowLeft size={18} />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-10 items-start animate-[fadeIn_0.6s_ease_forwards]">
            {/* LEFT: Main content */}
            <div className="flex flex-col gap-6">
              {/* Cover */}
              {event.coverUrl && (
                <div className="w-full aspect-[16/7] rounded-2xl overflow-hidden border border-white/[0.06]">
                  <img src={event.coverUrl} alt="" className="w-full h-full object-cover" />
                </div>
              )}

              {/* Title */}
              <div>
                <h1 className="font-[var(--font-serif)] text-3xl md:text-4xl font-bold mb-3 tracking-tight">{event.title}</h1>
                <div className="text-sm text-[var(--color-text-tertiary)]">
                  Hosted by <span className="text-[var(--color-text-primary)] font-medium">{event.hostName || 'Unknown'}</span>
                </div>
              </div>

              {/* Details */}
              <GlassCard hoverable={false} className="overflow-hidden p-0">
                {dateStr && (
                  <div className="flex items-center gap-5 px-7 py-5">
                    <div className="w-12 h-12 rounded-xl bg-[rgba(61,214,200,0.08)] flex items-center justify-center shrink-0">
                      <Calendar size={20} className="text-[var(--color-accent-light)]" />
                    </div>
                    <div>
                      <div className="text-base font-semibold text-[var(--color-text-primary)]">{dateStr}</div>
                      {timeStr && <div className="text-sm text-[var(--color-text-tertiary)] mt-1">{timeStr}</div>}
                    </div>
                  </div>
                )}
                <div className="h-px bg-white/[0.04] mx-7" />
                {event.location && (
                  <div className="flex items-center gap-5 px-7 py-5">
                    <div className="w-12 h-12 rounded-xl bg-[rgba(124,91,245,0.08)] flex items-center justify-center shrink-0">
                      {event.locationType === 'virtual' ? <Globe size={20} className="text-[var(--color-violet-light)]" /> : <MapPin size={20} className="text-[var(--color-violet-light)]" />}
                    </div>
                    <div>
                      <div className="text-base font-semibold text-[var(--color-text-primary)]">{event.location}</div>
                      <div className="text-sm text-[var(--color-text-tertiary)] mt-1 capitalize">{event.locationType || 'In-Person'}</div>
                    </div>
                  </div>
                )}
              </GlassCard>

              {/* Description */}
              {event.description && (
                <GlassCard hoverable={false} className="px-7 py-6">
                  <h2 className="font-[var(--font-serif)] text-lg font-semibold mb-4">About</h2>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-line">{event.description}</p>
                </GlassCard>
              )}
            </div>

            {/* RIGHT: Sidebar */}
            <div className="flex flex-col gap-5 sticky top-28">
              {/* RSVP */}
              <GlassCard hoverable={false} className="px-7 py-7">
                <h3 className="font-[var(--font-serif)] text-base font-semibold mb-5">RSVP</h3>
                <RsvpToggle currentStatus={userRsvp || 'none'} onStatusChange={handleRsvp} />
              </GlassCard>

              {/* Attendees */}
              <GlassCard hoverable={false} className="px-7 py-7">
                <h3 className="font-[var(--font-serif)] text-base font-semibold mb-5 flex items-center gap-2">
                  <Users size={18} className="text-[var(--color-text-tertiary)]" /> Guests
                </h3>
                <div className="flex flex-col gap-4 text-sm">
                  <div className="flex justify-between"><span className="text-[var(--color-text-secondary)]">Going</span><span className="font-bold text-emerald-400">{counts.yes}</span></div>
                  <div className="flex justify-between"><span className="text-[var(--color-text-secondary)]">Maybe</span><span className="font-bold text-amber-400">{counts.maybe}</span></div>
                  <div className="flex justify-between"><span className="text-[var(--color-text-secondary)]">Can't go</span><span className="font-bold text-red-400">{counts.no}</span></div>
                </div>
              </GlassCard>

              {/* Share */}
              <button
                className="glass-button glass-button-secondary w-full py-3.5"
                onClick={() => { navigator.clipboard.writeText(window.location.href); }}
              >
                <Share2 size={16} /> Share Event
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
