import { useState, useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';
import CartPreview from './CartPreview';

// ── Harmony Loader ──────────────────────────────────────────────────────────

function HarmonyLoader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'finishing' | 'done'>('loading');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setPhase('finishing');
          return 100;
        }
        // Slow down near the end for realism
        const increment = prev < 60 ? Math.random() * 4 + 2 : prev < 85 ? Math.random() * 2 + 0.5 : Math.random() * 1.5 + 0.3;
        return Math.min(prev + increment, 100);
      });
    }, 80);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (phase === 'finishing') {
      const timer = setTimeout(() => {
        setPhase('done');
        setTimeout(onComplete, 400);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [phase, onComplete]);

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center z-50"
      style={{
        background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 40%, #0d0d2b 100%)',
        opacity: phase === 'done' ? 0 : 1,
        transition: 'opacity 0.4s ease-out',
      }}
    >
      {/* Floating particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 4 + 2,
            height: Math.random() * 4 + 2,
            backgroundColor: `rgba(${100 + Math.random() * 100}, ${120 + Math.random() * 135}, 255, ${0.15 + Math.random() * 0.3})`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `harmony-float ${3 + Math.random() * 4}s ease-in-out ${Math.random() * 2}s infinite alternate`,
          }}
        />
      ))}

      {/* Glow ring behind logo */}
      <div
        className="absolute rounded-full"
        style={{
          width: 300,
          height: 300,
          background: 'radial-gradient(circle, rgba(17,109,255,0.15) 0%, transparent 70%)',
          animation: 'harmony-pulse-ring 3s ease-in-out infinite',
        }}
      />

      {/* Logo area */}
      <div className="relative flex flex-col items-center gap-6 z-10">
        {/* Harmony icon */}
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #116dff, #6c5ce7)',
            boxShadow: '0 0 40px rgba(17,109,255,0.4), 0 0 80px rgba(108,92,231,0.2)',
            animation: 'harmony-icon-glow 2s ease-in-out infinite',
          }}
        >
          <Sparkles className="w-8 h-8" style={{ color: '#ffffff' }} />
        </div>

        {/* Brand text */}
        <div className="text-center">
          <h1
            className="text-3xl font-bold tracking-wide"
            style={{
              color: '#ffffff',
              letterSpacing: '0.15em',
              textShadow: '0 0 30px rgba(17,109,255,0.5)',
            }}
          >
            Harmony
          </h1>
          <p
            className="text-sm mt-2 font-medium"
            style={{ color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em' }}
          >
            Loading your site preview
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-64 mt-4">
          <div
            className="w-full h-1 rounded-full overflow-hidden"
            style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
          >
            <div
              className="h-full rounded-full transition-all duration-100 ease-out"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #116dff, #6c5ce7, #a855f7)',
                boxShadow: '0 0 12px rgba(17,109,255,0.6)',
              }}
            />
          </div>
          <p
            className="text-xs text-center mt-3 font-medium"
            style={{ color: 'rgba(255,255,255,0.4)' }}
          >
            {progress < 30 && 'Connecting to your site...'}
            {progress >= 30 && progress < 60 && 'Loading storefront components...'}
            {progress >= 60 && progress < 85 && 'Rendering product suggestions...'}
            {progress >= 85 && progress < 100 && 'Almost there...'}
            {progress >= 100 && 'Ready!'}
          </p>
        </div>
      </div>

      <style>{`
        @keyframes harmony-float {
          from { transform: translateY(0) translateX(0); }
          to   { transform: translateY(-20px) translateX(10px); }
        }
        @keyframes harmony-pulse-ring {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50%      { transform: scale(1.15); opacity: 1; }
        }
        @keyframes harmony-icon-glow {
          0%, 100% { box-shadow: 0 0 40px rgba(17,109,255,0.4), 0 0 80px rgba(108,92,231,0.2); }
          50%      { box-shadow: 0 0 60px rgba(17,109,255,0.6), 0 0 120px rgba(108,92,231,0.35); }
        }
      `}</style>
    </div>
  );
}

// ── Main Preview Page ───────────────────────────────────────────────────────

export function UpsellPreviewPage() {
  const [loaded, setLoaded] = useState(false);

  if (!loaded) {
    return <HarmonyLoader onComplete={() => setLoaded(true)} />;
  }

  return <CartPreview />;
}
