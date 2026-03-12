import { Plus, Type, Image, Layers, LayoutGrid, Columns, Table2, Users, AppWindow, CheckSquare, MessageSquare, HelpCircle, Minus, ShoppingBag } from 'lucide-react';
import { useState, useEffect } from 'react';

// A Wix-Editor-like page showing the Bundle Sales Dashboard in an editor canvas

const EDITOR_TOOLS = [
  Plus, Type, () => null, Image, Layers, () => null, LayoutGrid, Columns, () => null, Table2, Users, AppWindow, () => null, CheckSquare, MessageSquare, HelpCircle,
];

// Product images for the carousel
const PRODUCT_IMAGES = [
  'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=500&h=500&fit=crop', // bowls
  'https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=150&h=150&fit=crop',
  'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=150&h=150&fit=crop',
  'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=150&h=150&fit=crop',
];

// Bundle product images
const BUNDLE_PRODUCTS = [
  {
    name: 'Woven Picnic Basket',
    price: '$64.00',
    oldPrice: '$85.00',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop',
  },
  {
    name: 'Striped Beach Blanket',
    price: '$42.00',
    oldPrice: '$58.00',
    image: 'https://images.unsplash.com/photo-1600369672770-985fd30004eb?w=300&h=300&fit=crop',
  },
  {
    name: 'Canvas Tote Bag',
    price: '$36.00',
    oldPrice: '$48.00',
    image: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=300&h=300&fit=crop',
  },
];

export function BundleDashboardEditorView({ bundleLoading = false }: { bundleLoading?: boolean }) {
  const [quantity, setQuantity] = useState(1);
  // Small delay after bundleLoading becomes false to animate the reveal
  const [showBundle, setShowBundle] = useState(false);

  useEffect(() => {
    if (!bundleLoading) {
      const timer = setTimeout(() => setShowBundle(true), 600);
      return () => clearTimeout(timer);
    }
  }, [bundleLoading]);

  return (
    <div className="flex flex-1 h-full overflow-hidden" style={{ backgroundColor: '#f0f0f0' }}>
      {/* Editor left toolbar */}
      <div
        className="flex flex-col items-center py-3 gap-0.5 flex-shrink-0"
        style={{ width: 44, backgroundColor: '#ffffff', borderRight: '1px solid #e5e8ef' }}
      >
        {EDITOR_TOOLS.map((Icon, i) => {
          if (Icon === (() => null) || Icon.toString() === '() => null') {
            return <div key={i} className="w-6 my-1" style={{ borderTop: '1px solid #e5e8ef' }} />;
          }
          return (
            <button
              key={i}
              className="w-8 h-8 rounded flex items-center justify-center transition-colors"
              style={{ color: '#3b3b4f' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f0f0f5')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <Icon size={16} />
            </button>
          );
        })}
      </div>

      {/* Editor canvas */}
      <div className="flex-1 overflow-auto flex flex-col items-center">
        {/* URL bar */}
        <div
          className="w-full flex items-center justify-center gap-3 py-2 flex-shrink-0"
          style={{ backgroundColor: '#f7f7f9', borderBottom: '1px solid #e5e8ef' }}
        >
          <span className="text-xs" style={{ color: '#7a7a8e' }}>https://yoursite.wixstudio.com/my-site-24</span>
          <button className="text-xs font-medium" style={{ color: '#116dff' }}>Connect Domain</button>
        </div>
        <div className="flex-1 w-full overflow-auto flex justify-center py-4 px-4">
        <div
          className="w-full shadow-lg"
          style={{ maxWidth: 1100, backgroundColor: '#ffffff', border: '1px solid #d0d0d0', borderRadius: 8 }}
        >
          {/* Site header bar */}
          <div
            className="flex items-center justify-between px-4 py-2 text-[10px]"
            style={{ backgroundColor: '#e85d2a', color: '#ffffff' }}
          >
            <span>Free shipping on orders over $75</span>
            <span>Get 15% off your first purchase</span>
            <span>Free shipping on orders over $75</span>
            <span>Get 15% off your first purchase</span>
          </div>

          {/* Site nav */}
          <div
            className="flex items-center justify-between px-8 py-4"
            style={{ borderBottom: '1px solid #f0f0f0' }}
          >
            <div className="flex items-center gap-2">
              <button className="text-[#e85d2a]">
                <svg width="24" height="18" viewBox="0 0 24 18" fill="currentColor">
                  <rect y="0" width="24" height="2" rx="1" />
                  <rect y="8" width="24" height="2" rx="1" />
                  <rect y="16" width="24" height="2" rx="1" />
                </svg>
              </button>
            </div>
            <h1 className="text-2xl italic font-serif" style={{ color: '#e85d2a' }}>Goody</h1>
            <div className="flex items-center gap-3 text-sm" style={{ color: '#e85d2a' }}>
              <span>🔍</span>
              <span>♥</span>
              <span>CART (0)</span>
            </div>
          </div>

          {/* Product page */}
          <div className="flex gap-8 p-8">
            {/* Product image */}
            <div className="flex-shrink-0" style={{ width: 380 }}>
              <div
                className="rounded-lg overflow-hidden"
                style={{ width: '100%', height: 380, backgroundColor: '#f5f0e8' }}
              >
                <img
                  src={PRODUCT_IMAGES[0]}
                  alt="Enamel Bowl Set"
                  className="w-full h-full object-cover"
                  onError={e => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
              <div className="flex gap-2 mt-3">
                {PRODUCT_IMAGES.slice(0, 4).map((img, i) => (
                  <div
                    key={i}
                    className="w-16 h-16 rounded overflow-hidden cursor-pointer"
                    style={{
                      border: i === 0 ? '2px solid #e85d2a' : '1px solid #e5e8ef',
                      backgroundColor: '#f5f0e8',
                    }}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={e => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Product details */}
            <div className="flex-1 min-w-0">
              {/* Breadcrumb */}
              <div className="flex items-center gap-1 text-xs mb-4" style={{ color: '#e85d2a' }}>
                <span>Home</span>
                <span style={{ color: '#999' }}>/</span>
                <span>Kitchen</span>
                <span style={{ color: '#999' }}>/</span>
                <span>Bowls</span>
              </div>

              <h2 className="text-3xl font-light mb-2" style={{ color: '#e85d2a' }}>
                Enamel Bowl Set
              </h2>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map(i => (
                    <span key={i} style={{ color: '#e85d2a', fontSize: 14 }}>★</span>
                  ))}
                </div>
                <span className="text-xs" style={{ color: '#e85d2a' }}>(127 reviews)</span>
              </div>

              {/* Price */}
              <p className="text-2xl font-light mb-1" style={{ color: '#e85d2a' }}>$89.00</p>
              <p className="text-sm line-through mb-4" style={{ color: '#999' }}>$125.00</p>

              {/* Description */}
              <p className="text-sm leading-relaxed mb-6" style={{ color: '#555' }}>
                Beautiful set of 4 enamel serving bowls. Perfect for serving, mixing, or display. Each bowl features a glossy enamel finish and is both durable and stylish. Great for modern and vintage kitchen styles.
              </p>

              {/* Quantity */}
              <p className="text-xs font-medium mb-2" style={{ color: '#e85d2a' }}>QUANTITY</p>
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="flex items-center rounded-lg overflow-hidden"
                  style={{ border: '1px solid #e85d2a' }}
                >
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center"
                    style={{ color: '#e85d2a' }}
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-10 text-center text-sm" style={{ color: '#e85d2a' }}>{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-10 h-10 flex items-center justify-center"
                    style={{ color: '#e85d2a' }}
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <span className="text-xs" style={{ color: '#999' }}>Only 12 left in stock</span>
              </div>

              {/* Add to Cart */}
              <button
                className="w-full h-12 rounded-lg text-sm font-medium text-white tracking-wider"
                style={{ backgroundColor: '#e85d2a' }}
              >
                ADD TO CART
              </button>
            </div>
          </div>

          {/* Bundle this with section */}
          <div className="px-8 pb-8">
            <div
              className="pt-6"
              style={{ borderTop: '1px solid #f0f0f0' }}
            >
              <div className="flex items-center gap-2 mb-4">
                <ShoppingBag size={16} style={{ color: '#e85d2a' }} />
                <h3 className="text-lg font-light" style={{ color: '#e85d2a' }}>
                  Bundle this with
                </h3>
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: '#fff3ed', color: '#e85d2a' }}
                >
                  SAVE 20%
                </span>
              </div>

              {bundleLoading && !showBundle ? (
                /* Skeleton loading state */
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="space-y-3 animate-pulse">
                      <div
                        className="rounded-lg"
                        style={{ height: 160, backgroundColor: '#e5e7eb' }}
                      />
                      <div className="space-y-2">
                        <div className="h-3 rounded" style={{ backgroundColor: '#e5e7eb', width: '75%' }} />
                        <div className="flex gap-2">
                          <div className="h-3 rounded" style={{ backgroundColor: '#e5e7eb', width: '30%' }} />
                          <div className="h-3 rounded" style={{ backgroundColor: '#f3f4f6', width: '25%' }} />
                        </div>
                      </div>
                      <div
                        className="h-8 rounded-lg"
                        style={{ backgroundColor: '#e5e7eb' }}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                /* Revealed bundle products */
                <div
                  className="grid grid-cols-3 gap-4 transition-all duration-700"
                  style={{ opacity: showBundle ? 1 : 0, transform: showBundle ? 'translateY(0)' : 'translateY(8px)' }}
                >
                  {BUNDLE_PRODUCTS.map((product, i) => (
                    <div key={i} className="group cursor-pointer">
                      <div
                        className="rounded-lg overflow-hidden mb-2 transition-shadow"
                        style={{ height: 160, backgroundColor: '#f9f5f0', border: '1px solid #f0ebe4' }}
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={e => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                      <p className="text-xs font-medium mb-1" style={{ color: '#3b3b4f' }}>
                        {product.name}
                      </p>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-light" style={{ color: '#e85d2a' }}>{product.price}</span>
                        <span className="text-xs line-through" style={{ color: '#999' }}>{product.oldPrice}</span>
                      </div>
                      <button
                        className="w-full h-8 rounded-lg text-xs font-medium tracking-wider transition-colors"
                        style={{ border: '1px solid #e85d2a', color: '#e85d2a', backgroundColor: '#ffffff' }}
                      >
                        ADD TO BUNDLE
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Bundle total bar */}
              {showBundle && (
                <div
                  className="mt-4 flex items-center justify-between p-3 rounded-lg transition-opacity duration-500"
                  style={{ backgroundColor: '#fff8f5', border: '1px solid #fde0d2', opacity: showBundle ? 1 : 0 }}
                >
                  <div>
                    <p className="text-xs font-medium" style={{ color: '#e85d2a' }}>Bundle Deal</p>
                    <p className="text-[10px]" style={{ color: '#999' }}>Add all 3 items and save 20%</p>
                  </div>
                  <button
                    className="px-4 py-1.5 rounded-lg text-xs font-medium text-white"
                    style={{ backgroundColor: '#e85d2a' }}
                  >
                    ADD ALL TO CART — $113.60
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
