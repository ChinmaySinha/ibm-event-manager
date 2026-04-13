import { useState } from 'react';
import '../styles/RsvpToggle.css';

export default function RsvpToggle({ value, onChange }) {
  const [hovered, setHovered] = useState(null);

  const options = ['yes', 'maybe', 'no'];
  const icons = { yes: '✓', maybe: '?', no: '✕' };

  return (
    <div className="rsvp-toggle">
      <div className="rsvp-toggle__track">
        {/* Glow */}
        <div className={`rsvp-toggle__glow rsvp-toggle__glow--${value}`} />

        {/* Sliding Knob */}
        <div className={`rsvp-toggle__knob rsvp-toggle__knob--${value}`}>
          {icons[value]}
        </div>

        {/* Click Zones */}
        {options.map((opt) => (
          <div
            key={opt}
            className={`rsvp-toggle__zone rsvp-toggle__zone--${opt}`}
            onClick={() => onChange(opt)}
            onMouseEnter={() => setHovered(opt)}
            onMouseLeave={() => setHovered(null)}
          />
        ))}
      </div>

      {/* Side Labels */}
      <div className="rsvp-toggle__labels">
        {options.map((opt) => (
          <span
            key={opt}
            className={`rsvp-toggle__label ${value === opt ? 'rsvp-toggle__label--active' : ''}`}
            onClick={() => onChange(opt)}
          >
            {opt === 'yes' ? 'Going' : opt === 'maybe' ? 'Maybe' : 'Can\'t Go'}
          </span>
        ))}
      </div>
    </div>
  );
}
