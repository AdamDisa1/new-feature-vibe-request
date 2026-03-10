import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, MoreHorizontal, Sparkles } from 'lucide-react';
import { BACK_IN_STOCK_PRODUCTS, BACK_IN_STOCK_REQUESTS } from '../mock-data';
import { formatDateTime } from '../utils/dateUtils';

interface BuildingDashboardPageProps {
  appName: string;
  completed: boolean;
  freshlyBuilt: boolean;
}

// ─── Status badge styles ────────────────────────────────────────────────────

const STATUS_BADGE_STYLES: Record<string, { color: string; bg: string }> = {
  'Request Received': { color: '#7c6af5', bg: '#f0eeff' },
  'Notified': { color: '#116dff', bg: '#e8f1fe' },
  'Purchased': { color: '#00b383', bg: '#e6f9f4' },
};

// ─── Product Summary Widget ─────────────────────────────────────────────────

const ProductSummaryWidget: React.FC = () => {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
      {BACK_IN_STOCK_PRODUCTS.map(product => (
        <div
          key={product.id}
          className="flex items-center gap-3 px-4 py-3 rounded-xl flex-shrink-0 transition-all cursor-pointer"
          style={{
            background: '#ffffff',
            border: '1px solid #e5e8ef',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            minWidth: 200,
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLDivElement).style.borderColor = product.color;
            (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLDivElement).style.borderColor = '#e5e8ef';
            (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)';
          }}
        >
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold text-white"
            style={{ background: product.color }}
          >
            {product.initial}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium truncate" style={{ color: '#16161d', maxWidth: 130 }}>
              {product.name}
            </p>
            <p className="text-lg font-bold leading-tight" style={{ color: product.color }}>
              {product.totalRequests.toLocaleString()}
            </p>
            <p className="text-[10px]" style={{ color: '#9098a9' }}>requests</p>
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── Requests Table ─────────────────────────────────────────────────────────

const RequestsTable: React.FC = () => {
  const totalRequests = BACK_IN_STOCK_PRODUCTS.reduce((sum, p) => sum + p.totalRequests, 0);

  return (
    <>
      <div className="flex items-center gap-2.5 mb-4 mt-6">
        <span className="text-sm font-semibold" style={{ color: '#16161d' }}>
          Requests
        </span>
        <span
          className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
          style={{ color: '#6b7280', background: '#f0f0f5' }}
        >
          {totalRequests.toLocaleString()}
        </span>
      </div>

      <div
        className="rounded-xl overflow-hidden"
        style={{ background: '#ffffff', border: '1px solid #e5e8ef' }}
      >
        {/* Table Header */}
        <div
          className="grid items-center px-5 py-3 text-[11px] font-semibold"
          style={{
            color: '#9098a9',
            background: '#fafbfc',
            borderBottom: '1px solid #e5e8ef',
            gridTemplateColumns: '2fr 1fr 1.5fr 1.5fr 1fr 1fr',
            gap: 12,
          }}
        >
          <span>Name</span>
          <span>SKU</span>
          <span>Request date</span>
          <span>Customer</span>
          <span>Inventory</span>
          <span>Request status</span>
        </div>

        {/* Table Rows */}
        {BACK_IN_STOCK_REQUESTS.map((req, i) => {
          const product = BACK_IN_STOCK_PRODUCTS.find(p => p.id === req.productId);
          const badgeStyle = STATUS_BADGE_STYLES[req.status] ?? STATUS_BADGE_STYLES['Request Received'];

          return (
            <div
              key={req.id}
              className="grid items-center px-5 py-3.5 transition-colors cursor-pointer"
              style={{
                gridTemplateColumns: '2fr 1fr 1.5fr 1.5fr 1fr 1fr',
                gap: 12,
                borderBottom: i < BACK_IN_STOCK_REQUESTS.length - 1 ? '1px solid #f0f0f5' : undefined,
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.background = '#f7f8ff')}
              onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.background = 'transparent')}
            >
              {/* Name + thumbnail */}
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-white"
                  style={{ background: product?.color ?? '#9098a9' }}
                >
                  {product?.initial ?? '?'}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: '#16161d' }}>
                    {req.productName}
                  </p>
                  <p className="text-[11px] truncate" style={{ color: '#9098a9' }}>
                    {req.variant}
                  </p>
                </div>
              </div>

              {/* SKU */}
              <span className="text-xs" style={{ color: '#6b7280' }}>
                {req.sku}
              </span>

              {/* Request date */}
              <span className="text-xs" style={{ color: '#6b7280' }}>
                {formatDateTime(req.requestDate)}
              </span>

              {/* Customer */}
              <span className="text-xs truncate" style={{ color: '#6b7280' }}>
                {req.customerEmail}
              </span>

              {/* Inventory */}
              <span className="text-xs font-medium" style={{ color: '#ef4444' }}>
                {req.inventory}
              </span>

              {/* Status badge */}
              <span
                className="text-[11px] font-semibold px-2.5 py-1 rounded-full text-center w-fit"
                style={{ color: badgeStyle.color, background: badgeStyle.bg }}
              >
                {req.status}
              </span>
            </div>
          );
        })}
      </div>
    </>
  );
};

// ─── Back In Stock Dashboard ────────────────────────────────────────────────

const BackInStockDashboard: React.FC<{ freshlyBuilt: boolean }> = ({ freshlyBuilt }) => {
  const [activeTab, setActiveTab] = useState<'requests' | 'automations'>('requests');
  const [showBuiltByAI, setShowBuiltByAI] = useState(freshlyBuilt);

  useEffect(() => {
    if (freshlyBuilt) {
      const timeout = setTimeout(() => setShowBuiltByAI(false), 4000);
      return () => clearTimeout(timeout);
    }
  }, [freshlyBuilt]);

  return (
    <div className="dashboard-reveal" style={{ padding: 32 }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-3">
          <button
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: '#9098a9' }}
            onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = '#16161d')}
            onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = '#9098a9')}
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-xl font-bold" style={{ color: '#16161d' }}>
            Back in Stock Requests
          </h1>
        </div>
        <button
          className="p-2 rounded-lg transition-colors"
          style={{ color: '#9098a9' }}
          onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = '#16161d')}
          onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = '#9098a9')}
        >
          <MoreHorizontal size={18} />
        </button>
      </div>

      {/* Subtitle */}
      <p className="text-sm mb-6 ml-9" style={{ color: '#6b7280' }}>
        Collect requests and notify customers when products are back in stock.{' '}
        <span
          className="cursor-pointer"
          style={{ color: '#116dff' }}
          onMouseEnter={e => ((e.currentTarget as HTMLSpanElement).style.textDecoration = 'underline')}
          onMouseLeave={e => ((e.currentTarget as HTMLSpanElement).style.textDecoration = 'none')}
        >
          Learn more
        </span>
      </p>

      {/* Tabs */}
      <div className="flex gap-6 mb-6" style={{ borderBottom: '1px solid #e5e8ef' }}>
        {(['requests', 'automations'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="text-sm font-medium pb-2.5 transition-colors"
            style={{
              color: activeTab === tab ? '#116dff' : '#6b7280',
              borderBottom: activeTab === tab ? '2px solid #116dff' : '2px solid transparent',
              marginBottom: -1,
            }}
          >
            {tab === 'requests' ? 'Requests' : 'Automations'}
          </button>
        ))}
      </div>

      {/* Product Summary Widget */}
      {activeTab === 'requests' && (
        <>
          <div className={`relative ${showBuiltByAI ? 'ai-gradient-frame' : ''}`}>
            {showBuiltByAI && (
              <div className="ai-frame-label">
                <Sparkles size={12} color="#fff" />
                <span>Built by AI</span>
              </div>
            )}
            <ProductSummaryWidget />
          </div>
          <RequestsTable />
        </>
      )}

      {activeTab === 'automations' && (
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-sm" style={{ color: '#9098a9' }}>
            No automations configured yet.
          </p>
        </div>
      )}
    </div>
  );
};

// ─── Main Component ─────────────────────────────────────────────────────────

const BuildingDashboardPage: React.FC<BuildingDashboardPageProps> = ({ appName, completed, freshlyBuilt }) => {
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(() => {
    if (completed) {
      const timeout = setTimeout(() => setShowDashboard(true), 300);
      return () => clearTimeout(timeout);
    }
  }, [completed]);

  return (
    <div className="relative flex flex-col h-full overflow-hidden" style={{ background: '#f7f8fa' }}>
      {/* Floating purple pill banner - only during building */}
      {!showDashboard && (
        <div className="flex justify-center flex-shrink-0" style={{ paddingTop: 24, paddingBottom: 8 }}>
          <div
            className="flex items-center gap-2.5"
            style={{
              background: 'linear-gradient(135deg, #7c6af5, #9b59b6)',
              padding: '12px 28px',
              borderRadius: 999,
              boxShadow: '0 4px 20px rgba(124, 106, 245, 0.35)',
            }}
          >
            <Star size={15} color="#fff" fill="#fff" />
            <span style={{ color: '#ffffff', fontSize: 14, fontWeight: 600 }}>
              AI is creating your page...
            </span>
          </div>
        </div>
      )}

      {/* Content area */}
      <div className="flex-1 overflow-y-auto">
        {showDashboard ? (
          <BackInStockDashboard freshlyBuilt={freshlyBuilt} />
        ) : (
          <div className="p-8">
            {/* Top bar placeholders */}
            <div className="flex items-center gap-4 mb-6">
              <div className="shimmer-light rounded-lg" style={{ width: 40, height: 40 }} />
              <div className="shimmer-light rounded" style={{ width: 200, height: 16 }} />
              <div className="flex-1" />
              <div className="shimmer-light rounded" style={{ width: 100, height: 32 }} />
              <div className="shimmer-light rounded" style={{ width: 100, height: 32 }} />
            </div>

            {/* Header section */}
            <div className="flex items-center gap-6 mb-8">
              <div className="shimmer-light rounded" style={{ width: 280, height: 20 }} />
              <div className="flex-1" />
              <div className="shimmer-light rounded" style={{ width: 160, height: 20 }} />
            </div>

            {/* KPI Cards row */}
            <div className="grid grid-cols-3 gap-5 mb-8">
              {[1, 2, 3].map(i => (
                <div
                  key={i}
                  className="rounded-xl p-5"
                  style={{ background: '#ffffff', border: '1px solid #e5e8ef' }}
                >
                  <div className="shimmer-light rounded mb-3" style={{ width: '60%', height: 12 }} />
                  <div className="shimmer-light rounded mb-2" style={{ width: '40%', height: 24 }} />
                  <div className="shimmer-light rounded" style={{ width: '80%', height: 10 }} />
                </div>
              ))}
            </div>

            {/* Chart area */}
            <div
              className="rounded-xl p-6 mb-8"
              style={{ background: '#ffffff', border: '1px solid #e5e8ef' }}
            >
              <div className="shimmer-light rounded mb-4" style={{ width: 180, height: 14 }} />
              <div className="flex items-end gap-3" style={{ height: 180 }}>
                {[65, 80, 45, 90, 55, 70, 85, 40, 75, 60, 50, 88].map((h, i) => (
                  <div
                    key={i}
                    className="shimmer-light rounded-t flex-1"
                    style={{ height: `${h}%`, minWidth: 20 }}
                  />
                ))}
              </div>
            </div>

            {/* Table area */}
            <div
              className="rounded-xl overflow-hidden"
              style={{ background: '#ffffff', border: '1px solid #e5e8ef' }}
            >
              {/* Table header */}
              <div
                className="flex items-center gap-4 px-6 py-3"
                style={{ borderBottom: '1px solid #e5e8ef', background: '#fafbfc' }}
              >
                <div className="shimmer-light rounded" style={{ width: 140, height: 10 }} />
                <div className="shimmer-light rounded" style={{ width: 100, height: 10 }} />
                <div className="shimmer-light rounded" style={{ width: 80, height: 10 }} />
                <div className="flex-1" />
                <div className="shimmer-light rounded" style={{ width: 60, height: 10 }} />
              </div>
              {/* Table rows */}
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div
                  key={i}
                  className="flex items-center gap-4 px-6 py-4"
                  style={{ borderBottom: i < 6 ? '1px solid #f0f0f5' : undefined }}
                >
                  <div className="shimmer-light rounded" style={{ width: 140, height: 12 }} />
                  <div className="shimmer-light rounded" style={{ width: 100, height: 12 }} />
                  <div className="shimmer-light rounded" style={{ width: 80, height: 12 }} />
                  <div className="flex-1" />
                  <div className="shimmer-light rounded-full" style={{ width: 60, height: 20 }} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuildingDashboardPage;
