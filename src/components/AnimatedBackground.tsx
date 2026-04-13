export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-[var(--color-emerald-deep)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(45,212,160,0.06)_0%,transparent_60%),radial-gradient(ellipse_at_80%_100%,rgba(201,168,76,0.04)_0%,transparent_60%)]" />

      {/* Floating orbs */}
      <div
        className="absolute rounded-full opacity-10 animate-[float_25s_ease-in-out_infinite]"
        style={{
          width: 520, height: 520,
          background: 'radial-gradient(circle, rgba(45,212,160,0.6), transparent 70%)',
          top: '-18%', right: '-12%',
          filter: 'blur(120px)',
        }}
      />
      <div
        className="absolute rounded-full opacity-10 animate-[float_30s_ease-in-out_infinite]"
        style={{
          width: 440, height: 440,
          background: 'radial-gradient(circle, rgba(13,148,136,0.5), transparent 70%)',
          bottom: '-22%', left: '-14%',
          filter: 'blur(140px)',
          animationDelay: '-8s',
        }}
      />
      <div
        className="absolute rounded-full animate-[glowPulse_3s_ease-in-out_infinite]"
        style={{
          width: 380, height: 380,
          background: 'radial-gradient(circle, rgba(201,168,76,0.4), transparent 70%)',
          bottom: '15%', right: '8%',
          filter: 'blur(150px)',
          animationDelay: '-4s',
        }}
      />
      <div
        className="absolute rounded-full opacity-[0.06] animate-[float_35s_ease-in-out_infinite]"
        style={{
          width: 300, height: 300,
          background: 'radial-gradient(circle, rgba(45,212,160,0.5), transparent 70%)',
          top: '40%', left: '30%',
          filter: 'blur(130px)',
          animationDelay: '-15s',
        }}
      />
    </div>
  );
}
