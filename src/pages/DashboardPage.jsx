import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import { HiOutlineCalendar, HiOutlineLocationMarker, HiOutlineClock, HiOutlinePlus } from 'react-icons/hi';
import '../styles/Dashboard.css';

// Sample events for demo mode
const DEMO_EVENTS = [
  {
    id: 'demo-1',
    title: 'Annual Tech Summit 2026',
    description: 'Join industry leaders for a day of innovation, networking, and cutting-edge tech talks.',
    date: '2026-05-15',
    startTime: '09:00',
    endTime: '18:00',
    location: 'San Francisco Convention Center',
    locationType: 'in-person',
    hostName: 'Demo User',
    hostId: 'demo-user-001',
    coverUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    rsvps: { 'demo-user-001': 'yes', 'user-2': 'yes', 'user-3': 'yes', 'user-4': 'maybe' },
  },
  {
    id: 'demo-2',
    title: 'Design Systems Workshop',
    description: 'A hands-on workshop about building and maintaining scalable design systems.',
    date: '2026-05-20',
    startTime: '14:00',
    endTime: '17:00',
    location: 'https://meet.google.com/abc-xyz',
    locationType: 'virtual',
    hostName: 'Demo User',
    hostId: 'demo-user-001',
    coverUrl: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&q=80',
    rsvps: { 'demo-user-001': 'yes', 'user-5': 'yes' },
  },
  {
    id: 'demo-3',
    title: 'Team Building & Networking Night',
    description: 'An evening of fun activities, great food, and making new connections.',
    date: '2026-06-01',
    startTime: '19:00',
    endTime: '22:00',
    location: 'Rooftop Lounge, 5th Avenue',
    locationType: 'in-person',
    hostName: 'Demo User',
    hostId: 'demo-user-001',
    coverUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80',
    rsvps: { 'user-6': 'yes', 'user-7': 'maybe', 'user-8': 'yes', 'user-9': 'yes', 'user-10': 'no' },
  },
];

export default function DashboardPage() {
  const { user, demoMode } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (demoMode) {
      // Load sample data in demo mode
      setEvents(DEMO_EVENTS);
      setLoading(false);
      return;
    }

    try {
      const q = query(collection(db, 'events'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const evts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEvents(evts);
        setLoading(false);
      }, (err) => {
        console.warn('Firestore error, switching to demo data:', err);
        setEvents(DEMO_EVENTS);
        setLoading(false);
      });
      return unsubscribe;
    } catch (err) {
      console.warn('Firestore not available, using demo data');
      setEvents(DEMO_EVENTS);
      setLoading(false);
    }
  }, [demoMode]);

  const formatDate = (dateStr) => {
    if (!dateStr) return { month: '', day: '', full: '' };
    const d = new Date(dateStr);
    return {
      month: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
      day: d.getDate(),
      full: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }),
    };
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':');
    const hour = parseInt(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    return `${hour % 12 || 12}:${m} ${ampm}`;
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const totalAttendees = events.reduce((sum, e) => {
    const rsvps = e.rsvps || {};
    return sum + Object.values(rsvps).filter(v => v === 'yes').length;
  }, 0);

  return (
    <>
      <Navbar />
      <div className="app-background" />
      <div className="ambient-orb ambient-orb--purple" />
      <div className="ambient-orb ambient-orb--blue" />

      <div className="dashboard">
        <div className="container">
          {/* Demo Banner */}
          {demoMode && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(108,99,255,0.15), rgba(0,212,255,0.1))',
              border: '1px solid rgba(108,99,255,0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 20px',
              marginTop: '80px',
              marginBottom: '-16px',
              textAlign: 'center',
              fontSize: '0.85rem',
              color: 'var(--color-text-secondary)',
            }}>
              🚀 <strong>Demo Mode</strong> — You're viewing sample data. Connect Firebase to go live!
            </div>
          )}

          {/* Header */}
          <div className="dashboard__header fade-in">
            <div className="dashboard__header-row">
              <div className="dashboard__greeting">
                <h1>{getGreeting()}, {user?.displayName || 'there'} 👋</h1>
                <p className="text-muted">Here's what's happening with your events.</p>
              </div>
              <Link to="/create" className="btn btn-primary">
                <HiOutlinePlus />
                Create Event
              </Link>
            </div>

            {/* Stats */}
            <div className="dashboard__stats">
              <div className="glass-panel stat-card">
                <div className="stat-card__value">{events.length}</div>
                <div className="stat-card__label">Total Events</div>
              </div>
              <div className="glass-panel stat-card">
                <div className="stat-card__value">
                  {events.filter(e => new Date(e.date) >= new Date()).length}
                </div>
                <div className="stat-card__label">Upcoming</div>
              </div>
              <div className="glass-panel stat-card">
                <div className="stat-card__value">{totalAttendees}</div>
                <div className="stat-card__label">Total Attendees</div>
              </div>
            </div>
          </div>

          {/* Event Grid */}
          <div className="dashboard__section-header">
            <h2>Your Events</h2>
          </div>

          {loading ? (
            <div className="loading-screen" style={{ minHeight: '40vh' }}>
              <div className="spinner" />
            </div>
          ) : events.length === 0 ? (
            <div className="empty-state glass-panel">
              <div className="empty-state__icon">📅</div>
              <h3>No events yet</h3>
              <p className="text-muted">Create your first event and start inviting guests!</p>
              <Link to="/create" className="btn btn-primary">
                <HiOutlinePlus />
                Create Your First Event
              </Link>
            </div>
          ) : (
            <div className="events-grid">
              {events.map((event, idx) => {
                const dateInfo = formatDate(event.date);
                const rsvps = event.rsvps || {};
                const yesCount = Object.values(rsvps).filter(v => v === 'yes').length;
                const userRsvp = user ? rsvps[user.uid] : null;

                return (
                  <Link
                    key={event.id}
                    to={`/event/${event.id}`}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <div
                      className="glass-panel event-card"
                      style={{ '--card-index': idx }}
                    >
                      <div className="event-card__cover">
                        {event.coverUrl ? (
                          <img src={event.coverUrl} alt="" className="event-card__cover-img" />
                        ) : null}
                        <div className="event-card__date-badge">
                          <div className="event-card__date-badge-month">{dateInfo.month}</div>
                          <div className="event-card__date-badge-day">{dateInfo.day}</div>
                        </div>
                      </div>
                      <div className="event-card__body">
                        <h3 className="event-card__title">{event.title}</h3>
                        <div className="event-card__meta">
                          {event.location && (
                            <span className="event-card__meta-item">
                              <HiOutlineLocationMarker /> {event.location}
                            </span>
                          )}
                          {event.startTime && (
                            <span className="event-card__meta-item">
                              <HiOutlineClock /> {formatTime(event.startTime)}
                              {event.endTime && ` — ${formatTime(event.endTime)}`}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="event-card__footer">
                        <div className="event-card__attendees">
                          {yesCount > 0 && (
                            <>
                              {[...Array(Math.min(yesCount, 3))].map((_, i) => (
                                <div key={i} className="event-card__attendee-avatar" />
                              ))}
                              <span className="event-card__attendee-count">
                                {yesCount} going
                              </span>
                            </>
                          )}
                        </div>
                        {userRsvp && (
                          <span className={`event-card__rsvp-badge event-card__rsvp-badge--${userRsvp}`}>
                            {userRsvp === 'yes' ? 'Going' : userRsvp === 'maybe' ? 'Maybe' : 'Not Going'}
                          </span>
                        )}
                      </div>
                    </div>
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
