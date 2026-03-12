import React, { useEffect, useRef, useCallback } from 'react';
import { useUpsellChat } from './UpsellChatContext';
import { UpsellSkeletonCart } from './UpsellSkeletonCart';
import CartPreview from './CartPreview';
import type { BuildStep } from './UpsellChatContext';

const WIDGET_BUILD_STEPS_DATA = [
  { id: 'w1', message: 'Setting up storefront widget scaffold...' },
  { id: 'w2', message: 'Connecting product recommendation engine...' },
  { id: 'w3', message: 'Styling widget to match site theme...' },
  { id: 'w4', message: 'Binding cart events to suggestion logic...' },
  { id: 'w5', message: 'Finalizing and publishing widget...' },
];

interface UpsellWidgetBuildViewProps {
  onBack: () => void;
  onBuildComplete: () => void;
}

export function UpsellWidgetBuildView({ onBack, onBuildComplete }: UpsellWidgetBuildViewProps) {
  const { setWidgetBuildSteps, setWidgetBuildDone, widgetBuildDone, setWidgetBuildPhase } = useUpsellChat();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentIndexRef = useRef(-1);
  const stepsRef = useRef<BuildStep[]>(
    WIDGET_BUILD_STEPS_DATA.map(step => ({ ...step, status: 'pending' as const })),
  );
  const showPreviewRef = useRef(false);
  const [showPreview, setShowPreviewLocal] = React.useState(false);

  const processNextStep = useCallback(() => {
    const idx = currentIndexRef.current;

    if (idx >= WIDGET_BUILD_STEPS_DATA.length) return;

    // Complete the current step
    if (idx >= 0) {
      stepsRef.current = stepsRef.current.map((step, i) =>
        i === idx ? { ...step, status: 'completed' as const } : step,
      );
      setWidgetBuildSteps([...stepsRef.current]);
    }

    const nextIdx = idx + 1;
    if (nextIdx < WIDGET_BUILD_STEPS_DATA.length) {
      timerRef.current = setTimeout(() => {
        currentIndexRef.current = nextIdx;
        stepsRef.current = stepsRef.current.map((step, i) =>
          i === nextIdx ? { ...step, status: 'active' as const } : step,
        );
        setWidgetBuildSteps([...stepsRef.current]);

        timerRef.current = setTimeout(() => {
          processNextStep();
        }, Math.random() * 1000 + 1500);
      }, idx < 0 ? 500 : 300);
    } else {
      // All steps done
      setWidgetBuildDone(true);
    }
  }, [setWidgetBuildSteps, setWidgetBuildDone]);

  // Kick off build
  useEffect(() => {
    setWidgetBuildPhase('building');
    stepsRef.current = WIDGET_BUILD_STEPS_DATA.map(step => ({ ...step, status: 'pending' as const }));
    setWidgetBuildSteps(stepsRef.current);
    processNextStep();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Transition from skeleton to cart preview after build completes
  useEffect(() => {
    if (widgetBuildDone && !showPreviewRef.current) {
      const timer = setTimeout(() => {
        showPreviewRef.current = true;
        setShowPreviewLocal(true);
        setWidgetBuildPhase('done');
        onBuildComplete();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [widgetBuildDone, setWidgetBuildPhase, onBuildComplete]);

  if (showPreview) {
    return <CartPreview />;
  }

  return <UpsellSkeletonCart />;
}
