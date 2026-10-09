import React, { useMemo } from 'react';
import { useStore } from '../context/StoreContext';

interface Particle {
  id: number;
  char: string;
  left: number; // percentage 0 - 100
  size: number; // font-size in px
  duration: number; // in seconds
  delay: number; // negative seconds for instant dispersal
  animType: 'animate-float-p1' | 'animate-float-p2' | 'animate-float-p3';
  opacity: number;
}

const EMOJI_PALETTE = [
  '💛', '⭐', '✨', '💖', '🌟', '💚', '💫', '🌿', '🧡', '🐪', '✨', '💛', '🌟', '🤍', '💖', '⭐', '🌿', '💫', '🧡', '✨', '💚', '💛', '🌟', '🐪', '💖', '⭐', '✨', '💛'
];

export const FloatingEmojisBackground: React.FC = () => {
  const { settings } = useStore();

  // Generate deterministic particles with randomized spread across screen
  const particles: Particle[] = useMemo(() => {
    const list: Particle[] = [];
    const count = 28;
    const animTypes: ('animate-float-p1' | 'animate-float-p2' | 'animate-float-p3')[] = [
      'animate-float-p1',
      'animate-float-p2',
      'animate-float-p3'
    ];

    for (let i = 0; i < count; i++) {
      const char = EMOJI_PALETTE[i % EMOJI_PALETTE.length];
      // Distribute evenly across full width of mobile & desktop
      const baseLeft = (i / count) * 94 + 3;
      const jitter = ((i * 19) % 9) - 4;
      const left = Math.min(96, Math.max(3, baseLeft + jitter));
      
      const size = 18 + ((i * 11) % 16); // 18px to 34px - visible and elegant
      const duration = 14 + ((i * 5) % 12); // 14s to 26s - smooth calm float
      const delay = -((i * 4.7) % duration); // Negative delay so screen is immediately filled at all heights!
      const animType = animTypes[i % animTypes.length];
      const opacity = 0.65 + ((i % 4) * 0.08); // 0.65 to 0.89 - clear, beautiful & visible

      list.push({
        id: i,
        char,
        left,
        size,
        duration,
        delay,
        animType,
        opacity
      });
    }
    return list;
  }, []);

  // If explicitly disabled in admin, return null
  const isEnabled = settings?.enableFloatingBackground !== false;
  if (!isEnabled) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 pointer-events-none overflow-hidden z-20 select-none"
      aria-hidden="true"
    >
      {particles.map((p) => (
        <div
          key={p.id}
          className={`absolute top-0 ${p.animType}`}
          style={{
            left: `${p.left}%`,
            fontSize: `${p.size}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            opacity: p.opacity,
            filter: 'drop-shadow(0 2px 8px rgba(245, 158, 11, 0.35))'
          }}
        >
          {p.char}
        </div>
      ))}
    </div>
  );
};

