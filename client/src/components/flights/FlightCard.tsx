'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Plane, Luggage, Clock, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface FlightCardProps {
  flight: {
    id: string;
    flightNumber: string;
    airline: string;
    airlineLogo: string;
    departureAirport: string;
    arrivalAirport: string;
    departureCity: string;
    arrivalCity: string;
    departureTime: string;
    arrivalTime: string;
    duration: number; // in minutes
    stops: number;
    price: number;
    cabinClass: string;
    baggage?: string;
    seatAvailability: number;
    featured?: boolean;
  };
  onSelect?: (flight: any) => void;
}

export function FlightCard({ flight, onSelect }: FlightCardProps) {
  const [isSelected, setIsSelected] = useState(false);

  // Format times
  const depDate = new Date(flight.departureTime);
  const arrDate = new Date(flight.arrivalTime);

  const formatFlightTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const formatDuration = (mins: number) => {
    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;
    if (hours === 0) return `${minutes}m`;
    if (minutes === 0) return `${hours}h`;
    return `${hours}h ${minutes}m`;
  };

  const handleSelectFlight = () => {
    setIsSelected(true);
    // Store in sessionStorage for multi-step checkout
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('wandernest_selected_flight', JSON.stringify(flight));
    }
    toast.success(`Flight selected: ${flight.airline} (${flight.flightNumber})`, {
      description: `${flight.departureCity} (${flight.departureAirport}) ➔ ${flight.arrivalCity} (${flight.arrivalAirport}) for ${formatPrice(flight.price, 'INR')}. Ready for checkout!`,
    });
    if (onSelect) onSelect(flight);
  };

  return (
    <div className={`relative bg-white dark:bg-slate-900 border rounded-2xl p-5 shadow-sm transition-all hover:shadow-md ${
      isSelected
        ? 'border-[#0071C2] ring-2 ring-[#0071C2]/20'
        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
    }`}>
      {/* Featured / Best Deal Banner */}
      {flight.featured && (
        <div className="absolute -top-3 left-6 bg-[#FEBB02] text-slate-950 font-black text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1">
          <Sparkles className="h-3 w-3" />
          <span>Best Deal Pick</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Flight Route Info (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Airline Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 p-1.5 flex items-center justify-center border border-slate-200 dark:border-slate-700 overflow-hidden shrink-0">
                <Plane className="h-5 w-5 text-[#0071C2]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                    {flight.airline}
                  </h4>
                  <span className="text-xs text-slate-400 font-mono">
                    {flight.flightNumber}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0071C2] bg-blue-50 dark:bg-blue-950/50 px-2 py-0.2 rounded">
                    {flight.cabinClass}
                  </span>
                  {flight.seatAvailability <= 10 && (
                    <span className="text-[10px] font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Only {flight.seatAvailability} seats left!
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Baggage Pill */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
              <Luggage className="h-3.5 w-3.5 text-[#0071C2]" />
              <span>{flight.baggage || '7kg Cabin + 15kg Check-in'}</span>
            </div>
          </div>

          {/* Schedule Trajectory */}
          <div className="grid grid-cols-7 items-center gap-2 pt-2">
            {/* Departure */}
            <div className="col-span-2">
              <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                {formatFlightTime(depDate)}
              </span>
              <div className="mt-0.5">
                <span className="font-bold text-xs text-slate-700 dark:text-slate-300">
                  {flight.departureAirport}
                </span>
                <span className="text-xs text-slate-500 block truncate">
                  {flight.departureCity}
                </span>
              </div>
            </div>

            {/* Middle Duration Bar */}
            <div className="col-span-3 flex flex-col items-center justify-center px-2">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                {formatDuration(flight.duration)}
              </span>
              <div className="w-full relative flex items-center">
                <div className="w-full h-[2px] bg-slate-200 dark:bg-slate-700" />
                <Plane className="h-3.5 w-3.5 text-[#0071C2] absolute left-1/2 -translate-x-1/2 -translate-y-[1px] rotate-90" />
              </div>
              <span className={`text-[10px] font-bold mt-1.5 ${
                flight.stops === 0
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-amber-600 dark:text-amber-400'
              }`}>
                {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop`}
              </span>
            </div>

            {/* Arrival */}
            <div className="col-span-2 text-right">
              <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                {formatFlightTime(arrDate)}
              </span>
              <div className="mt-0.5">
                <span className="font-bold text-xs text-slate-700 dark:text-slate-300">
                  {flight.arrivalAirport}
                </span>
                <span className="text-xs text-slate-500 block truncate">
                  {flight.arrivalCity}
                </span>
              </div>
            </div>
          </div>

          {/* Mobile Baggage Info */}
          <div className="sm:hidden flex items-center gap-1.5 text-xs text-slate-500 pt-1">
            <Luggage className="h-3.5 w-3.5 text-[#0071C2]" />
            <span>{flight.baggage || '7kg Cabin + 15kg Check-in'}</span>
          </div>
        </div>

        {/* Right Price & Select Button (4 cols) */}
        <div className="lg:col-span-4 lg:border-l lg:border-slate-100 lg:dark:border-slate-800 lg:pl-6 pt-4 lg:pt-0 flex flex-row lg:flex-col items-center lg:items-end justify-between gap-4">
          <div className="text-left lg:text-right">
            <div className="flex items-baseline lg:justify-end gap-1">
              <span className="text-2xl sm:text-3xl font-black text-[#003B95] dark:text-blue-400">
                {formatPrice(flight.price, 'INR')}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              per passenger &bull; taxes & fees included
            </p>
            <div className="hidden sm:flex items-center lg:justify-end gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
              <CheckCircle2 className="h-3 w-3" />
              <span>Free cancellation within 24h</span>
            </div>
          </div>

          <Button
            onClick={handleSelectFlight}
            variant="default"
            className={`w-full sm:w-auto lg:w-full h-11 rounded-xl font-bold transition-all shadow-sm flex items-center justify-center gap-2 ${
              isSelected
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-[#0071C2] hover:bg-[#005999] text-white active:scale-98'
            }`}
          >
            {isSelected ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                <span>Selected</span>
              </>
            ) : (
              <>
                <span>Select flight</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
