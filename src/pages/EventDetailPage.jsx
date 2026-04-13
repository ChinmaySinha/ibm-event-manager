import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import RsvpToggle from '../components/RsvpToggle';
import {
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineLocationMarker,
  HiOutlineUserGroup,
  HiOutlineArrowLeft,
  HiOutlineGlobe,
} from 'react-icons/hi';
import '../styles/EventDetail.css';

// Demo events lookup
const DEMO_EVENTS = {
  'demo-1': {
    id: 'demo-1',
    title: 'Annual Tech Summit 2026',
    description: 'Join industry leaders for a day of innovation, networking, and cutting-edge tech talks. Featured speakers include top engineers from leading tech companies discussing AI, cloud computing, and the future of software development.\n\nTopics covered:\n• Artificial Intelligence & Machine Learning\n• Cloud-Native Architecture\n• Developer Experience & Tooling\n• Panel: The Future of Tech',
    date: '2026-05-15',
    startTime: '09:00',
    endTime: '18:00',
    location: 'San Francisco Convention Center',
    locationType: 'in-person',
    hostName: 'Demo User',
    hostId: 'demo-user-001',
    coverUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80',
    rsvps: { 'demo-user-001': 'yes', 'user-2': 'yes', 'user-3': 'yes', 'user-4': 'maybe' },
  },
  'demo-2': {
    id: 'demo-2',
    title: 'Design Systems Workshop',
    description: 'A hands-on workshop about building and maintaining scalable design systems. Learn how to create reusable components, establish design tokens, and build a coherent visual language for your product.\n\nWhat you\'ll learn:\n• Design tokens & theming\n• Component architecture\n• Accessibility best practices\n• Documentation strategies',
    date: '2026-05-20',
    startTime: '14:00',
    endTime: '17:00',
    location: 'https://meet.google.com/abc-xyz',
    locationType: 'virtual',
    hostName: 'Demo User',
    hostId: 'demo-user-001',
    coverUrl: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200&q=80',
    rsvps: { 'demo-user-001': 'yes', 'user-5': 'yes' },
  },
  'demo-3': {
    id: 'demo-3',
    title: 'Team Building & Networking Night',
    description: 'An evening of fun activities, great food, and making new connections. This casual event is perfect for meeting fellow professionals in a relaxed environment.\n\nWhat to expect:\n• Icebreaker activities\n• Gourmet catering & drinks\n• Live music\n• Networking sessions',
    date: '2026-06-01',
    startTime: '19:00',
    endTime: '22:00',
    location: 'Rooftop Lounge, 5th Avenue',
    locationType: 'in-person',
    hostName: 'Demo User',
    hostId: 'demo-user-001',
    coverUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&q=80',
    rsvps: { 'user-6': 'yes', 'user-7': 'maybe', 'user-8': 'yes', 'user-9': 'yes', 'user-10': 'no' },
  },
};

export default function EventDetailPage() {
  const { id } = useParams();
  const { user, demoMode } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rsvpLoading, setRsvpLoading] = useState(false);

  useEffect(() => {
    // Demo mode: load from static data
    if (demoMode || id.startsWith('demo-')) {
      const demoEvent = DEMO_EVENTS[id];
      if (demoEvent) setEvent({ ...demoEvent });
      setLoading(false);
      return;
    }

    try {
      const unsub = onSnapshot(doc(db, 'events', id), (snap) => {
        if (snap.exists()) {
          setEvent({ id: snap.id, ...snap.data() });
        }
        setLoading(false);
      });
      return unsub;
    } catch (err) {
      console.warn('Firestore not available');
      setLoading(false);
    }
  }, [id, demoMode]);

  const handleRsvp = async (value) => {
    if (!user || rsvpLoading) return;
    setRsvpLoading(true);

    if (demoMode || id.startsWith('demo-')) {
      // Demo mode: update state locally
      setEvent(prev => ({
        ...prev,
        rsvps: { ...prev.rsvps, [user.uid]: value }
      }));
      setRsvpLoading(false);
      return;
    }

    try {
      const eventRef = doc(db, 'events', id);
      await updateDoc(eventRef, {
        [`rsvps.${user.uid}`]: value,
      });
    } catch (err) {
      console.error('RSVP error:', err);
    }
    setRsvpLoading(false);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="app-background" />
        <div className="loading-screen">
          <div className="spinner" />
        </div>
      </>
    );
  }

  if (!event) {
    return (
      <>
        <Navbar />
        <div className="app-background" />
        <div className="loading-screen">
          <h2>Event not found</h2>
          <Link to="/" className="btn btn-primary">Back to Events</Link>
        </div>
      </>
    );
  }

  const rsvps = event.rsvps || {};
  const userRsvp = user ? rsvps[user.uid] || 'maybe' : 'maybe';
  const yesCount = Object.values(rsvps).filter(v => v === 'yes').length;
  const maybeCount = Object.values(rsvps).filter(v => v === 'maybe').length;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':');
    const hour = parseInt(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    return `${hour % 12 || 12}:${m} ${ampm}`;
  };

  const getHostInitials = () => {
    const name = event.hostName || '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';
  };

  const locationIcon = event.locationType === 'virtual' ? <HiOutlineGlobe /> : <HiOutlineLocationMarker />;

  return (
    <>
      <Navbar />
      <div className="app-background" />
      <div className="ambient-orb ambient-orb--purple" />
      <div className="ambient-orb ambient-orb--blue" />

      <div className="event-detail">
        {/* Hero */}
        <div className="event-detail__hero">
          {event.coverUrl && (
            <img src={event.coverUrl} alt="" className="event-detail__hero-img" />
          )}
          <div className="event-detail__hero-overlay" />
        </div>

        {/* Content */}
        <div className="event-detail__content">
          <div className="event-detail__main">
            <Link to="/" className="back-link">
              <HiOutlineArrowLeft /> Back to Events
            </Link>

            <div className="event-detail__date-chip">
              <HiOutlineCalendar />
              {formatDate(event.date)}
            </div>

            <h1 className="event-detail__title">{event.title}</h1>

            <div className="event-detail__host">
              <div className="event-detail__host-avatar">{getHostInitials()}</div>
              <div>
                <div className="event-detail__host-name">{event.hostName || 'Unknown'}</div>
                <div className="event-detail__host-label">Event Host</div>
              </div>
            </div>

            {/* Info Cards */}
            <div className="event-detail__info-grid">
              {event.date && (
                <div className="glass-panel event-detail__info-card">
                  <div className="event-detail__info-icon"><HiOutlineCalendar /></div>
                  <div>
                    <div className="event-detail__info-label">Date</div>
                    <div className="event-detail__info-value">{formatDate(event.date)}</div>
                  </div>
                </div>
              )}
              {event.startTime && (
                <div className="glass-panel event-detail__info-card">
                  <div className="event-detail__info-icon"><HiOutlineClock /></div>
                  <div>
                    <div className="event-detail__info-label">Time</div>
                    <div className="event-detail__info-value">
                      {formatTime(event.startTime)}
                      {event.endTime && ` — ${formatTime(event.endTime)}`}
                    </div>
                  </div>
                </div>
              )}
              {event.location && (
                <div className="glass-panel event-detail__info-card">
                  <div className="event-detail__info-icon">{locationIcon}</div>
                  <div>
                    <div className="event-detail__info-label">
                      {event.locationType === 'virtual' ? 'Online' : 'Location'}
                    </div>
                    <div className="event-detail__info-value">{event.location}</div>
                  </div>
                </div>
              )}
              <div className="glass-panel event-detail__info-card">
                <div className="event-detail__info-icon"><HiOutlineUserGroup /></div>
                <div>
                  <div className="event-detail__info-label">Attendees</div>
                  <div className="event-detail__info-value">
                    {yesCount} going{maybeCount > 0 && `, ${maybeCount} maybe`}
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            {event.description && (
              <div className="glass-panel event-detail__description">
                <h3>About this event</h3>
                <p>{event.description}</p>
              </div>
            )}
          </div>

          {/* Sidebar: RSVP */}
          <div className="event-detail__sidebar">
            <div className="glass-panel rsvp-panel">
              <h3>RSVP</h3>
              <RsvpToggle value={userRsvp} onChange={handleRsvp} />

              <div className={`rsvp-panel__status rsvp-panel__status--${userRsvp}`}>
                {userRsvp === 'yes' && "You're going! 🎉"}
                {userRsvp === 'maybe' && "You might attend 🤔"}
                {userRsvp === 'no' && "You can't make it 😔"}
              </div>

              {yesCount > 0 && (
                <div className="rsvp-panel__attendees">
                  <h4>{yesCount} {yesCount === 1 ? 'person' : 'people'} going</h4>
                  <div className="rsvp-panel__attendees-list">
                    {[...Array(Math.min(yesCount, 6))].map((_, i) => (
                      <div key={i} className="event-card__attendee-avatar" style={{ marginLeft: 0 }} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
