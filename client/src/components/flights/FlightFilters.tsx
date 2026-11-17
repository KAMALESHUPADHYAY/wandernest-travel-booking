'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import { SlidersHorizontal, RotateCcw, Clock, Plane, ShieldCheck, Sun, Moon, Sunset, Sunrise } from 'lucide-react';

export interface FlightFilterState {
  stops: string;
  airlines: string[];
  departureTimeWindow: string;
  minPrice?: number;
  maxPrice?: number;
  cabinClass: string;
}

interface FlightFiltersProps {
  filters: FlightFilterState;
  onChange: (filters: FlightFilterState) => void;
  onReset: () => void;
  availableAirlines: string[];
  minAvailablePrice?: number;
  maxAvailablePrice?: number;
}

export function FlightFilters({
  filters,
  onChange,
  onReset,
  availableAirlines = [],
  minAvailablePrice = 50,
  maxAvailablePrice = 1000,
}: FlightFiltersProps) {
  const handleStopChange = (val: string) => {
    onChange({ ...filters, stops: val });
  };

  const handleAirlineToggle = (airline: string) => {
    const current = [...filters.airlines];
    const index = current.indexOf(airline);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(airline);
    }
    onChange({ ...filters, airlines: current });
  };

  const handleTimeWindowChange = (val: string) => {
    onChange({
      ...filters,
      departureTimeWindow: filters.departureTimeWindow === val ? 'all' : val,
    });
  };

  const timeWindows = [
    { id: 'early-morning', label: 'Before 6 AM', icon: Sunrise, sub: '00:00 - 06:00' },
    { id: 'morning', label: '6 AM - 12 PM', icon: Sun, sub: '06:00 - 12:00' },
    { id: 'afternoon', label: '12 PM - 6 PM', icon: Sunset, sub: '12:00 - 18:00' },
    { id: 'evening', label: 'After 6 PM', icon: Moon, sub: '18:00 - 24:00' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-[#0071C2]" />
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Filter Flights</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="h-8 px-2 text-xs text-slate-500 hover:text-[#0071C2] hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Reset</span>
        </Button>
      </div>

      {/* Stops */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Stops
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'all', label: 'Any stops' },
            { id: '0', label: 'Non-stop' },
            { id: '1', label: '1 Stop' },
            { id: '2', label: '2+ Stops' },
          ].map((s) => {
            const isSelected = filters.stops === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => handleStopChange(s.id)}
                className={`px-3 py-2 text-xs font-semibold rounded-xl border text-center transition-all ${
                  isSelected
                    ? 'bg-[#0071C2] text-white border-[#0071C2] shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-[#0071C2]'
                }`}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Departure Time Slots */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Departure Time
        </label>
        <div className="grid grid-cols-2 gap-2">
          {timeWindows.map((tw) => {
            const Icon = tw.icon;
            const isSelected = filters.departureTimeWindow === tw.id;
            return (
              <button
                key={tw.id}
                type="button"
                onClick={() => handleTimeWindowChange(tw.id)}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                  isSelected
                    ? 'bg-[#0071C2] text-white border-[#0071C2] shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-[#0071C2]'
                }`}
              >
                <Icon className={`h-4 w-4 mb-1 ${isSelected ? 'text-[#FEBB02]' : 'text-slate-400'}`} />
                <span className="text-[11px] font-bold leading-tight">{tw.label}</span>
                <span className={`text-[9px] mt-0.5 ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                  {tw.sub}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Airlines */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <span>Airlines</span>
          {filters.airlines.length > 0 && (
            <span className="text-[10px] text-[#0071C2] font-semibold">
              {filters.airlines.length} selected
            </span>
          )}
        </label>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {availableAirlines.length > 0 ? (
            availableAirlines.map((airline) => {
              const isChecked = filters.airlines.includes(airline);
              return (
                <label
                  key={airline}
                  className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleAirlineToggle(airline)}
                    className="h-4 w-4 rounded border-slate-300 text-[#0071C2] focus:ring-[#0071C2]"
                  />
                  <span className="flex-1 truncate">{airline}</span>
                </label>
              );
            })
          ) : (
            <div className="text-xs text-slate-400 py-1">All airlines active</div>
          )}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Max Price
          </label>
          <span className="text-xs font-bold text-[#0071C2]">
            {formatPrice(filters.maxPrice || maxAvailablePrice, 'INR')}
          </span>
        </div>
        <input
          type="range"
          min={minAvailablePrice}
          max={maxAvailablePrice}
          step={20}
          value={filters.maxPrice || maxAvailablePrice}
          onChange={(e) => onChange({ ...filters, maxPrice: parseFloat(e.target.value) })}
          className="w-full accent-[#0071C2] cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-400 font-medium">
          <span>{formatPrice(minAvailablePrice, 'INR')}</span>
          <span>{formatPrice(maxAvailablePrice, 'INR')}</span>
        </div>
      </div>

      {/* Booking.com Confidence Trust Callout */}
      <div className="p-3 bg-blue-50/70 dark:bg-blue-950/30 rounded-xl border border-blue-100 dark:border-blue-900/40 text-xs text-slate-700 dark:text-slate-300 space-y-1.5">
        <div className="flex items-center gap-1.5 font-bold text-[#003B95] dark:text-blue-400">
          <ShieldCheck className="h-4 w-4 shrink-0 text-[#0071C2]" />
          <span>WanderNest Flight Guarantee</span>
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
          Transparent pricing with zero hidden booking fees. 24/7 dedicated support for rebooking & cancellations.
        </p>
      </div>
    </div>
  );
}
