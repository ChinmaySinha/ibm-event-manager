import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import GlassNavbar from '../components/GlassNavbar';
import GlassCard from '../components/GlassCard';
import AnimatedBackground from '../components/AnimatedBackground';
import { ArrowLeft, Image, Globe, MapPin, Ticket, Users } from 'lucide-react';

export default function CreateEventPage() {
  const { user, demoMode } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', date: '', startTime: '', endTime: '',
    location: '', locationType: 'in-person' as const,
    coverUrl: '', maxAttendees: '', ticketPrice: 'Free',
    requireApproval: false, visibility: 'public' as const,
  });

  const update = (field: string, value: any) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.date) return;
    setLoading(true);

    if (demoMode) {
      setLoading(false);
      navigate(`/event/demo-${Date.now()}`);
      return;
    }

    try {
      const docRef = await addDoc(collection(db, 'events'), {
        ...form,
        maxAttendees: form.maxAttendees ? parseInt(form.maxAttendees) : null,
        hostId: (user as any).uid,
        hostName: (user as any).displayName || (user as any).email,
        rsvps: {},
        createdAt: serverTimestamp(),
      });
      navigate(`/event/${docRef.id}`);
    } catch (err) {
      console.error('Create event error:', err);
      alert('Failed to create event. Please try again.');
    }
    setLoading(false);
  };

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone?.split('/').pop() || 'Local';
  const gmtOffset = (() => {
    const offset = new Date().getTimezoneOffset();
    const h = Math.floor(Math.abs(offset) / 60);
    const m = Math.abs(offset) % 60;
    return `GMT${offset <= 0 ? '+' : '-'}${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  })();

  return (
    <>
      <GlassNavbar />
      <AnimatedBackground />

      <div className="min-h-screen pt-20 flex justify-center">
        <div className="w-full max-w-[880px] px-6 pb-16 relative">
          {/* Back */}
          <button
            className="w-10 h-10 rounded-full bg-white/5 border-none text-[var(--color-cream-muted)] flex items-center justify-center cursor-pointer hover:bg-white/10 hover:text-[var(--color-cream)] transition-all duration-200 mb-6"
            type="button"
            onClick={() => navigate('/')}
          >
            <ArrowLeft size={18} />
          </button>

          <form className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8" onSubmit={handleSubmit}>
            {/* LEFT: Cover Image */}
            <div className="flex flex-col gap-4">
              <div
                className="w-full aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer relative bg-gradient-to-br from-[rgba(45,212,160,0.12)] to-[rgba(201,168,76,0.08)] border border-white/[0.06] transition-all duration-300 hover:border-white/[0.12] group"
                onClick={() => {
                  const url = prompt('Enter image URL for event cover:');
                  if (url) update('coverUrl', url);
                }}
              >
                {form.coverUrl ? (
                  <img src={form.coverUrl} alt="Cover" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-[var(--color-cream-faint)] text-sm">
                    <Image size={32} className="opacity-40" />
                    <span>Upload Cover</span>
                  </div>
                )}
                <div className="absolute bottom-4 right-4 w-9 h-9 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Image size={16} />
                </div>
              </div>
            </div>

            {/* RIGHT: Form */}
            <div className="flex flex-col gap-4">
              {/* Visibility chip */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-full cursor-pointer transition-all duration-200 border
                    ${form.visibility === 'public'
                      ? 'text-[var(--color-emerald-accent)] border-[rgba(45,212,160,0.25)] bg-[rgba(45,212,160,0.08)]'
                      : 'text-[var(--color-cream-muted)] border-white/8 bg-white/[0.04] hover:bg-white/[0.07]'
                    }
                    font-[var(--font-sans)]
                  `}
                  onClick={() => update('visibility', form.visibility === 'public' ? 'private' : 'public')}
                >
                  <Globe size={13} />
                  {form.visibility === 'public' ? 'Public' : 'Private'}
                </button>
              </div>

              {/* Event Name */}
              <input
                className="w-full font-[var(--font-serif)] text-3xl font-bold text-[var(--color-cream)] bg-transparent border-none outline-none py-1 tracking-tight placeholder:text-[var(--color-cream-faint)]"
                type="text"
                placeholder="Event Name"
                value={form.title}
                onChange={(e) => update('title', e.target.value)}
                required
              />

              {/* Date & Time */}
              <GlassCard hoverable={false} className="overflow-hidden p-0">
                <div className="flex items-center gap-4 px-4 py-3.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-emerald-accent)] shadow-[0_0_8px_rgba(45,212,160,0.4)] shrink-0" />
                  <span className="text-sm font-medium text-[var(--color-cream-muted)] min-w-9">Start</span>
                  <input type="date" className="glass-input-boxed" value={form.date} onChange={(e) => update('date', e.target.value)} required />
                  <input type="time" className="glass-input-boxed w-[90px]" value={form.startTime} onChange={(e) => update('startTime', e.target.value)} />
                  <div className="ml-auto flex items-center gap-2 text-[var(--color-cream-faint)] text-xs">
                    <Globe size={14} className="opacity-40" />
                    <div>
                      <div className="font-semibold text-[var(--color-cream-muted)] text-xs">{gmtOffset}</div>
                      <div className="text-[0.68rem] text-[var(--color-cream-faint)]">{timezone}</div>
                    </div>
                  </div>
                </div>
                <div className="h-px bg-white/[0.04] mx-4" />
                <div className="flex items-center gap-4 px-4 py-3.5">
                  <div className="w-2.5 h-2.5 rounded-full border-2 border-[var(--color-cream-faint)] shrink-0" />
                  <span className="text-sm font-medium text-[var(--color-cream-muted)] min-w-9">End</span>
                  <input type="date" className="glass-input-boxed" value={form.date} readOnly tabIndex={-1} />
                  <input type="time" className="glass-input-boxed w-[90px]" value={form.endTime} onChange={(e) => update('endTime', e.target.value)} />
                </div>
              </GlassCard>

              {/* Location */}
              <GlassCard
                hoverable={false}
                className="flex items-center gap-4 px-4 py-4 cursor-pointer"
                onClick={() => {
                  const loc = prompt(
                    form.locationType === 'virtual' ? 'Enter meeting link:' : 'Enter venue address:',
                    form.location
                  );
                  if (loc !== null) update('location', loc);
                }}
              >
                <MapPin size={18} className="text-[var(--color-cream-faint)] shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-[var(--color-cream)] truncate">
                    {form.location || 'Add Event Location'}
                  </div>
                  <div className="text-xs text-[var(--color-cream-faint)] mt-0.5">Offline location or virtual link</div>
                </div>
                <select
                  className="glass-input-boxed py-1.5 px-2.5 w-auto text-xs cursor-pointer font-[var(--font-sans)]"
                  value={form.locationType}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => update('locationType', e.target.value)}
                >
                  <option value="in-person">In-Person</option>
                  <option value="virtual">Virtual</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </GlassCard>

              {/* Description */}
              <GlassCard hoverable={false} className="px-4 py-4">
                <textarea
                  className="glass-textarea"
                  placeholder="Add Description"
                  value={form.description}
                  onChange={(e) => update('description', e.target.value)}
                />
              </GlassCard>

              {/* Event Options */}
              <div className="text-xs font-semibold text-[var(--color-cream-faint)] uppercase tracking-widest mt-2">
                Event Options
              </div>

              <GlassCard hoverable={false} className="overflow-hidden p-0">
                <div className="flex items-center gap-4 px-4 py-3.5">
                  <Ticket size={17} className="text-[var(--color-cream-faint)] shrink-0" />
                  <span className="flex-1 text-sm font-medium text-[var(--color-cream)]">Ticket Price</span>
                  <span className="text-sm text-[var(--color-cream-faint)] font-medium">{form.ticketPrice}</span>
                </div>
                <div className="h-px bg-white/[0.04] mx-4" />
                <div className="flex items-center gap-4 px-4 py-3.5">
                  <Users size={17} className="text-[var(--color-cream-faint)] shrink-0" />
                  <span className="flex-1 text-sm font-medium text-[var(--color-cream)]">Require Approval</span>
                  <label className="relative w-[42px] h-6 shrink-0">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={form.requireApproval}
                      onChange={(e) => update('requireApproval', e.target.checked)}
                    />
                    <span className="absolute inset-0 bg-white/10 rounded-full cursor-pointer transition-all duration-300 peer-checked:bg-[var(--color-emerald-accent)]" />
                    <span className="absolute w-[18px] h-[18px] rounded-full bg-[var(--color-cream-muted)] top-[3px] left-[3px] transition-all duration-300 peer-checked:translate-x-[18px] peer-checked:bg-white" />
                  </label>
                </div>
                <div className="h-px bg-white/[0.04] mx-4" />
                <div className="flex items-center gap-4 px-4 py-3.5">
                  <Users size={17} className="text-[var(--color-cream-faint)] shrink-0" />
                  <span className="flex-1 text-sm font-medium text-[var(--color-cream)]">Capacity</span>
                  <input
                    type="text"
                    className="bg-transparent border-none text-right text-[var(--color-cream-faint)] font-[var(--font-sans)] text-sm font-medium outline-none w-24 placeholder:text-[var(--color-cream-faint)]"
                    placeholder="Unlimited"
                    value={form.maxAttendees}
                    onChange={(e) => update('maxAttendees', e.target.value)}
                  />
                </div>
              </GlassCard>

              {/* Submit */}
              <button
                className="glass-button glass-button-primary w-full py-4 text-base mt-2"
                type="submit"
                disabled={loading || !form.title || !form.date}
              >
                {loading ? 'Creating...' : 'Create Event'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
