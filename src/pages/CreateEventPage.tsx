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
    title: '', description: '', date: '', endDate: '', startTime: '', endTime: '',
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
      const demoId = `demo-${Date.now()}`;
      const newEvent = {
        ...form,
        id: demoId,
        endDate: form.endDate || form.date,
        maxAttendees: form.maxAttendees ? parseInt(form.maxAttendees) : null,
        hostId: (user as any).uid,
        hostName: (user as any).displayName || (user as any).email,
        rsvps: {},
        createdAt: new Date().toISOString(),
      };
      const existingStr = localStorage.getItem('demo_events');
      const existing = existingStr ? JSON.parse(existingStr) : [];
      localStorage.setItem('demo_events', JSON.stringify([newEvent, ...existing]));
      setLoading(false);
      navigate(`/event/${demoId}`);
      return;
    }

    try {
      const docRef = await addDoc(collection(db, 'events'), {
        ...form,
        endDate: form.endDate || form.date,
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

      <div className="min-h-screen pt-28 pb-24 flex justify-center">
        <div className="w-full max-w-[900px] px-6 relative">
          {/* Back */}
          <button
            className="w-11 h-11 rounded-full bg-white/5 border border-white/[0.06] text-[var(--color-text-secondary)] flex items-center justify-center cursor-pointer hover:bg-white/10 hover:text-[var(--color-text-primary)] transition-all duration-200 mb-8"
            type="button"
            onClick={() => navigate('/')}
          >
            <ArrowLeft size={18} />
          </button>

          <form className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-10 items-start" onSubmit={handleSubmit}>
            {/* LEFT: Cover Image */}
            <div className="flex flex-col gap-5">
              <div
                className="w-full aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer relative bg-gradient-to-br from-[rgba(61,214,200,0.06)] to-[rgba(124,91,245,0.05)] border border-white/[0.06] transition-all duration-300 hover:border-white/[0.14] group"
                onClick={() => {
                  const url = prompt('Enter image URL for event cover:');
                  if (url) update('coverUrl', url);
                }}
              >
                {form.coverUrl ? (
                  <img src={form.coverUrl} alt="Cover" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-[var(--color-text-tertiary)] text-sm">
                    <Image size={36} className="opacity-30" />
                    <span>Upload Cover</span>
                  </div>
                )}
                <div className="absolute bottom-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Image size={16} />
                </div>
              </div>
            </div>

            {/* RIGHT: Form */}
            <div className="flex flex-col gap-5">
              {/* Visibility chip */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-full cursor-pointer transition-all duration-200 border
                    ${form.visibility === 'public'
                      ? 'text-[var(--color-accent-light)] border-[rgba(61,214,200,0.25)] bg-[rgba(61,214,200,0.08)]'
                      : 'text-[var(--color-text-secondary)] border-white/8 bg-white/[0.04] hover:bg-white/[0.07]'
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
                className="w-full font-[var(--font-serif)] text-3xl font-bold text-[var(--color-text-primary)] bg-transparent border-none outline-none py-2 tracking-tight placeholder:text-[var(--color-text-tertiary)]"
                type="text"
                placeholder="Event Name"
                value={form.title}
                onChange={(e) => update('title', e.target.value)}
                required
              />

              {/* Date & Time */}
              <GlassCard hoverable={false} className="overflow-hidden p-0">
                <div className="flex items-center gap-4 px-5 py-4">
                  <div className="w-3 h-3 rounded-full bg-[var(--color-accent)] shadow-[0_0_10px_rgba(61,214,200,0.4)] shrink-0" />
                  <span className="text-sm font-medium text-[var(--color-text-secondary)] min-w-10">Start</span>
                  <input type="date" className="glass-input-boxed flex-1" value={form.date} onChange={(e) => {
                    update('date', e.target.value);
                    if (!form.endDate) update('endDate', e.target.value);
                  }} required />
                  <input type="time" className="glass-input-boxed w-[100px]" value={form.startTime} onChange={(e) => update('startTime', e.target.value)} />
                  <div className="ml-auto flex items-center gap-2 text-[var(--color-text-tertiary)] text-xs shrink-0">
                    <Globe size={14} className="opacity-40" />
                    <div>
                      <div className="font-semibold text-[var(--color-text-secondary)] text-xs">{gmtOffset}</div>
                      <div className="text-[0.65rem] text-[var(--color-text-tertiary)]">{timezone}</div>
                    </div>
                  </div>
                </div>
                <div className="h-px bg-white/[0.04] mx-5" />
                <div className="flex items-center gap-4 px-5 py-4">
                  <div className="w-3 h-3 rounded-full border-2 border-[var(--color-text-tertiary)] shrink-0" />
                  <span className="text-sm font-medium text-[var(--color-text-secondary)] min-w-10">End</span>
                  <input type="date" className="glass-input-boxed flex-1" value={form.endDate || form.date} min={form.date} onChange={(e) => update('endDate', e.target.value)} />
                  <input type="time" className="glass-input-boxed w-[100px]" value={form.endTime} onChange={(e) => update('endTime', e.target.value)} />
                </div>
              </GlassCard>

              {/* Location */}
              <GlassCard
                hoverable={false}
                className="flex items-center gap-4 px-5 py-5"
              >
                <MapPin size={18} className="text-[var(--color-text-tertiary)] shrink-0" />
                <div className="flex-1 min-w-0">
                  <input
                    type="text"
                    className="bg-transparent border-none text-sm font-medium text-[var(--color-text-primary)] w-full outline-none placeholder:text-[var(--color-text-primary)] truncate"
                    placeholder={form.locationType === 'virtual' ? 'Enter meeting link...' : 'Enter venue address...'}
                    value={form.location}
                    onChange={(e) => update('location', e.target.value)}
                  />
                  <div className="text-xs text-[var(--color-text-tertiary)] mt-1">Offline location or virtual link</div>
                </div>
                <select
                  className="glass-input-boxed py-2 px-3 w-auto text-xs cursor-pointer font-[var(--font-sans)]"
                  value={form.locationType}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => update('locationType', e.target.value)}
                >
                  <option className="bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)]" value="in-person">In-Person</option>
                  <option className="bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)]" value="virtual">Virtual</option>
                  <option className="bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)]" value="hybrid">Hybrid</option>
                </select>
              </GlassCard>

              {/* Description */}
              <GlassCard hoverable={false} className="px-5 py-5">
                <textarea
                  className="glass-textarea"
                  placeholder="Add Description"
                  value={form.description}
                  onChange={(e) => update('description', e.target.value)}
                />
              </GlassCard>

              {/* Event Options */}
              <div className="text-[0.7rem] font-semibold text-[var(--color-text-tertiary)] uppercase tracking-widest mt-3 mb-1">
                Event Options
              </div>

              <GlassCard hoverable={false} className="overflow-hidden p-0">
                <div className="flex items-center gap-4 px-5 py-4">
                  <Ticket size={17} className="text-[var(--color-text-tertiary)] shrink-0" />
                  <span className="flex-1 text-sm font-medium text-[var(--color-text-primary)]">Ticket Price</span>
                  <input
                    type="text"
                    className="bg-transparent border-none text-right text-[var(--color-text-primary)] font-[var(--font-sans)] text-sm font-medium outline-none w-24 placeholder:text-[var(--color-text-tertiary)]"
                    placeholder="Free"
                    value={form.ticketPrice}
                    onChange={(e) => update('ticketPrice', e.target.value)}
                  />
                </div>
                <div className="h-px bg-white/[0.04] mx-5" />
                <div className="flex items-center gap-4 px-5 py-4">
                  <Users size={17} className="text-[var(--color-text-tertiary)] shrink-0" />
                  <span className="flex-1 text-sm font-medium text-[var(--color-text-primary)]">Require Approval</span>
                  <label className="relative w-[44px] h-[26px] shrink-0">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={form.requireApproval}
                      onChange={(e) => update('requireApproval', e.target.checked)}
                    />
                    <span className="absolute inset-0 bg-white/10 rounded-full cursor-pointer transition-all duration-300 peer-checked:bg-[var(--color-accent)]" />
                    <span className="absolute w-5 h-5 rounded-full bg-white/70 top-[3px] left-[3px] transition-all duration-300 peer-checked:translate-x-[18px] peer-checked:bg-white" />
                  </label>
                </div>
                <div className="h-px bg-white/[0.04] mx-5" />
                <div className="flex items-center gap-4 px-5 py-4">
                  <Users size={17} className="text-[var(--color-text-tertiary)] shrink-0" />
                  <span className="flex-1 text-sm font-medium text-[var(--color-text-primary)]">Capacity</span>
                  <input
                    type="text"
                    className="bg-transparent border-none text-right text-[var(--color-text-tertiary)] font-[var(--font-sans)] text-sm font-medium outline-none w-24 placeholder:text-[var(--color-text-tertiary)]"
                    placeholder="Unlimited"
                    value={form.maxAttendees}
                    onChange={(e) => update('maxAttendees', e.target.value)}
                  />
                </div>
              </GlassCard>

              {/* Submit */}
              <button
                className="glass-button glass-button-primary w-full py-4 text-base mt-4"
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
