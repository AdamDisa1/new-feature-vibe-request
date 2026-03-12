import { useState } from 'react';
import { Plus, Minus, Star, Sparkles, Check, ArrowRight } from 'lucide-react';

interface CartItem {
  name: string;
  price: number;
  image: string;
  quantity: number;
  color: string;
}

interface SuggestedProduct {
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  badge?: string;
  color: string;
}

const CART_ITEMS: CartItem[] = [
  { name: 'Premium Leather Backpack', price: 89.99, image: '🎒', quantity: 1, color: '#8B5E3C' },
  { name: 'Wireless Noise-Canceling Headphones', price: 149.99, image: '🎧', quantity: 1, color: '#2D3748' },
];

const SUGGESTED_PRODUCTS: SuggestedProduct[] = [
  { name: 'Leather Wallet', price: 34.99, originalPrice: 49.99, image: '👛', rating: 4.8, badge: 'Best Match', color: '#8B5E3C' },
  { name: 'Portable Charger 20K', price: 29.99, image: '🔋', rating: 4.6, badge: 'Popular', color: '#38A169' },
  { name: 'Travel Organizer Pouch', price: 19.99, originalPrice: 24.99, image: '👝', rating: 4.4, color: '#4A5568' },
];

export default function CartPreview() {
  const [addedItems, setAddedItems] = useState<Set<number>>(new Set());
  const subtotal = CART_ITEMS.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f7f8fa' }}>
      {/* Fake top bar */}
      <div
        className="flex items-center justify-between px-6 flex-shrink-0 border-b"
        style={{ height: 56, backgroundColor: '#ffffff', borderColor: '#e5e8ef' }}
      >
        <div className="flex items-center gap-3">
          <span className="font-black text-xl" style={{ color: '#000', letterSpacing: -1 }}>WIX</span>
          <div className="w-px h-5" style={{ background: '#e5e8ef' }} />
          <span className="text-sm font-medium" style={{ color: '#32325d' }}>My Wix Site — Live Preview</span>
        </div>
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
          style={{ backgroundColor: '#e6f9f4', color: '#00b383' }}
        >
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#00b383' }} />
          Preview Mode
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold mb-6" style={{ color: '#16161d' }}>Your Cart</h1>

        <div className="flex gap-8">
          {/* Cart items */}
          <div className="flex-1 space-y-4">
            {CART_ITEMS.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 rounded-xl"
                style={{ backgroundColor: '#ffffff', border: '1px solid #e5e8ef' }}
              >
                <div
                  className="w-20 h-20 rounded-lg flex items-center justify-center text-3xl"
                  style={{ backgroundColor: `${item.color}15` }}
                >
                  {item.image}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold" style={{ color: '#16161d' }}>{item.name}</p>
                  <p className="text-xs mt-1" style={{ color: '#6b7280' }}>In stock</p>
                  <div className="flex items-center gap-3 mt-2">
                    <button className="w-7 h-7 rounded-full flex items-center justify-center" style={{ border: '1px solid #e5e8ef' }}>
                      <Minus className="w-3 h-3" style={{ color: '#6b7280' }} />
                    </button>
                    <span className="text-sm font-medium" style={{ color: '#16161d' }}>{item.quantity}</span>
                    <button className="w-7 h-7 rounded-full flex items-center justify-center" style={{ border: '1px solid #e5e8ef' }}>
                      <Plus className="w-3 h-3" style={{ color: '#6b7280' }} />
                    </button>
                  </div>
                </div>
                <p className="text-base font-bold" style={{ color: '#16161d' }}>${item.price.toFixed(2)}</p>
              </div>
            ))}

            {/* Upsell widget — the AI-generated section */}
            <div
              className="p-5 rounded-xl mt-6"
              style={{
                backgroundColor: '#ffffff',
                border: '2px solid transparent',
                backgroundClip: 'padding-box',
                position: 'relative',
              }}
            >
              <div
                className="absolute inset-0 rounded-xl -z-10"
                style={{ margin: -2, borderRadius: 14, background: 'linear-gradient(135deg, #116dff20, #a855f720, #116dff20)' }}
              />
              <div className="absolute inset-0 rounded-xl" style={{ backgroundColor: '#ffffff' }} />

              <div className="relative">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-4 h-4" style={{ color: '#116dff' }} />
                  <span className="text-sm font-bold" style={{ color: '#16161d' }}>Recommended for you</span>
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                    style={{ backgroundColor: '#e8f1fe', color: '#116dff' }}
                  >
                    AI Powered
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {SUGGESTED_PRODUCTS.map((product, i) => {
                    const isAdded = addedItems.has(i);
                    return (
                      <div
                        key={i}
                        className="rounded-lg p-3 transition-all"
                        style={{
                          border: '1px solid #e5e8ef',
                          backgroundColor: isAdded ? '#f0fdf4' : '#ffffff',
                        }}
                      >
                        {product.badge && (
                          <span
                            className="inline-block text-[10px] px-2 py-0.5 rounded-full font-medium mb-2"
                            style={{
                              backgroundColor: product.badge === 'Best Match' ? '#e8f1fe' : '#fef3c7',
                              color: product.badge === 'Best Match' ? '#116dff' : '#d97706',
                            }}
                          >
                            {product.badge}
                          </span>
                        )}
                        <div
                          className="w-full h-16 rounded flex items-center justify-center text-2xl mb-2"
                          style={{ backgroundColor: `${product.color}10` }}
                        >
                          {product.image}
                        </div>
                        <p className="text-xs font-semibold" style={{ color: '#16161d' }}>{product.name}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-3 h-3" style={{ color: '#f59e0b', fill: '#f59e0b' }} />
                          <span className="text-[10px]" style={{ color: '#6b7280' }}>{product.rating}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm font-bold" style={{ color: '#16161d' }}>${product.price.toFixed(2)}</span>
                          {product.originalPrice && (
                            <span className="text-xs line-through" style={{ color: '#9098a9' }}>${product.originalPrice.toFixed(2)}</span>
                          )}
                        </div>
                        <button
                          onClick={() => setAddedItems(prev => { const n = new Set(prev); n.add(i); return n; })}
                          className="w-full mt-2 h-7 rounded text-xs font-medium flex items-center justify-center gap-1 transition-all"
                          style={{
                            backgroundColor: isAdded ? '#00b383' : '#116dff',
                            color: '#ffffff',
                          }}
                        >
                          {isAdded ? (
                            <><Check className="w-3 h-3" /> Added</>
                          ) : (
                            <><Plus className="w-3 h-3" /> Add to Cart</>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Order summary */}
          <div className="w-80 flex-shrink-0">
            <div className="rounded-xl p-5 sticky top-8" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e8ef' }}>
              <h3 className="text-base font-bold mb-4" style={{ color: '#16161d' }}>Order Summary</h3>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span style={{ color: '#6b7280' }}>Subtotal ({CART_ITEMS.length} items)</span>
                  <span style={{ color: '#16161d' }}>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: '#6b7280' }}>Shipping</span>
                  <span style={{ color: '#00b383' }}>Free</span>
                </div>
                <div className="h-px" style={{ backgroundColor: '#e5e8ef' }} />
                <div className="flex justify-between">
                  <span className="text-sm font-bold" style={{ color: '#16161d' }}>Total</span>
                  <span className="text-lg font-bold" style={{ color: '#16161d' }}>${subtotal.toFixed(2)}</span>
                </div>
              </div>
              <button
                className="w-full h-11 rounded-lg text-sm font-bold text-white flex items-center justify-center gap-2"
                style={{ backgroundColor: '#116dff' }}
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
