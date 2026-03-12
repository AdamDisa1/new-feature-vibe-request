import React, { useState } from 'react';
import {
  MoreHorizontal,
  Pencil,
  ExternalLink,
  Settings,
  ChevronDown,
  ChevronUp,
  Plus,
  Sparkles,
  Info,
} from 'lucide-react';

const MiniSparkline: React.FC<{ color?: string }> = ({ color = '#116dff' }) => (
  <svg width="60" height="24" viewBox="0 0 60 24">
    <polyline
      points="0,20 10,18 20,16 30,17 40,14 50,15 60,12"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={0.35}
    />
  </svg>
);

const HomePage: React.FC = () => {
  const [reachExpanded, setReachExpanded] = useState(true);

  return (
    <div
      className="h-full overflow-y-auto"
      style={{ background: '#f7f8fa' }}
    >
      <div className="max-w-[1100px] mx-auto px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-[22px] font-bold" style={{ color: '#1a1a2e' }}>
            Welcome back, ssf
          </h1>
          <div className="flex items-center gap-2">
            <button
              className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
              style={{ border: '1px solid #dfe3e8', background: '#fff' }}
            >
              <MoreHorizontal size={16} style={{ color: '#32325d' }} />
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-medium transition-colors"
              style={{ border: '1px solid #dfe3e8', background: '#fff', color: '#32325d' }}
            >
              <Pencil size={14} />
              Edit Site
            </button>
          </div>
        </div>

        {/* Site Info Bar */}
        <div
          className="rounded-xl mb-6 flex items-center px-5 py-3.5 gap-5"
          style={{ background: '#fff', border: '1px solid #e5e8ef' }}
        >
          {/* Thumbnail */}
          <div
            className="w-14 h-10 rounded-lg flex-shrink-0 overflow-hidden"
            style={{ background: '#e5e8ef', border: '1px solid #dfe3e8' }}
          >
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-8 h-6 rounded" style={{ background: '#c4c9d4' }} />
            </div>
          </div>

          {/* Free plan */}
          <div className="flex flex-col" style={{ borderRight: '1px solid #e5e8ef', paddingRight: 20 }}>
            <span className="text-[13px] font-medium" style={{ color: '#32325d' }}>Free plan</span>
            <span className="text-[12px] cursor-pointer" style={{ color: '#116dff' }}>Compare Plans</span>
          </div>

          {/* Site URL */}
          <div className="flex items-center gap-1.5" style={{ borderRight: '1px solid #e5e8ef', paddingRight: 20 }}>
            <span className="text-[13px]" style={{ color: '#32325d' }}>
              https://orha167.wixsite....
            </span>
            <ExternalLink size={13} style={{ color: '#9098a9' }} />
          </div>

          {/* Business email */}
          <div className="flex flex-col">
            <span className="text-[13px]" style={{ color: '#32325d' }}>No business email</span>
            <span className="text-[12px] cursor-pointer" style={{ color: '#116dff' }}>Connect</span>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Edit Business Info */}
          <button
            className="flex items-center gap-1.5 text-[12px] font-medium"
            style={{ color: '#32325d' }}
          >
            <Settings size={14} style={{ color: '#9098a9' }} />
            Edit Business Info
          </button>
        </div>

        {/* Analytics Section */}
        <div
          className="rounded-xl mb-6 overflow-hidden"
          style={{ background: '#fff', border: '1px solid #e5e8ef' }}
        >
          {/* Analytics Header */}
          <div className="flex items-center justify-between px-6 pt-5 pb-4">
            <div className="flex items-center gap-3">
              <h2 className="text-[17px] font-bold" style={{ color: '#1a1a2e' }}>Analytics</h2>
              <span
                className="text-[11px] px-2.5 py-0.5 rounded-full"
                style={{ background: '#f0f2f5', color: '#6b7280', border: '1px solid #e5e8ef' }}
              >
                No visitors at the moment
              </span>
            </div>
            <span className="text-[13px] cursor-pointer" style={{ color: '#116dff' }}>
              View Your Site Analytics
            </span>
          </div>

          {/* Key Stats Header */}
          <div className="flex items-center justify-between px-6 pb-3">
            <div className="flex items-center gap-1.5">
              <span className="text-[13px]" style={{ color: '#32325d' }}>Your key stats for</span>
              <button className="flex items-center gap-1 text-[13px] font-medium" style={{ color: '#116dff' }}>
                last 30 days
                <ChevronDown size={14} />
              </button>
            </div>
            <button className="flex items-center gap-1 text-[13px]" style={{ color: '#32325d' }}>
              <Plus size={14} />
              Add Stats
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-0 mx-6 mb-4">
            {[
              { label: 'Site sessions', value: '0' },
              { label: 'Total sales', value: '$0.00' },
              { label: 'Total orders', value: '0' },
              { label: 'Bookings', value: '0' },
            ].map((stat, i) => (
              <div
                key={i}
                className="px-4 py-3 flex flex-col gap-1.5"
                style={{
                  border: '1px solid #e5e8ef',
                  borderRadius: i === 0 ? '10px 0 0 10px' : i === 3 ? '0 10px 10px 0' : 0,
                  borderLeft: i > 0 ? 'none' : '1px solid #e5e8ef',
                }}
              >
                <span className="text-[12px]" style={{ color: '#6b7280' }}>{stat.label}</span>
                <div className="flex items-center justify-between">
                  <span className="text-[18px] font-bold" style={{ color: '#1a1a2e' }}>{stat.value}</span>
                  <MiniSparkline />
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 pb-5 pt-1">
            <button className="flex items-center gap-1.5 text-[13px]" style={{ color: '#116dff' }}>
              <Sparkles size={14} style={{ color: '#116dff' }} />
              Help me grow my site traffic
            </button>
            <div className="flex items-center gap-2">
              <span className="text-[12px]" style={{ color: '#9098a9' }}>Updated now</span>
              <span className="text-[12px] cursor-pointer" style={{ color: '#116dff' }}>Refresh</span>
            </div>
          </div>
        </div>

        {/* Reach Visitors Section */}
        <div
          className="rounded-xl mb-6 overflow-hidden"
          style={{ background: '#fff', border: '1px solid #e5e8ef' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5">
            <h2 className="text-[17px] font-bold" style={{ color: '#1a1a2e' }}>
              Let's help you reach{' '}
              <span style={{ textDecoration: 'underline', textUnderlineOffset: 3 }}>
                250 monthly site visitors
              </span>
            </h2>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-[12px]" style={{ color: '#6b7280' }}>0/250 visitors</span>
                <div className="w-28 h-1.5 rounded-full" style={{ background: '#e5e8ef' }}>
                  <div className="h-full rounded-full" style={{ background: '#116dff', width: '0%' }} />
                </div>
              </div>
              <button
                onClick={() => setReachExpanded(prev => !prev)}
                className="w-7 h-7 rounded-full flex items-center justify-center"
                style={{ border: '1px solid #e5e8ef' }}
              >
                {reachExpanded ? <ChevronUp size={14} style={{ color: '#6b7280' }} /> : <ChevronDown size={14} style={{ color: '#6b7280' }} />}
              </button>
            </div>
          </div>

          {reachExpanded && (
            <>
              {/* Ways to drive traffic */}
              <div className="px-6 pb-2">
                <div className="flex items-center gap-1.5 mb-3">
                  <span className="text-[13px] font-medium" style={{ color: '#32325d' }}>Ways to drive site traffic</span>
                  <Info size={13} style={{ color: '#9098a9' }} />
                </div>
              </div>

              {/* Traffic items */}
              {[
                { text: 'Get found by people searching on Google', cta: 'Get Started' },
                { text: 'Increase your online search visibility with Google Ads', cta: 'Get Started' },
                { text: 'Get noticed on social with Facebook and Instagram Ads', cta: 'Create Campaign' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-6 py-4 mx-6 mb-3 rounded-xl"
                  style={{ border: '1px solid #e5e8ef' }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: '#116dff' }}
                    />
                    <span className="text-[13px]" style={{ color: '#32325d' }}>{item.text}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="px-4 py-1.5 rounded-full text-[12px] font-medium"
                      style={{ color: '#116dff', border: '1px solid #d0dbf0' }}
                    >
                      {item.cta}
                    </button>
                    <ChevronDown size={14} style={{ color: '#9098a9' }} />
                  </div>
                </div>
              ))}
              <div className="h-3" />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
