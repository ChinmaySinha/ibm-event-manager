export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Deep navy base */}
      <div className="absolute inset-0 bg-[var(--color-bg-deep)]" />

      {/* Subtle radial gradients — ambient lighting */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 60% 50% at 15% 50%, rgba(61,214,200,0.04) 0%, transparent 70%),
            radial-gradient(ellipse 50% 60% at 85% 20%, rgba(124,91,245,0.05) 0%, transparent 70%),
            radial-gradient(ellipse 40% 40% at 50% 90%, rgba(61,214,200,0.03) 0%, transparent 70%)
          `,
        }}
      />

      {/* Vertical light bars */}
      <div
        className="absolute opacity-[0.03]"
        style={{
          top: 0, bottom: 0, left: '8%', width: '35%',
          background: `repeating-linear-gradient(
            90deg,
            rgba(124,91,245,0.4) 0px,
            rgba(61,214,200,0.2) 2px,
            transparent 3px,
            transparent 18px
          )`,
          filter: 'blur(1px)',
          maskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)',
        }}
      />

      {/* Large frosted sphere — right side */}
      <div
        className="absolute animate-[float_30s_ease-in-out_infinite]"
        style={{
          width: 600, height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 35%, rgba(124,91,245,0.06), rgba(61,214,200,0.03) 50%, transparent 70%)',
          top: '10%', right: '-10%',
          filter: 'blur(80px)',
        }}
      />

      {/* Teal glow — left */}
      <div
        className="absolute animate-[float_25s_ease-in-out_infinite]"
        style={{
          width: 500, height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(61,214,200,0.08), transparent 70%)',
          top: '20%', left: '-12%',
          filter: 'blur(120px)',
        }}
      />

      {/* Violet glow — bottom-center */}
      <div
        className="absolute animate-[glowPulse_3s_ease-in-out_infinite]"
        style={{
          width: 420, height: 420,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,91,245,0.08), transparent 70%)',
          bottom: '-15%', left: '30%',
          filter: 'blur(140px)',
          animationDelay: '-4s',
        }}
      />

      {/* Subtle blue glow — top-right */}
      <div
        className="absolute opacity-[0.06] animate-[float_35s_ease-in-out_infinite]"
        style={{
          width: 380, height: 380,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(61,214,200,0.5), transparent 70%)',
          top: '-5%', right: '15%',
          filter: 'blur(130px)',
          animationDelay: '-12s',
        }}
      />
    </div>
  );
}
