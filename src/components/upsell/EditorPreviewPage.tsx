import { useState, useEffect, useRef, useCallback } from 'react';
import { Sparkles, Check, Loader2 } from 'lucide-react';
import { UpsellChatProvider, useUpsellChat } from './UpsellChatContext';
import { BundleDashboardEditorView } from './BundleDashboardEditorView';
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
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentIndexRef = useRef(-1);
  const stepsRef = useRef<BuildStep[]>(
    WIDGET_BUILD_STEPS_DATA.map(step => ({ ...step, status: 'pending' as const })),
  );

  // Initialize context — show summary immediately, editor view from start
  useEffect(() => {
    ctx.setAppBuilt(true);
    ctx.setDashboardCreated(true);
    ctx.setSummaryMode(true);
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

  // Mark build phase done when all steps complete
  useEffect(() => {
    if (ctx.widgetBuildDone) {
      ctx.setWidgetBuildPhase('done');
    }
  }, [ctx.widgetBuildDone, ctx]);

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: '#f0f0f0' }}>
      {/* Wix Editor top bar */}
      <div
        className="flex items-center justify-between px-3 flex-shrink-0"
        style={{ height: 48, backgroundColor: '#ffffff', borderBottom: '1px solid #e5e8ef' }}
      >
        {/* Left: Design / Code tabs */}
        <div className="flex items-center gap-1">
          <button
            className="px-4 py-1.5 text-sm font-medium rounded"
            style={{ backgroundColor: '#f0f0f5', color: '#1a1a2e' }}
          >
            Design
          </button>
          <button
            className="px-4 py-1.5 text-sm font-medium rounded"
            style={{ color: '#7a7a8e' }}
          >
            Code
          </button>
          <div className="w-px h-5 mx-2" style={{ backgroundColor: '#e5e8ef' }} />
          <button className="w-8 h-8 rounded flex items-center justify-center" style={{ color: '#7a7a8e' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><circle cx="3" cy="8" r="1.5"/><circle cx="8" cy="8" r="1.5"/><circle cx="13" cy="8" r="1.5"/></svg>
          </button>
        </div>

        {/* Center: zoom + undo/redo */}
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-1 rounded" style={{ color: '#7a7a8e', backgroundColor: '#f5f5f7' }}>70%</span>
          <div className="w-px h-5 mx-1" style={{ backgroundColor: '#e5e8ef' }} />
          <button className="w-7 h-7 rounded flex items-center justify-center" style={{ color: '#b0b0be' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 10h4l3-7 4 14 3-7h4"/></svg>
          </button>
          <button className="w-7 h-7 rounded flex items-center justify-center" style={{ color: '#7a7a8e' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
          </button>
          <button className="w-7 h-7 rounded flex items-center justify-center" style={{ color: '#7a7a8e' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.13-9.36L23 10"/></svg>
          </button>
          <button className="w-7 h-7 rounded flex items-center justify-center" style={{ color: '#7a7a8e' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
        </div>

        {/* Right: Upgrade, Publish, Homepage, settings */}
        <div className="flex items-center gap-3">
          <button className="text-xs font-medium" style={{ color: '#116dff' }}>Upgrade</button>
          <button
            className="px-5 py-1.5 rounded text-xs font-semibold text-white"
            style={{ backgroundColor: '#116dff' }}
          >
            Publish
          </button>
          <div className="w-px h-5 mx-1" style={{ backgroundColor: '#e5e8ef' }} />
          <span className="text-xs font-medium" style={{ color: '#3b3b4f' }}>Homepage</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="#7a7a8e"><path d="M2 3.5l3 3 3-3"/></svg>
        </div>
      </div>

      {/* Editor body: canvas + chat */}
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-hidden">
          <BundleDashboardEditorView bundleLoading={!ctx.widgetBuildDone} />
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
