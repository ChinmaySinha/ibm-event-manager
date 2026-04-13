import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import GlassNavbar from '../components/GlassNavbar';
import GlassCard from '../components/GlassCard';
import AnimatedBackground from '../components/AnimatedBackground';
import RsvpToggle from '../components/RsvpToggle';
import { Calendar, Clock, MapPin, Users, ArrowLeft, Globe } from 'lucide-react';
import type { EventData } from '../types/event';

const DEMO_EVENTS: Record<string, EventData> = {
  'demo-1': {
    id: 'demo-1', title: 'Annual Tech Summit 2026',
    description: 'Join industry leaders for a day of innovation, networking, and cutting-edge tech talks. Featured speakers include top engineers from leading tech companies discussing AI, cloud computing, and the future of software development.\n\nTopics covered:\n• Artificial Intelligence & Machine Learning\n• Cloud-Native Architecture\n• Developer Experience & Tooling\n• Panel: The Future of Tech',
    date: '2026-05-15', startTime: '09:00', endTime: '18:00',
    location: 'San Francisco Convention Center', locationType: 'in-person',
    hostName: 'Demo User', hostId: 'demo-user-001',
    coverUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80',
    rsvps: { 'demo-user-001': 'yes', 'user-2': 'yes', 'user-3': 'yes', 'user-4': 'maybe' },
  },
  'demo-2': {
    id: 'demo-2', title: 'Design Systems Workshop',
    description: "A hands-on workshop about building and maintaining scalable design systems. Learn how to create reusable components, establish design tokens, and build a coherent visual language for your product.\n\nWhat you'll learn:\n• Design tokens & theming\n• Component architecture\n• Accessibility best practices\n• Documentation strategies",
    date: '2026-05-20', startTime: '14:00', endTime: '17:00',
    location: 'https://meet.google.com/abc-xyz', locationType: 'virtual',
    hostName: 'Demo User', hostId: 'demo-user-001',
    coverUrl: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200&q=80',
    rsvps: { 'demo-user-001': 'yes', 'user-5': 'yes' },
  },
  'demo-3': {
    id: 'demo-3', title: 'Team Building & Networking Night',
    description: 'An evening of fun activities, great food, and making new connections. This casual event is perfect for meeting fellow professionals in a relaxed environment.\n\nWhat to expect:\n• Icebreaker activities\n• Gourmet catering & drinks\n• Live music\n• Networking sessions',
    date: '2026-06-01', startTime: '19:00', endTime: '22:00',
    location: 'Rooftop Lounge, 5th Avenue', locationType: 'in-person',
    hostName: 'Demo User', hostId: 'demo-user-001',
    coverUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&q=80',
    rsvps: { 'user-6': 'yes', 'user-7': 'maybe', 'user-8': 'yes', 'user-9': 'yes', 'user-10': 'no' },
  },
};

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user, demoMode } = useAuth();
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [rsvpLoading, setRsvpLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    if (demoMode || id.startsWith('demo-')) {
      const de = DEMO_EVENTS[id];
      if (de) setEvent({ ...de });
      setLoading(false);
      return;
    }
    try {
      const unsub = onSnapshot(doc(db, 'events', id), (snap) => {
        if (snap.exists()) setEvent({ id: snap.id, ...snap.data() } as EventData);
        setLoading(false);
      });
      return unsub;
    } catch (err) {
      console.warn('Firestore not available');
      setLoading(false);
    }
  }, [id, demoMode]);

  const handleRsvp = async (value: 'yes' | 'maybe' | 'no') => {
    if (!user || rsvpLoading || !id) return;
    setRsvpLoading(true);
    if (demoMode || id.startsWith('demo-')) {
      setEvent(prev => prev ? { ...prev, rsvps: { ...prev.rsvps, [(user as any).uid]: value } } : null);
      setRsvpLoading(false);
      return;
    }
    try {
      await updateDoc(doc(db, 'events', id), { [`rsvps.${(user as any).uid}`]: value });
    } catch (err) { console.error('RSVP error:', err); }
    setRsvpLoading(false);
  };

  if (loading) {
    return (
      <>
        <GlassNavbar />
        <AnimatedBackground />
        <div className="flex items-center justify-center min-h-screen"><div className="spinner" /></div>
      </>
    );
  }

  if (!event) {
    return (
      <>
        <GlassNavbar />
        <AnimatedBackground />
        <div className="flex flex-col items-center justify-center min-h-screen gap-6">
          <h2 className="font-[var(--font-serif)]">Event not found</h2>
          <Link to="/" className="glass-button glass-button-primary no-underline">Back to Events</Link>
        </div>
      </>
    );
  }

  const rsvps = event.rsvps || {};
  const userRsvp = user ? (rsvps[(user as any).uid] || 'maybe') as 'yes' | 'maybe' | 'no' : 'maybe';
  const yesCount = Object.values(rsvps).filter(v => v === 'yes').length;
  const maybeCount = Object.values(rsvps).filter(v => v === 'maybe').length;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatTime = (timeStr: string) => {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':');
    const hour = parseInt(h);
    return `${hour % 12 || 12}:${m} ${hour >= 12 ? 'PM' : 'AM'}`;
  };

  const getHostInitials = () => (event.hostName || '').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';

  const locationIcon = event.locationType === 'virtual' ? Globe : MapPin;
  const LocationIcon = locationIcon;

  const infoItems = [
    event.date && { icon: Calendar, label: 'Date', value: formatDate(event.date) },
    event.startTime && { icon: Clock, label: 'Time', value: `${formatTime(event.startTime)}${event.endTime ? ` — ${formatTime(event.endTime)}` : ''}` },
    event.location && { icon: LocationIcon, label: event.locationType === 'virtual' ? 'Online' : 'Location', value: event.location },
    { icon: Users, label: 'Attendees', value: `${yesCount} going${maybeCount > 0 ? `, ${maybeCount} maybe` : ''}` },
  ].filter(Boolean) as Array<{ icon: any; label: string; value: string }>;

  return (
    <>
      <GlassNavbar />
      <AnimatedBackground />

      <div className="min-h-screen pt-16">
        {/* Hero */}
        <div className="h-[340px] relative overflow-hidden bg-gradient-to-br from-[rgba(45,212,160,0.12)] to-[rgba(201,168,76,0.06)]">
          {event.coverUrl && <img src={event.coverUrl} alt="" className="w-full h-full object-cover" />}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-emerald-deep)] via-[rgba(10,31,26,0.3)] to-transparent" />
        </div>

        {/* Content */}
        <div className="max-w-[1000px] mx-auto -mt-20 px-6 pb-16 relative grid grid-cols-1 md:grid-cols-[1fr_300px] gap-8">
          {/* Main */}
          <div className="animate-[fadeIn_0.6s_ease]">
            <Link to="/" className="inline-flex items-center gap-2 text-[var(--color-cream-faint)] text-sm mb-4 no-underline hover:text-[var(--color-cream)] transition-colors duration-200">
              <ArrowLeft size={15} /> Back to Events
            </Link>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[rgba(45,212,160,0.1)] border border-[rgba(45,212,160,0.2)] rounded-full text-xs font-semibold text-[var(--color-emerald-accent)] mb-4">
              <Calendar size={13} /> {formatDate(event.date)}
            </div>

            <h1 className="font-[var(--font-serif)] text-3xl font-bold tracking-tight mb-4">{event.title}</h1>

            {/* Host */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-dark)] flex items-center justify-center font-bold text-sm text-[var(--color-emerald-deep)]">
                {getHostInitials()}
              </div>
              <div>
                <div className="font-semibold text-sm">{event.hostName || 'Unknown'}</div>
                <div className="text-xs text-[var(--color-cream-faint)]">Event Host</div>
              </div>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {infoItems.map(({ icon: Icon, label, value }, i) => (
                <GlassCard key={i} className="flex items-start gap-4 px-5 py-4">
                  <div className="w-10 h-10 min-w-10 rounded-lg bg-[rgba(45,212,160,0.08)] flex items-center justify-center text-[var(--color-emerald-accent)]">
                    <Icon size={18} />
                  </div>
                  <div>
                    <div className="text-[0.65rem] uppercase tracking-widest text-[var(--color-cream-faint)] mb-0.5">{label}</div>
                    <div className="font-semibold text-sm">{value}</div>
                  </div>
                </GlassCard>
              ))}
            </div>

            {/* Description */}
            {event.description && (
              <GlassCard className="p-7 mb-8">
                <h3 className="font-[var(--font-serif)] text-lg mb-4">About this event</h3>
                <p className="whitespace-pre-wrap leading-[1.8] text-sm text-[var(--color-cream-muted)]">{event.description}</p>
              </GlassCard>
            )}
          </div>

          {/* Sidebar: RSVP */}
          <div className="animate-[slideUp_0.6s_ease_0.15s_forwards] opacity-0">
            <GlassCard className="p-7 text-center sticky top-24">
              <h3 className="font-[var(--font-serif)] text-lg mb-6">RSVP</h3>
              <RsvpToggle value={userRsvp} onChange={handleRsvp} />

              <div className={`mt-6 py-2.5 px-4 rounded-xl text-sm font-semibold ${
                userRsvp === 'yes' ? 'bg-emerald-500/8 text-emerald-400 border border-emerald-500/15' :
                userRsvp === 'maybe' ? 'bg-amber-500/8 text-amber-400 border border-amber-500/15' :
                'bg-red-500/8 text-red-400 border border-red-500/15'
              }`}>
                {userRsvp === 'yes' && "You're going! 🎉"}
                {userRsvp === 'maybe' && "You might attend 🤔"}
                {userRsvp === 'no' && "You can't make it 😔"}
              </div>

              {yesCount > 0 && (
                <div className="mt-7 pt-5 border-t border-white/[0.04]">
                  <h4 className="text-xs text-[var(--color-cream-faint)] mb-3">{yesCount} {yesCount === 1 ? 'person' : 'people'} going</h4>
                  <div className="flex justify-center flex-wrap gap-2">
                    {[...Array(Math.min(yesCount, 6))].map((_, i) => (
                      <div key={i} className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-dark)] flex items-center justify-center text-[0.55rem] font-bold text-[var(--color-emerald-deep)]" />
                    ))}
                  </div>
                </div>
              )}
            </GlassCard>
          </div>
        </div>
      </div>
    </>
  );
}
