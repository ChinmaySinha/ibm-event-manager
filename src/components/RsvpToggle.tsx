import { useState } from 'react';

interface RsvpToggleProps {
  value: 'yes' | 'maybe' | 'no';
  onChange: (val: 'yes' | 'maybe' | 'no') => void;
}

const options: Array<'yes' | 'maybe' | 'no'> = ['yes', 'maybe', 'no'];
const icons: Record<string, string> = { yes: '✓', maybe: '?', no: '✕' };
const labels: Record<string, string> = { yes: 'Going', maybe: 'Maybe', no: "Can't Go" };

const knobColors: Record<string, string> = {
  yes: 'bg-gradient-to-br from-emerald-400 to-emerald-600',
  maybe: 'bg-gradient-to-br from-amber-400 to-amber-600',
  no: 'bg-gradient-to-br from-red-400 to-red-600',
};

const glowColors: Record<string, string> = {
  yes: 'bg-emerald-400',
  maybe: 'bg-amber-400',
  no: 'bg-red-400',
};

const knobPositions: Record<string, string> = {
  yes: 'top-[3px]',
  maybe: 'top-[53px]',
  no: 'top-[103px]',
};

export default function RsvpToggle({ value, onChange }: RsvpToggleProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-center relative w-20 mx-auto">
      <div className="w-[52px] h-[152px] bg-white/[0.04] border border-white/8 rounded-[26px] relative cursor-pointer overflow-hidden transition-all duration-300 hover:border-white/[0.14] hover:bg-white/[0.06]">
        {/* Glow */}
        <div
          className={`absolute w-[46px] h-[46px] rounded-full ${glowColors[value]} ${knobPositions[value]} left-[3px] blur-[18px] opacity-30 transition-all duration-[400ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] z-0`}
        />

        {/* Knob */}
        <div
          className={`absolute left-[3px] w-[46px] h-[46px] rounded-full ${knobColors[value]} ${knobPositions[value]} flex items-center justify-center text-base font-bold shadow-[0_4px_20px_rgba(0,0,0,0.35)] z-[2] transition-all duration-[400ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] text-white`}
        >
          {icons[value]}
        </div>

        {/* Click zones */}
        {options.map((opt, i) => (
          <div
            key={opt}
            className="absolute left-0 w-full h-[33.33%] cursor-pointer z-[1]"
            style={{ top: `${i * 33.33}%` }}
            onClick={() => onChange(opt)}
            onMouseEnter={() => setHovered(opt)}
            onMouseLeave={() => setHovered(null)}
          />
        ))}
      </div>

      {/* Side labels */}
      <div className="absolute left-[68px] top-0 h-[152px] flex flex-col justify-between py-3.5">
        {options.map((opt) => (
          <span
            key={opt}
            className={`text-xs font-semibold cursor-pointer transition-all duration-200 whitespace-nowrap
              ${value === opt ? 'text-[var(--color-cream)]' : 'text-[var(--color-cream-faint)] hover:text-[var(--color-cream)]'}
            `}
            onClick={() => onChange(opt)}
          >
            {labels[opt]}
          </span>
        ))}
      </div>
    </div>
  );
}
