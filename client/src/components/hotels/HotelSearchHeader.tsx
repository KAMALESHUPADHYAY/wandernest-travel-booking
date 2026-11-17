'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Bed, Calendar, Users, Search, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';

export function HotelSearchHeader() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [destinationQuery, setDestinationQuery] = useState(searchParams.get('city') || '');
  const [checkInDate, setCheckInDate] = useState(
    searchParams.get('checkIn') ||
      (() => {
        const d = new Date();
        d.setDate(d.getDate() + 7);
        return d.toISOString().split('T')[0];
      })()
  );
  const [checkOutDate, setCheckOutDate] = useState(
    searchParams.get('checkOut') ||
      (() => {
        const d = new Date();
        d.setDate(d.getDate() + 11);
        return d.toISOString().split('T')[0];
      })()
  );

  const [adults, setAdults] = useState(parseInt(searchParams.get('guests') || '2', 10));
  const [rooms, setRooms] = useState(parseInt(searchParams.get('rooms') || '1', 10));
  const [isGuestPopoverOpen, setIsGuestPopoverOpen] = useState(false);

  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false);

  const autocompleteRef = useRef<HTMLDivElement>(null);
  const guestRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDestinationQuery(searchParams.get('city') || '');
  }, [searchParams]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await api.get(`/destinations/autocomplete?q=${encodeURIComponent(destinationQuery)}`);
        if (res.data?.success) setSuggestions(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    const t = setTimeout(() => {
      if (isAutocompleteOpen) fetchSuggestions();
    }, 200);
    return () => clearTimeout(t);
  }, [destinationQuery, isAutocompleteOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(e.target as Node)) {
        setIsAutocompleteOpen(false);
      }
      if (guestRef.current && !guestRef.current.contains(e.target as Node)) {
        setIsGuestPopoverOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (destinationQuery) params.set('city', destinationQuery);
    else params.delete('city');
    params.set('checkIn', checkInDate);
    params.set('checkOut', checkOutDate);
    params.set('guests', String(adults));
    params.set('rooms', String(rooms));
    params.set('page', '1');
    router.push(`/hotels?${params.toString()}`);
  };

  return (
    <div className="bg-[#003B95] text-white py-4 px-4 sm:px-6 lg:px-8 shadow-inner">
      <div className="max-w-7xl mx-auto">
        <form
          onSubmit={handleSearch}
          className="bg-[#FEBB02] p-1 rounded-2xl shadow-lg grid grid-cols-1 md:grid-cols-12 gap-1 items-center"
        >
          {/* Destination */}
          <div
            ref={autocompleteRef}
            className="relative md:col-span-4 bg-white dark:bg-slate-900 rounded-xl p-2.5 text-slate-900 dark:text-slate-100"
          >
            <label className="block text-[10px] font-bold uppercase text-slate-400">
              Destination
            </label>
            <div className="flex items-center gap-2 mt-0.5">
              <Bed className="h-4 w-4 text-[#0071C2] shrink-0" />
              <input
                type="text"
                value={destinationQuery}
                onChange={(e) => {
                  setDestinationQuery(e.target.value);
                  setIsAutocompleteOpen(true);
                }}
                onFocus={() => setIsAutocompleteOpen(true)}
                placeholder="Where to? (e.g. Paris, Goa, Tokyo)"
                className="w-full bg-transparent text-xs font-semibold outline-none placeholder:text-slate-400"
              />
            </div>

            {isAutocompleteOpen && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-2 z-50 max-h-64 overflow-y-auto">
                {suggestions.map((dest) => (
                  <button
                    key={dest.id}
                    type="button"
                    onClick={() => {
                      setDestinationQuery(dest.city);
                      setIsAutocompleteOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <img src={dest.image} alt={dest.name} className="h-7 w-7 rounded object-cover" />
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {dest.city}, {dest.country}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dates */}
          <div className="md:col-span-4 bg-white dark:bg-slate-900 rounded-xl p-2.5 text-slate-900 dark:text-slate-100 grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400">
                Check-in
              </label>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Calendar className="h-4 w-4 text-[#0071C2] shrink-0" />
                <input
                  type="date"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  className="w-full bg-transparent text-xs font-semibold outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400">
                Check-out
              </label>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Calendar className="h-4 w-4 text-[#0071C2] shrink-0" />
                <input
                  type="date"
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  className="w-full bg-transparent text-xs font-semibold outline-none"
                />
              </div>
            </div>
          </div>

          {/* Guests Popover */}
          <div
            ref={guestRef}
            className="relative md:col-span-3 bg-white dark:bg-slate-900 rounded-xl p-2.5 text-slate-900 dark:text-slate-100"
          >
            <button
              type="button"
              onClick={() => setIsGuestPopoverOpen(!isGuestPopoverOpen)}
              className="w-full text-left"
            >
              <label className="block text-[10px] font-bold uppercase text-slate-400">
                Guests & Rooms
              </label>
              <div className="flex items-center gap-2 mt-0.5">
                <Users className="h-4 w-4 text-[#0071C2] shrink-0" />
                <span className="text-xs font-semibold truncate">
                  {adults} Adults · {rooms} Room
                </span>
              </div>
            </button>

            {isGuestPopoverOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-4 z-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">Adults</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={adults <= 1}
                      onClick={() => setAdults((a) => Math.max(1, a - 1))}
                      className="h-7 w-7 rounded border border-slate-300 flex items-center justify-center disabled:opacity-40"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="text-xs font-bold w-4 text-center">{adults}</span>
                    <button
                      type="button"
                      onClick={() => setAdults((a) => a + 1)}
                      className="h-7 w-7 rounded border border-slate-300 flex items-center justify-center"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">Rooms</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={rooms <= 1}
                      onClick={() => setRooms((r) => Math.max(1, r - 1))}
                      className="h-7 w-7 rounded border border-slate-300 flex items-center justify-center disabled:opacity-40"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="text-xs font-bold w-4 text-center">{rooms}</span>
                    <button
                      type="button"
                      onClick={() => setRooms((r) => r + 1)}
                      className="h-7 w-7 rounded border border-slate-300 flex items-center justify-center"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                <Button
                  type="button"
                  size="sm"
                  onClick={() => setIsGuestPopoverOpen(false)}
                  className="w-full text-xs font-bold"
                >
                  Apply
                </Button>
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="md:col-span-1 p-0.5">
            <Button
              type="submit"
              variant="default"
              className="w-full h-11 bg-[#0071C2] hover:bg-[#005999] text-white font-bold rounded-xl flex items-center justify-center"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
