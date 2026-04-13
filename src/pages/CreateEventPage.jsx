import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import {
  HiOutlineCalendar,
  HiOutlineLocationMarker,
  HiOutlineGlobe,
  HiOutlinePhotograph,
  HiOutlineTicket,
  HiOutlineUserGroup,
  HiOutlineArrowLeft,
} from 'react-icons/hi';
import '../styles/CreateEvent.css';

export default function CreateEventPage() {
  const { user, demoMode } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    locationType: 'in-person',
    coverUrl: '',
    maxAttendees: '',
    ticketPrice: 'Free',
    requireApproval: false,
    visibility: 'public',
  });

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.date) return;
    setLoading(true);

    if (demoMode) {
      // Demo mode — simulate event creation
      const fakeId = 'demo-' + Date.now();
      setLoading(false);
      navigate(`/event/${fakeId}`);
      return;
    }

    try {
      const docRef = await addDoc(collection(db, 'events'), {
        ...form,
        maxAttendees: form.maxAttendees ? parseInt(form.maxAttendees) : null,
        hostId: user.uid,
        hostName: user.displayName || user.email,
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

  // Format date for display
  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  // Get current timezone
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone?.split('/').pop() || 'Local';
  const gmtOffset = (() => {
    const offset = new Date().getTimezoneOffset();
    const h = Math.floor(Math.abs(offset) / 60);
    const m = Math.abs(offset) % 60;
    return `GMT${offset <= 0 ? '+' : '-'}${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  })();

  return (
    <>
      <Navbar />
      <div className="app-background" />
      <div className="ambient-orb ambient-orb--purple" />
      <div className="ambient-orb ambient-orb--blue" />

      <div className="create-event">
        <div className="create-event__inner">
          {/* Back button */}
          <button className="create-event__back" type="button" onClick={() => navigate('/')}>
            <HiOutlineArrowLeft />
          </button>

          <form className="create-event__layout" onSubmit={handleSubmit}>
            {/* LEFT: Cover Image */}
            <div className="create-event__cover-col">
              <div
                className="create-event__cover"
                onClick={() => {
                  const url = prompt('Enter image URL for event cover:');
                  if (url) update('coverUrl', url);
                }}
              >
                {form.coverUrl ? (
                  <img src={form.coverUrl} alt="Cover" className="create-event__cover-img" />
                ) : (
                  <div className="create-event__cover-placeholder">
                    <HiOutlinePhotograph />
                    <span>Upload Cover</span>
                  </div>
                )}
                <div className="create-event__cover-edit">
                  <HiOutlinePhotograph />
                </div>
              </div>
            </div>

            {/* RIGHT: Form Fields */}
            <div className="create-event__form-col">
              {/* Visibility row */}
              <div className="create-event__top-row">
                <button
                  type="button"
                  className={`create-event__chip ${form.visibility === 'public' ? 'create-event__chip--active' : ''}`}
                  onClick={() => update('visibility', form.visibility === 'public' ? 'private' : 'public')}
                >
                  <HiOutlineGlobe />
                  {form.visibility === 'public' ? 'Public' : 'Private'}
                </button>
              </div>

              {/* Event Name — large editable title */}
              <input
                className="create-event__title-input"
                type="text"
                placeholder="Event Name"
                value={form.title}
                onChange={(e) => update('title', e.target.value)}
                required
              />

              {/* Date & Time Row — Luma style */}
              <div className="create-event__datetime glass-panel glass-panel--no-hover">
                <div className="create-event__datetime-row">
                  <div className="create-event__datetime-dot create-event__datetime-dot--start" />
                  <span className="create-event__datetime-label">Start</span>
                  <input
                    type="date"
                    className="create-event__datetime-input"
                    value={form.date}
                    onChange={(e) => update('date', e.target.value)}
                    required
                  />
                  <input
                    type="time"
                    className="create-event__datetime-input create-event__datetime-input--time"
                    value={form.startTime}
                    onChange={(e) => update('startTime', e.target.value)}
                  />
                  <div className="create-event__timezone">
                    <HiOutlineGlobe />
                    <div>
                      <div className="create-event__timezone-offset">{gmtOffset}</div>
                      <div className="create-event__timezone-name">{timezone}</div>
                    </div>
                  </div>
                </div>
                <div className="create-event__datetime-divider" />
                <div className="create-event__datetime-row">
                  <div className="create-event__datetime-dot create-event__datetime-dot--end" />
                  <span className="create-event__datetime-label">End</span>
                  <input
                    type="date"
                    className="create-event__datetime-input"
                    value={form.date}
                    readOnly
                    tabIndex={-1}
                  />
                  <input
                    type="time"
                    className="create-event__datetime-input create-event__datetime-input--time"
                    value={form.endTime}
                    onChange={(e) => update('endTime', e.target.value)}
                  />
                </div>
              </div>

              {/* Location */}
              <div
                className="create-event__field-row glass-panel glass-panel--no-hover"
                onClick={() => {
                  const loc = prompt(
                    form.locationType === 'virtual'
                      ? 'Enter meeting link:'
                      : 'Enter venue address:',
                    form.location
                  );
                  if (loc !== null) update('location', loc);
                }}
              >
                <HiOutlineLocationMarker className="create-event__field-icon" />
                <div className="create-event__field-content">
                  <div className="create-event__field-title">
                    {form.location || 'Add Event Location'}
                  </div>
                  <div className="create-event__field-sub">Offline location or virtual link</div>
                </div>
                <select
                  className="create-event__mini-select"
                  value={form.locationType}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => update('locationType', e.target.value)}
                >
                  <option value="in-person">In-Person</option>
                  <option value="virtual">Virtual</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>

              {/* Description */}
              <div className="create-event__field-row glass-panel glass-panel--no-hover" style={{ cursor: 'default' }}>
                <div style={{ width: '100%' }}>
                  <textarea
                    className="create-event__desc-input"
                    placeholder="Add Description"
                    value={form.description}
                    onChange={(e) => update('description', e.target.value)}
                  />
                </div>
              </div>

              {/* Event Options */}
              <div className="create-event__options-title">Event Options</div>

              <div className="create-event__options glass-panel glass-panel--no-hover">
                <div className="create-event__option-row">
                  <HiOutlineTicket className="create-event__option-icon" />
                  <span className="create-event__option-label">Ticket Price</span>
                  <span className="create-event__option-value">{form.ticketPrice}</span>
                </div>
                <div className="create-event__option-divider" />
                <div className="create-event__option-row">
                  <HiOutlineUserGroup className="create-event__option-icon" />
                  <span className="create-event__option-label">Require Approval</span>
                  <label className="create-event__toggle">
                    <input
                      type="checkbox"
                      checked={form.requireApproval}
                      onChange={(e) => update('requireApproval', e.target.checked)}
                    />
                    <span className="create-event__toggle-slider" />
                  </label>
                </div>
                <div className="create-event__option-divider" />
                <div className="create-event__option-row">
                  <HiOutlineUserGroup className="create-event__option-icon" />
                  <span className="create-event__option-label">Capacity</span>
                  <input
                    type="text"
                    className="create-event__option-input"
                    placeholder="Unlimited"
                    value={form.maxAttendees}
                    onChange={(e) => update('maxAttendees', e.target.value)}
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                className="btn btn-primary create-event__submit"
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
