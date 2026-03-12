import { useMemo } from 'react';
import { Star } from 'lucide-react';

function Bone({
  width,
  height,
  borderRadius,
  style,
  className,
  delay,
}: {
  width: number | string;
  height: number | string;
  borderRadius?: number | string;
  style?: React.CSSProperties;
  className?: string;
  delay?: number;
}) {
  return (
    <div
      className={`skeleton-bone ${className ?? ''}`}
      style={{
        width,
        height,
        borderRadius: borderRadius ?? 6,
        flexShrink: 0,
        animationDelay: delay ? `${delay}s` : undefined,
        ...style,
      }}
    />
  );
}

function BoneCircle({ size, style, delay }: { size: number; style?: React.CSSProperties; delay?: number }) {
  return (
    <div
      className="skeleton-bone"
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        flexShrink: 0,
        animationDelay: delay ? `${delay}s` : undefined,
        ...style,
      }}
    />
  );
}

function Sparkle({ top, left, size, delay }: { top: string; left: string; size: number; delay: number }) {
  return (
    <div
      className="skeleton-sparkle"
      style={{
        position: 'absolute',
        top,
        left,
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: '#6c8dfa',
        pointerEvents: 'none',
        animationDelay: `${delay}s`,
      }}
    />
  );
}

function CartItemSkeleton({ delayBase }: { delayBase: number }) {
  return (
    <div
      className="flex items-center gap-4 p-4 rounded-xl"
      style={{ backgroundColor: '#ffffff', border: '1px solid #e5e8ef' }}
    >
      <Bone width={80} height={80} borderRadius={8} delay={delayBase} />
      <div className="flex-1 flex flex-col gap-2">
        <Bone width="70%" height={14} delay={delayBase + 0.05} />
        <Bone width={50} height={10} delay={delayBase + 0.1} />
        <div className="flex items-center gap-3 mt-1">
          <BoneCircle size={28} delay={delayBase + 0.15} />
          <Bone width={20} height={12} delay={delayBase + 0.18} />
          <BoneCircle size={28} delay={delayBase + 0.2} />
        </div>
      </div>
      <Bone width={60} height={16} delay={delayBase + 0.12} />
    </div>
  );
}

function SuggestedProductSkeleton({ delayBase }: { delayBase: number }) {
  return (
    <div className="rounded-lg p-3" style={{ border: '1px solid #e5e8ef', backgroundColor: '#ffffff' }}>
      <Bone width={60} height={16} borderRadius={10} delay={delayBase} />
      <div className="mt-2 mb-2">
        <Bone width="100%" height={64} borderRadius={4} delay={delayBase + 0.05} />
      </div>
      <Bone width="80%" height={12} delay={delayBase + 0.1} />
      <div className="flex items-center gap-1 mt-1.5">
        <Bone width={12} height={12} delay={delayBase + 0.13} />
        <Bone width={24} height={10} delay={delayBase + 0.15} />
      </div>
      <div className="flex items-center gap-2 mt-1.5">
        <Bone width={50} height={14} delay={delayBase + 0.18} />
        <Bone width={40} height={10} delay={delayBase + 0.2} />
      </div>
      <Bone width="100%" height={28} borderRadius={4} delay={delayBase + 0.23} style={{ marginTop: 8 }} />
    </div>
  );
}

export function UpsellSkeletonCart() {
  const sparkles = useMemo(
    () => [
      { top: '6%', left: '50%', size: 4, delay: 0 },
      { top: '10%', left: '75%', size: 3, delay: 0.6 },
      { top: '20%', left: '20%', size: 5, delay: 1.2 },
      { top: '30%', left: '85%', size: 4, delay: 0.3 },
      { top: '42%', left: '12%', size: 3, delay: 1.8 },
      { top: '55%', left: '60%', size: 6, delay: 0.9 },
      { top: '62%', left: '80%', size: 4, delay: 1.5 },
      { top: '72%', left: '30%', size: 5, delay: 0.4 },
      { top: '78%', left: '90%', size: 3, delay: 2.0 },
      { top: '88%', left: '15%', size: 4, delay: 1.1 },
      { top: '92%', left: '55%', size: 5, delay: 0.7 },
      { top: '35%', left: '45%', size: 3, delay: 1.6 },
    ],
    [],
  );

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden" style={{ backgroundColor: '#f0f4f7' }}>
      {sparkles.map((s, i) => (
        <Sparkle key={i} top={s.top} left={s.left} size={s.size} delay={s.delay} />
      ))}

      {/* Fake WIX Top Bar */}
      <div
        className="flex items-center justify-between px-6 flex-shrink-0 border-b"
        style={{ height: 56, backgroundColor: '#ffffff', borderColor: '#e3e8ed' }}
      >
        <div className="flex items-center gap-3">
          <Bone width={40} height={20} borderRadius={2} delay={0} />
          <div className="w-px h-5" style={{ background: '#e5e8ef' }} />
          <Bone width={160} height={14} delay={0.05} />
        </div>
        <Bone width={100} height={24} borderRadius={12} delay={0.08} />
      </div>

      {/* AI Status Pill */}
      <div className="flex justify-center py-4 flex-shrink-0">
        <div
          className="skeleton-pill flex items-center gap-2 px-5 py-2"
          style={{ borderRadius: 20, background: 'linear-gradient(135deg, #3B6CF5, #7B5CF5)' }}
        >
          <span className="skeleton-star inline-flex">
            <Star className="w-4 h-4" style={{ color: '#ffffff', fill: '#ffffff' }} />
          </span>
          <span className="text-sm font-medium" style={{ color: '#ffffff' }}>
            AI is creating your widget...
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 py-6">
          {/* "Your Cart" title */}
          <Bone width={140} height={24} delay={0.1} style={{ marginBottom: 24 }} />

          <div className="flex gap-8">
            {/* Left: Cart items + upsell widget */}
            <div className="flex-1 space-y-4">
              <CartItemSkeleton delayBase={0.15} />
              <CartItemSkeleton delayBase={0.3} />

              {/* Upsell widget skeleton */}
              <div
                className="p-5 rounded-xl mt-6"
                style={{ backgroundColor: '#ffffff', border: '1px solid #e5e8ef' }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Bone width={16} height={16} borderRadius={4} delay={0.45} />
                  <Bone width={130} height={14} delay={0.48} />
                  <Bone width={70} height={18} borderRadius={10} delay={0.5} />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <SuggestedProductSkeleton delayBase={0.55} />
                  <SuggestedProductSkeleton delayBase={0.7} />
                  <SuggestedProductSkeleton delayBase={0.85} />
                </div>
              </div>
            </div>

            {/* Right: Order summary */}
            <div className="w-80 flex-shrink-0">
              <div className="rounded-xl p-5" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e8ef' }}>
                <Bone width={120} height={16} delay={0.4} style={{ marginBottom: 16 }} />
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <Bone width={100} height={12} delay={0.45} />
                    <Bone width={60} height={12} delay={0.48} />
                  </div>
                  <div className="flex justify-between">
                    <Bone width={60} height={12} delay={0.5} />
                    <Bone width={30} height={12} delay={0.52} />
                  </div>
                  <div className="h-px" style={{ backgroundColor: '#e5e8ef' }} />
                  <div className="flex justify-between">
                    <Bone width={40} height={14} delay={0.55} />
                    <Bone width={70} height={18} delay={0.58} />
                  </div>
                </div>
                <Bone width="100%" height={44} borderRadius={8} delay={0.6} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
