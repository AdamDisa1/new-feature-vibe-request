import React, { useState } from 'react';
import {
  Search,
  Plus,
  Activity,
  Code,
  Settings,
  Eye,
  Layers,
  Share2,
  Zap,
  Server,
  Globe,
  Bell,
  LayoutDashboard,
} from 'lucide-react';
import { Extension, ExtensionType, TYPE_META } from '../types';
import { formatDistanceToNow } from '../utils/dateUtils';

const TYPE_ICONS: Record<ExtensionType, React.ReactNode> = {
  component: <Layers size={12} />,
  context: <Share2 size={12} />,
  function: <Zap size={12} />,
  'web-method': <Server size={12} />,
  api: <Globe size={12} />,
  'event-handler': <Bell size={12} />,
  'dashboard-page': <LayoutDashboard size={12} />,
};

const ALL_TYPES: ExtensionType[] = [
  'component',
  'context',
  'function',
  'web-method',
  'api',
  'event-handler',
  'dashboard-page',
];

const PREVIEWABLE: ExtensionType[] = ['component', 'api', 'dashboard-page'];

interface ExtensionListProps {
  extensions: Extension[];
  onSelect: (ext: Extension) => void;
  onNewExtension: () => void;
}

export default function ExtensionList({ extensions, onSelect, onNewExtension }: ExtensionListProps) {
  const [selectedType, setSelectedType] = useState<ExtensionType | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = extensions.filter(e => {
    const matchesType = !selectedType || e.type === selectedType;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      e.name.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q) ||
      e.type.includes(q);
    return matchesType && matchesSearch;
  });

  const countByType = (type: ExtensionType) => extensions.filter(e => e.type === type).length;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <div
        className="flex items-center gap-3 px-6 py-3 border-b shrink-0"
        style={{ background: '#252526', borderColor: '#3e3e42' }}
      >
        <h1 className="text-sm font-semibold whitespace-nowrap" style={{ color: '#cccccc' }}>
          Extensions
        </h1>

        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded text-xs focus:outline-none"
            style={{ background: '#3c3c3c', color: '#cccccc', border: '1px solid #3e3e42' }}
            onFocus={e => (e.target.style.borderColor = '#0e70c0')}
            onBlur={e => (e.target.style.borderColor = '#3e3e42')}
          />
        </div>

        <span className="text-xs" style={{ color: '#606060' }}>
          {filtered.length} / {extensions.length}
        </span>

        <button
          onClick={onNewExtension}
          className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors"
          style={{ background: '#0e70c0', color: '#fff' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#1481cc')}
          onMouseLeave={e => (e.currentTarget.style.background = '#0e70c0')}
        >
          <Plus size={13} />
          New Extension
        </button>
      </div>

      {/* ── Filter chips ────────────────────────────────────────────────── */}
      <div
        className="flex items-center gap-2 px-6 py-2.5 border-b overflow-x-auto shrink-0"
        style={{ background: '#1e1e1e', borderColor: '#3e3e42' }}
      >
        <FilterChip
          label="All"
          count={extensions.length}
          isActive={selectedType === null}
          onClick={() => setSelectedType(null)}
          color="#cccccc"
          bgColor="rgba(204,204,204,0.12)"
        />

        <div className="w-px h-4 shrink-0" style={{ background: '#3e3e42' }} />

        {ALL_TYPES.map(type => {
          const meta = TYPE_META[type];
          return (
            <FilterChip
              key={type}
              icon={TYPE_ICONS[type]}
              label={meta.label}
              count={countByType(type)}
              isActive={selectedType === type}
              onClick={() => setSelectedType(prev => (prev === type ? null : type))}
              color={meta.color}
              bgColor={meta.bgColor}
            />
          );
        })}
      </div>

      {/* ── Cards ───────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full" style={{ color: '#858585' }}>
            <Activity size={40} className="mb-4 opacity-40" />
            <p className="text-sm font-medium mb-1">No extensions found</p>
            <p className="text-xs opacity-60">
              {searchQuery ? 'Try a different search term' : 'Create your first extension to get started'}
            </p>
          </div>
        ) : (
          <div
            className="p-6 grid gap-3"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))' }}
          >
            {filtered.map(ext => (
              <ExtensionCard key={ext.id} ext={ext} onSelect={onSelect} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── FilterChip ────────────────────────────────────────────────────────────────

function FilterChip({
  icon,
  label,
  count,
  isActive,
  onClick,
  color,
  bgColor,
}: {
  icon?: React.ReactNode;
  label: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
  color: string;
  bgColor: string;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap shrink-0"
      style={{
        background: isActive ? bgColor : 'transparent',
        color: isActive ? color : '#858585',
        border: `1px solid ${isActive ? color + '66' : '#3e3e42'}`,
      }}
      onMouseEnter={e => {
        if (!isActive) {
          e.currentTarget.style.color = color;
          e.currentTarget.style.borderColor = color + '55';
          e.currentTarget.style.background = bgColor;
        }
      }}
      onMouseLeave={e => {
        if (!isActive) {
          e.currentTarget.style.color = '#858585';
          e.currentTarget.style.borderColor = '#3e3e42';
          e.currentTarget.style.background = 'transparent';
        }
      }}
    >
      {icon && <span className="opacity-80">{icon}</span>}
      {label}
      <span
        className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold"
        style={{
          background: isActive ? color + '33' : '#3c3c3c',
          color: isActive ? color : '#606060',
        }}
      >
        {count}
      </span>
    </button>
  );
}

// ── ExtensionCard ─────────────────────────────────────────────────────────────

function ExtensionCard({ ext, onSelect }: { ext: Extension; onSelect: (e: Extension) => void }) {
  const meta = TYPE_META[ext.type];
  const canPreview = PREVIEWABLE.includes(ext.type);

  return (
    <div
      className="rounded-lg border cursor-pointer transition-all"
      style={{ background: '#2d2d30', borderColor: '#3e3e42' }}
      onClick={() => onSelect(ext)}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = meta.color;
        (e.currentTarget as HTMLElement).style.boxShadow = `0 0 0 1px ${meta.color}22`;
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = '#3e3e42';
        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
      }}
    >
      <div className="p-4">
        {/* Top row */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="px-2 py-0.5 rounded text-[11px] font-semibold shrink-0 flex items-center gap-1"
              style={{ background: meta.bgColor, color: meta.color }}
            >
              {TYPE_ICONS[ext.type]}
              {meta.label}
            </span>
            <h3 className="text-sm font-semibold truncate" style={{ color: '#cccccc' }}>
              {ext.name}
            </h3>
          </div>
          <span
            className="ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-medium shrink-0"
            style={{
              background: ext.status === 'active' ? 'rgba(74,222,128,0.15)' : 'rgba(133,133,133,0.15)',
              color: ext.status === 'active' ? '#4ade80' : '#858585',
            }}
          >
            {ext.status === 'active' ? '● Active' : '○ Inactive'}
          </span>
        </div>

        {/* Description */}
        <p className="text-xs mb-3 line-clamp-2" style={{ color: '#858585', lineHeight: '1.5' }}>
          {ext.description}
        </p>

        {/* Meta */}
        <div className="flex items-center justify-between">
          <span className="text-[11px]" style={{ color: '#606060' }}>
            Modified {formatDistanceToNow(ext.modifiedAt)}
          </span>
          <span className="text-[11px]" style={{ color: '#606060' }}>
            {ext.author}
          </span>
        </div>
      </div>

      {/* Quick actions */}
      <div
        className="flex border-t px-4 py-2 gap-1"
        style={{ borderColor: '#3e3e42' }}
        onClick={e => e.stopPropagation()}
      >
        <QuickAction icon={<Settings size={12} />} label="Configure" onClick={() => onSelect(ext)} />
        {canPreview && <QuickAction icon={<Eye size={12} />} label="Preview" onClick={() => onSelect(ext)} />}
        <QuickAction icon={<Code size={12} />} label="Code" onClick={() => onSelect(ext)} />
      </div>
    </div>
  );
}

function QuickAction({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-colors hover:bg-white/10"
      style={{ color: '#858585' }}
    >
      {icon}
      {label}
    </button>
  );
}
