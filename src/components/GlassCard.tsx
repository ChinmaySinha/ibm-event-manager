import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export default function GlassCard({ children, className = '', hoverable = true, onClick, style }: GlassCardProps) {
  return (
    <div
      className={`${hoverable ? 'glass' : 'glass-static'} ${className}`}
      onClick={onClick}
      style={style}
    >
      {children}
    </div>
  );
}
