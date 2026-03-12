import { useState, useEffect, useRef, useCallback } from 'react';
import { Sparkles, Check, Loader2 } from 'lucide-react';
import { UpsellChatProvider, useUpsellChat } from './UpsellChatContext';
import { UpsellSkeletonCart } from './UpsellSkeletonCart';
import CartPreview from './CartPreview';
import WixTopBar from '../WixTopBar';
import WixSidebar from '../WixSidebar';
import ChatAssistant from '../ChatAssistant';
import type { BuildStep } from './UpsellChatContext';

// ── Editor Harmony Loader ────────────────────────────────────────────────────

function EditorHarmonyLoader({ onComplete }: { onComplete: () => void }) {
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
        const increment = prev < 60 ? Math.random() * 3 + 1.5 : prev < 85 ? Math.random() * 1.5 + 0.4 : Math.random() * 1 + 0.2;
        return Math.min(prev + increment, 100);
      });
    }, 100);

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

      <div
        className="absolute rounded-full"
        style={{
          width: 300,
          height: 300,
          background: 'radial-gradient(circle, rgba(17,109,255,0.15) 0%, transparent 70%)',
          animation: 'harmony-pulse-ring 3s ease-in-out infinite',
        }}
      />

      <div className="relative flex flex-col items-center gap-6 z-10">
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
            Loading your Editor
          </p>
        </div>

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
            {progress < 30 && 'Connecting to Editor...'}
            {progress >= 30 && progress < 60 && 'Loading site components...'}
            {progress >= 60 && progress < 85 && 'Preparing widget builder...'}
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

// ── Widget Build Steps Data ──────────────────────────────────────────────────

const WIDGET_BUILD_STEPS_DATA = [
  { id: 'w1', message: 'Setting up storefront widget scaffold...' },
  { id: 'w2', message: 'Connecting product recommendation engine...' },
  { id: 'w3', message: 'Styling widget to match site theme...' },
  { id: 'w4', message: 'Binding cart events to suggestion logic...' },
  { id: 'w5', message: 'Finalizing and publishing widget...' },
];

// ── Editor Content (after loader) ────────────────────────────────────────────

function EditorContent() {
  const ctx = useUpsellChat();
  const [showPreview, setShowPreview] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentIndexRef = useRef(-1);
  const stepsRef = useRef<BuildStep[]>(
    WIDGET_BUILD_STEPS_DATA.map(step => ({ ...step, status: 'pending' as const })),
  );

  // Initialize context to post-build state
  useEffect(() => {
    ctx.setAppBuilt(true);
    ctx.setDashboardCreated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Widget build step progression
  const processNextStep = useCallback(() => {
    const idx = currentIndexRef.current;
    if (idx >= WIDGET_BUILD_STEPS_DATA.length) return;

    if (idx >= 0) {
      stepsRef.current = stepsRef.current.map((step, i) =>
        i === idx ? { ...step, status: 'completed' as const } : step,
      );
      ctx.setWidgetBuildSteps([...stepsRef.current]);
    }

    const nextIdx = idx + 1;
    if (nextIdx < WIDGET_BUILD_STEPS_DATA.length) {
      timerRef.current = setTimeout(() => {
        currentIndexRef.current = nextIdx;
        stepsRef.current = stepsRef.current.map((step, i) =>
          i === nextIdx ? { ...step, status: 'active' as const } : step,
        );
        ctx.setWidgetBuildSteps([...stepsRef.current]);

        timerRef.current = setTimeout(() => {
          processNextStep();
        }, Math.random() * 1000 + 1500);
      }, idx < 0 ? 500 : 300);
    } else {
      ctx.setWidgetBuildDone(true);
    }
  }, [ctx]);

  // Kick off widget build
  useEffect(() => {
    ctx.setWidgetBuildPhase('building');
    stepsRef.current = WIDGET_BUILD_STEPS_DATA.map(step => ({ ...step, status: 'pending' as const }));
    ctx.setWidgetBuildSteps(stepsRef.current);
    processNextStep();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Transition skeleton → cart preview after build completes
  useEffect(() => {
    if (ctx.widgetBuildDone && !showPreview) {
      const timer = setTimeout(() => {
        setShowPreview(true);
        ctx.setWidgetBuildPhase('done');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [ctx.widgetBuildDone, showPreview, ctx]);

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: '#f7f8fa' }}>
      <WixTopBar isAIPanelOpen={true} />

      <div className="flex flex-1 overflow-hidden">
        <WixSidebar
          currentPage="creations"
          onNavigate={() => {}}
          buildingMode={null}
          showBundleDashboard={true}
        />

        <main className="flex-1 overflow-hidden">
          {showPreview ? <CartPreview /> : <UpsellSkeletonCart />}
        </main>

        <ChatAssistant
          isOpen={true}
          onClose={() => {}}
          forceUpsellFlow={true}
          onNavigate={() => {}}
        />
      </div>
    </div>
  );
}

// ── Main Export ──────────────────────────────────────────────────────────────

export function EditorPreviewPage() {
  const [loaded, setLoaded] = useState(false);

  return (
    <UpsellChatProvider>
      {!loaded ? (
        <EditorHarmonyLoader onComplete={() => setLoaded(true)} />
      ) : (
        <EditorContent />
      )}
    </UpsellChatProvider>
  );
}
