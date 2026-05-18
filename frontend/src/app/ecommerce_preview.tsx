"use client";

import React, { useState } from 'react';
import { ShoppingBag, Star, RefreshCw, X, ShoppingCart, Sparkles } from 'lucide-react';

export default function LuxuryStorefront({ name }: { name: string }) {
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const products = [
    { id: "p-1", name: "Signature Drop Oversized Hoodie", desc: "Heavyweight loopback pre-shrunk organic cotton drop-shoulder hoodie.", price: "$120.00", img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7" },
    { id: "p-2", name: "Tailored Double-Breasted Trench", desc: "Sleek, water-resistant luxury utility silhouette trenchcoat.", price: "$280.00", img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea" },
    { id: "p-3", name: "Raw Selvedge Denim Jacket", desc: "Japanese selvedge indigo dyed premium construction chore coat.", price: "$195.00", img: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0" }
  ];

  const addToCart = (product: any) => {
    setCart(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="p-6 bg-zinc-950 min-h-[500px] text-zinc-100 font-sans select-none rounded-[2rem] border border-white/5 m-4 relative overflow-hidden">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="flex justify-between items-center border-b border-white/5 pb-4">
          <div>
            <h1 className="text-base font-bold flex items-center gap-2 text-white">
              <ShoppingBag className="w-4 h-4 text-blue-500" />
              Boutique Storefront: {name}
            </h1>
            <p className="text-[9px] text-zinc-500 uppercase tracking-widest mt-0.5 font-bold">Premium Luxury Curation Marketplace</p>
          </div>
          <button 
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold hover:bg-white/10 transition-all relative"
          >
            <ShoppingCart className="w-4 h-4 text-zinc-300" />
            Cart
            {cart.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-blue-600 text-[9px] text-white flex items-center justify-center font-bold">
                {cart.reduce((a, b) => a + b.qty, 0)}
              </span>
            )}
          </button>
        </header>

        {/* Product Grid */}
        <div className="grid grid-cols-3 gap-6">
          {products.map((p) => (
            <div key={p.id} className="border border-white/5 rounded-3xl bg-zinc-900/30 overflow-hidden flex flex-col group hover:border-white/10 transition-colors shadow-lg">
              <div className="h-44 bg-zinc-950 relative overflow-hidden flex items-center justify-center">
                <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-700 opacity-80" />
                <button 
                  onClick={() => addToCart(p)}
                  className="absolute bottom-3 right-3 h-8 px-3 rounded-lg bg-white text-zinc-950 font-bold text-[10px] flex items-center gap-1.5 shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 uppercase tracking-wider"
                >
                  Quick Add
                </button>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold text-white tracking-tight">{p.name}</h3>
                  <p className="text-[9px] text-zinc-500 mt-1 leading-relaxed">{p.desc}</p>
                </div>
                <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-white/5">
                  <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Retail price</span>
                  <span className="text-xs font-mono font-bold text-white">{p.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Drawer */}
        {isCartOpen && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end">
            <div className="w-80 bg-zinc-950 border-l border-white/10 p-5 flex flex-col justify-between animate-slide-in">
              <div className="space-y-5 overflow-y-auto flex-1 scrollbar-none">
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                    Checkout Bag
                  </h3>
                  <button onClick={() => setIsCartOpen(false)} className="text-zinc-500 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {cart.length === 0 ? (
                  <p className="text-[10px] text-zinc-600 py-20 text-center font-mono uppercase tracking-wider">Your shopping cart is currently empty.</p>
                ) : (
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div key={item.id} className="p-3 bg-white/[0.01] border border-white/5 rounded-2xl flex gap-3 justify-between items-center">
                        <div className="min-w-0">
                          <div className="text-[10px] font-bold text-white truncate">{item.name}</div>
                          <div className="text-[8px] text-zinc-500 font-mono mt-0.5">{item.qty} × {item.price}</div>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-[8px] uppercase tracking-wider font-bold text-red-400 hover:bg-white/5 px-2 py-1 rounded">Remove</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="pt-4 border-t border-white/5 space-y-3">
                  <button 
                    onClick={() => {
                      alert("Secure simulated Stripe Link checkout initialized!");
                      setCart([]);
                      setIsCartOpen(false);
                    }}
                    className="w-full h-10 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-[10px] uppercase tracking-widest shadow-2xl transition-all"
                  >
                    Checkout with Stripe
                  </button>
                  <p className="text-[8px] text-zinc-600 text-center uppercase tracking-wider font-bold">Secure payments verified</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
