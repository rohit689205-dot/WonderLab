import React, { useState, useEffect } from 'react';
import { ShoppingCart, TrendingUp } from 'lucide-react';
import { SHOP_ITEMS } from '../../constants';

const TOTAL_BUDGET = 100000000000; // 100 Billion

export const SpendBudget: React.FC = () => {
  const [cart, setCart] = useState<Record<number, number>>({});
  
  const totalSpent = SHOP_ITEMS.reduce((acc, item) => {
    return acc + (item.price * (cart[item.id] || 0));
  }, 0);
  
  const remaining = TOTAL_BUDGET - totalSpent;

  const buy = (id: number) => {
    if (remaining >= (SHOP_ITEMS.find(i => i.id === id)?.price || 0)) {
      setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    }
  };

  const sell = (id: number) => {
    if ((cart[id] || 0) > 0) {
      setCart(prev => ({ ...prev, [id]: prev[id] - 1 }));
    }
  };

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="w-full h-full bg-green-50 overflow-hidden flex flex-col">
      {/* Sticky Header */}
      <div className="bg-gradient-to-b from-green-600 to-green-500 text-white p-6 shadow-xl z-20 sticky top-0">
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-2">
          <h2 className="text-xl font-medium opacity-90">Remaining Budget</h2>
          <div className="text-4xl md:text-6xl font-black tracking-tighter">
            {formatMoney(remaining)}
          </div>
          <div className="w-full h-4 bg-green-800/30 rounded-full mt-2 overflow-hidden">
             <div 
               className="h-full bg-yellow-400 transition-all duration-300 ease-out"
               style={{ width: `${(totalSpent / TOTAL_BUDGET) * 100}%` }}
             />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {SHOP_ITEMS.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-green-100 p-6 flex flex-col items-center hover:shadow-md transition-shadow">
              <div className="text-5xl mb-4">{item.image}</div>
              <h3 className="font-bold text-slate-800 text-lg text-center leading-tight mb-1">{item.name}</h3>
              <p className="text-green-600 font-mono font-medium mb-6">{formatMoney(item.price)}</p>
              
              <div className="flex items-center gap-3 w-full mt-auto">
                <button 
                  onClick={() => sell(item.id)}
                  disabled={!cart[item.id]}
                  className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  -
                </button>
                <div className="flex-1 text-center font-bold text-slate-900 border border-slate-100 rounded-lg py-2">
                  {cart[item.id] || 0}
                </div>
                <button 
                  onClick={() => buy(item.id)}
                  disabled={remaining < item.price}
                  className="w-10 h-10 rounded-full bg-green-500 text-white font-bold hover:bg-green-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Receipt */}
        {totalSpent > 0 && (
          <div className="max-w-md mx-auto mt-12 bg-white p-8 shadow-lg rotate-1 mb-12">
            <h3 className="text-center font-mono text-xl font-bold border-b-2 border-dashed border-slate-300 pb-4 mb-4">RECEIPT</h3>
            {Object.entries(cart).map(([id, qty]) => {
              if (qty === 0) return null;
              const item = SHOP_ITEMS.find(i => i.id === Number(id));
              if (!item) return null;
              return (
                <div key={id} className="flex justify-between font-mono text-sm mb-2 text-slate-600">
                  <span>{item.name} x{qty}</span>
                  <span>{formatMoney(item.price * Number(qty))}</span>
                </div>
              );
            })}
            <div className="border-t-2 border-dashed border-slate-300 pt-4 mt-4 flex justify-between font-mono font-bold text-lg">
              <span>TOTAL</span>
              <span>{formatMoney(totalSpent)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};