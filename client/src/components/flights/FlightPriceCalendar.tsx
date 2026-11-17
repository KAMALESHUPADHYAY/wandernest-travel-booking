'use client';

import React from 'react';
import { formatPrice } from '@/lib/utils';
import { Sparkles, Calendar } from 'lucide-react';

interface FlightPriceCalendarProps {
  currentDate: string;
  onSelectDate: (date: string) => void;
  basePrice?: number;
}

export function FlightPriceCalendar({
  currentDate,
  onSelectDate,
  basePrice = 75,
}: FlightPriceCalendarProps) {
  // Generate 7 consecutive days centered around or starting from currentDate
  const days = React.useMemo(() => {
    const center = new Date(currentDate || new Date());
    const result = [];
    for (let i = -3; i <= 3; i++) {
      const d = new Date(center);
      d.setDate(d.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      
      // Deterministic slight price variation for demo calendar
      const dayOffset = (d.getDate() * 17) % 35;
      const price = Math.max(55, basePrice - 15 + dayOffset);
      
      result.push({
        date: iso,
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        formattedDate: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        price,
        isLowest: false,
      });
    }

    // Mark the cheapest date
    let minPrice = Infinity;
    let minIdx = -1;
    result.forEach((item, idx) => {
      if (item.price < minPrice) {
        minPrice = item.price;
        minIdx = idx;
      }
    });
    if (minIdx !== -1) {
      result[minIdx].isLowest = true;
    }

    return result;
  }, [currentDate, basePrice]);

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-sm">
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
          <Calendar className="h-4 w-4 text-[#0071C2]" />
          <span>Flexible dates? View cheapest flight days:</span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
          <Sparkles className="h-3 w-3" />
          <span>Cheapest-day price hint</span>
        </div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
        {days.map((item) => {
          const isSelected = item.date === currentDate;

          return (
            <button
              key={item.date}
              type="button"
              onClick={() => onSelectDate(item.date)}
              className={`relative flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all text-center ${
                isSelected
                  ? 'bg-[#003B95] text-white border-[#003B95] shadow-md ring-2 ring-[#0071C2]/30 scale-[1.02]'
                  : item.isLowest
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700 hover:border-emerald-500'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-[#0071C2] dark:hover:border-[#0071C2]'
              }`}
            >
              {item.isLowest && (
                <span className={`absolute -top-2 px-1.5 py-0.2 rounded-full text-[9px] font-black uppercase tracking-wider ${
                  isSelected ? 'bg-[#FEBB02] text-slate-950' : 'bg-emerald-600 text-white'
                }`}>
                  Cheapest
                </span>
              )}

              <span
                className={`text-[11px] font-medium ${
                  isSelected ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {item.dayName}, {item.formattedDate}
              </span>
              <span
                className={`text-xs font-bold mt-0.5 ${
                  isSelected
                    ? 'text-white'
                    : item.isLowest
                    ? 'text-emerald-700 dark:text-emerald-400'
                    : 'text-slate-900 dark:text-slate-100'
                }`}
              >
                {formatPrice(item.price, 'INR')}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
