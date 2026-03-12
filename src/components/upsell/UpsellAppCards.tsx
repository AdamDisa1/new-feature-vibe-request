import React from 'react';
import { Plus, Sparkles, Star } from 'lucide-react';

interface UpsellAppCardsProps {
  onCreateWithAI: () => void;
}

const apps = [
  {
    name: 'Upsell.com ex ReCo',
    description: 'Upsell & cross sell at checkout for a bigger cart',
    rating: 4.3,
    emoji: '🛒',
    bgColor: '#6366F1',
  },
  {
    name: 'AppSell - Upsell & Cross-sell',
    description: 'Upsell and Cross-sell Bundles from Cart to Thank You page',
    rating: 4.8,
    emoji: '💰',
    bgColor: '#F97316',
  },
];

export function UpsellAppCards({ onCreateWithAI }: UpsellAppCardsProps) {
  return (
    <div className="space-y-2">
      {apps.map((app, i) => (
        <button
          key={i}
          className="w-full text-left rounded-lg p-3 flex items-start gap-3 transition-colors"
          style={{ border: '1px solid #e5e8ef', backgroundColor: '#ffffff' }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f7f8fa')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#ffffff')}
        >
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-lg"
            style={{ backgroundColor: app.bgColor }}
          >
            {app.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium truncate" style={{ color: '#16161d' }}>
                {app.name}
              </p>
              <div className="flex items-center gap-0.5 flex-shrink-0">
                <Star className="w-3 h-3" style={{ color: '#f59e0b', fill: '#f59e0b' }} />
                <span className="text-xs" style={{ color: '#6b7280' }}>{app.rating}</span>
              </div>
            </div>
            <p className="text-xs mt-0.5 truncate" style={{ color: '#6b7280' }}>
              {app.description}
            </p>
          </div>
        </button>
      ))}

      {/* AI Card — boxed like others with AI badge */}
      <button
        onClick={onCreateWithAI}
        className="w-full text-left rounded-lg p-3 flex items-start gap-3 transition-colors relative overflow-visible"
        style={{
          border: '1px solid #e5e8ef',
          backgroundColor: '#ffffff',
        }}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f7f8fa')}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#ffffff')}
      >
        {/* AI badge top-right */}
        <div
          className="absolute flex items-center justify-center"
          style={{
            top: -8,
            right: 10,
            width: 22,
            height: 22,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #7c6af5, #9b87f5)',
            boxShadow: '0 2px 6px rgba(124, 106, 245, 0.35)',
          }}
        >
          <Sparkles size={11} color="#fff" />
        </div>

        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: '#f0f0f5' }}
        >
          <Plus className="w-5 h-5" style={{ color: '#116dff' }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold" style={{ color: '#16161d' }}>
            Create upsell capability with AI
          </p>
          <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>
            A tailored bundle process to manage your recommendation rules in a dedicated dashboard page & show it to your customers
          </p>
        </div>
      </button>
    </div>
  );
}
