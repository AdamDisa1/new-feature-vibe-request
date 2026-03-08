import React, { useState } from 'react';
import { X, Users, Globe, Share2 } from 'lucide-react';
import { CreatedApp, ShareScope } from '../types';

interface Props {
  app: CreatedApp;
  onClose: () => void;
  onShare: (scope: ShareScope, targetSite?: string) => void;
}

const SHARE_OPTIONS: {
  scope: ShareScope;
  icon: React.ElementType;
  title: string;
  description: string;
}[] = [
  {
    scope: 'account',
    icon: Users,
    title: 'Within my account',
    description: 'Available across all sites you manage in this Wix account.',
  },
  {
    scope: 'site',
    icon: Share2,
    title: 'To another site',
    description: 'Share with a specific site outside your account.',
  },
  {
    scope: 'community',
    icon: Globe,
    title: 'Community',
    description: 'Publish to the Wix community so anyone can discover and use it.',
  },
];

const ShareModal: React.FC<Props> = ({ app, onClose, onShare }) => {
  const [selectedScope, setSelectedScope] = useState<ShareScope>('account');
  const [targetSite, setTargetSite] = useState('');

  const handleShare = () => {
    onShare(selectedScope, selectedScope === 'site' ? targetSite : undefined);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.6)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-md rounded-xl shadow-2xl overflow-hidden"
        style={{ background: '#252526', border: '1px solid #3e3e42' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: '#3e3e42' }}
        >
          <div>
            <h2 className="text-sm font-semibold text-[#cccccc]">Share "{app.name}"</h2>
            <p className="text-xs text-[#858585] mt-0.5">Choose how to share this app</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-[#3e3e42] transition-colors"
          >
            <X size={16} className="text-[#858585]" />
          </button>
        </div>

        {/* Options */}
        <div className="p-5 flex flex-col gap-3">
          {SHARE_OPTIONS.map(opt => {
            const Icon = opt.icon;
            const isSelected = selectedScope === opt.scope;
            return (
              <button
                key={opt.scope}
                onClick={() => setSelectedScope(opt.scope)}
                className="flex items-start gap-3 p-3 rounded-lg text-left transition-all"
                style={{
                  background: isSelected ? 'rgba(14,112,192,0.15)' : '#2d2d30',
                  border: `1px solid ${isSelected ? '#0e70c0' : '#3e3e42'}`,
                }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{
                    background: isSelected ? 'rgba(14,112,192,0.25)' : '#3e3e42',
                  }}
                >
                  <Icon size={15} style={{ color: isSelected ? '#4da6ff' : '#858585' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[#cccccc]">{opt.title}</span>
                    {isSelected && (
                      <div
                        className="w-4 h-4 rounded-full flex items-center justify-center"
                        style={{ background: '#0e70c0' }}
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-[#858585] mt-0.5">{opt.description}</p>

                  {opt.scope === 'site' && isSelected && (
                    <input
                      type="text"
                      placeholder="e.g. mysite.wixsite.com or site ID"
                      value={targetSite}
                      onChange={e => setTargetSite(e.target.value)}
                      onClick={e => e.stopPropagation()}
                      className="mt-2 w-full px-3 py-1.5 rounded text-xs text-[#cccccc] outline-none transition-colors"
                      style={{
                        background: '#1e1e1e',
                        border: '1px solid #3e3e42',
                      }}
                      onFocus={e => (e.target.style.borderColor = '#0e70c0')}
                      onBlur={e => (e.target.style.borderColor = '#3e3e42')}
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-end gap-2 px-5 py-4 border-t"
          style={{ borderColor: '#3e3e42' }}
        >
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded text-sm text-[#858585] hover:text-[#cccccc] hover:bg-[#3e3e42] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleShare}
            disabled={selectedScope === 'site' && !targetSite.trim()}
            className="px-4 py-1.5 rounded text-sm font-medium text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: '#0e70c0' }}
            onMouseEnter={e => {
              if (!(selectedScope === 'site' && !targetSite.trim()))
                (e.currentTarget as HTMLButtonElement).style.background = '#1481cc';
            }}
            onMouseLeave={e =>
              ((e.currentTarget as HTMLButtonElement).style.background = '#0e70c0')
            }
          >
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
