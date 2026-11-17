'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Bed, Plane, Calendar, Users, MapPin, Search, Plus, Minus, ArrowRightLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export function HeroSearch() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'stays' | 'flights'>('stays');

  // Stays Search State
  const [destinationQuery, setDestinationQuery] = useState('');
  const [destinationSuggestions, setDestinationSuggestions] = useState<any[]>([]);
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<any>(null);

  const [checkInDate, setCheckInDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [checkOutDate, setCheckOutDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 11);
    return d.toISOString().split('T')[0];
  });

  // Guest & Room Popover State
  const [isGuestPopoverOpen, setIsGuestPopoverOpen] = useState(false);
  const [adults, setAdults] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);
  const [rooms, setRooms] = useState(1);

  // Flights Search State
  const [flightType, setFlightType] = useState<'round' | 'oneway'>('round');
  const [flightOrigin, setFlightOrigin] = useState('New York');
  const [flightDestination, setFlightDestination] = useState('Paris');
  const [flightDepart, setFlightDepart] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });
  const [flightReturn, setFlightReturn] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 21);
    return d.toISOString().split('T')[0];
  });
  const [flightCabin, setFlightCabin] = useState('ECONOMY');

  const autocompleteRef = useRef<HTMLDivElement>(null);
  const guestRef = useRef<HTMLDivElement>(null);

  // Fetch autocomplete suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await api.get(`/destinations/autocomplete?q=${encodeURIComponent(destinationQuery)}`);
        if (res.data?.success) {
          setDestinationSuggestions(res.data.data);
        }
      } catch (err) {
        console.error('Autocomplete query failed:', err);
      }
    };

    const timer = setTimeout(() => {
      if (isAutocompleteOpen) {
        fetchSuggestions();
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [destinationQuery, isAutocompleteOpen]);

  // Click outside listener for dropdowns
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

  const handleStaysSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const city = selectedDestination?.city || destinationQuery || 'Paris';
    router.push(`/hotels?city=${encodeURIComponent(city)}&checkIn=${checkInDate}&checkOut=${checkOutDate}&guests=${adults + childrenCount}&rooms=${rooms}`);
  };

  const handleFlightsSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/flights?departureCity=${encodeURIComponent(flightOrigin)}&arrivalCity=${encodeURIComponent(flightDestination)}&cabinClass=${flightCabin}&departDate=${flightDepart}`);
  };

  return (
    <section className="relative bg-[#003B95] text-white pt-8 pb-24 sm:pb-28 px-4 sm:px-6 lg:px-8 overflow-visible">
      {/* Background Graphic Accents */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />
      
      <div className="max-w-7xl mx-auto space-y-6 relative z-10">
        {/* Hero Title & Value Proposition */}
        <div className="space-y-3 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-[#FEBB02] border border-white/15"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Discover 2M+ hotels, villas & flight deals</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]"
          >
            Find your next stay <br />
            <span className="text-[#FEBB02]">anywhere in the world</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg text-sky-100 max-w-2xl font-normal leading-relaxed"
          >
            Compare rates on iconic luxury retreats, boutique city suites, and worldwide flights with flexible cancellations and no hidden booking fees.
          </motion.p>
        </div>

        {/* Tab Switcher (Stays | Flights) */}
        <div className="pt-2">
          <div className="inline-flex rounded-2xl bg-white/10 p-1.5 backdrop-blur-md border border-white/20">
            <button
              type="button"
              onClick={() => setActiveTab('stays')}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'stays'
                  ? 'bg-white text-[#003B95] shadow-md'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              <Bed className="h-4 w-4 text-[#0071C2]" />
              Stays & Hotels
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('flights')}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'flights'
                  ? 'bg-white text-[#003B95] shadow-md'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              <Plane className="h-4 w-4 text-[#0071C2]" />
              Flights
            </button>
          </div>
        </div>

        {/* The Big Booking Search Box */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="bg-[#FEBB02] p-1 rounded-2xl shadow-2xl relative z-30"
        >
          {activeTab === 'stays' ? (
            /* STAYS SEARCH FORM */
            <form onSubmit={handleStaysSearch} className="bg-white dark:bg-slate-900 rounded-xl p-2 grid grid-cols-1 md:grid-cols-12 gap-2 text-slate-800 dark:text-slate-100 items-center">
              {/* Field 1: Destination Autocomplete */}
              <div ref={autocompleteRef} className="relative md:col-span-4 p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border border-transparent focus-within:border-[#0071C2]">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Where are you going?
                </label>
                <div className="flex items-center gap-2 mt-0.5">
                  <Bed className="h-5 w-5 text-[#0071C2] shrink-0" />
                  <input
                    type="text"
                    value={destinationQuery}
                    onChange={(e) => {
                      setDestinationQuery(e.target.value);
                      setIsAutocompleteOpen(true);
                      setSelectedDestination(null);
                    }}
                    onFocus={() => setIsAutocompleteOpen(true)}
                    placeholder="e.g. Paris, Tokyo, Bali, Goa..."
                    className="w-full bg-transparent text-sm font-semibold outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
                    required
                  />
                </div>

                {/* Autocomplete Dropdown */}
                {isAutocompleteOpen && (
                  <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-2 z-50 max-h-72 overflow-y-auto">
                    <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Popular Destinations
                    </div>
                    {destinationSuggestions.map((dest) => (
                      <button
                        key={dest.id}
                        type="button"
                        onClick={() => {
                          setSelectedDestination(dest);
                          setDestinationQuery(`${dest.city}, ${dest.country}`);
                          setIsAutocompleteOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-3.5 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <img
                          src={dest.image}
                          alt={dest.name}
                          className="h-9 w-9 rounded-lg object-cover shrink-0"
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                            {dest.city}, {dest.country}
                          </p>
                          <p className="text-[10px] text-slate-500">{dest.name}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Field 2: Dates (Check-in / Check-out) */}
              <div className="md:col-span-4 p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors grid grid-cols-2 gap-2 border border-transparent focus-within:border-[#0071C2]">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Check-in Date
                  </label>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Calendar className="h-4 w-4 text-[#0071C2] shrink-0" />
                    <input
                      type="date"
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      className="w-full bg-transparent text-xs font-semibold outline-none text-slate-900 dark:text-slate-100"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Check-out Date
                  </label>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Calendar className="h-4 w-4 text-[#0071C2] shrink-0" />
                    <input
                      type="date"
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      className="w-full bg-transparent text-xs font-semibold outline-none text-slate-900 dark:text-slate-100"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Field 3: Guests & Rooms Popover */}
              <div ref={guestRef} className="relative md:col-span-3 p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border border-transparent focus-within:border-[#0071C2]">
                <button
                  type="button"
                  onClick={() => setIsGuestPopoverOpen(!isGuestPopoverOpen)}
                  className="w-full text-left"
                >
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Guests & Rooms
                  </label>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Users className="h-4 w-4 text-[#0071C2] shrink-0" />
                    <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {adults} Adults · {childrenCount} Children · {rooms} Room
                    </span>
                  </div>
                </button>

                {isGuestPopoverOpen && (
                  <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-4 z-50 space-y-4">
                    {/* Adults */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Adults</p>
                        <p className="text-[10px] text-slate-500">Ages 18 or above</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          disabled={adults <= 1}
                          onClick={() => setAdults((a) => Math.max(1, a - 1))}
                          className="h-8 w-8 rounded-lg border border-slate-300 dark:border-slate-700 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="text-xs font-bold w-4 text-center">{adults}</span>
                        <button
                          type="button"
                          onClick={() => setAdults((a) => a + 1)}
                          className="h-8 w-8 rounded-lg border border-slate-300 dark:border-slate-700 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Children */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Children</p>
                        <p className="text-[10px] text-slate-500">Ages 0 to 17</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          disabled={childrenCount <= 0}
                          onClick={() => setChildrenCount((c) => Math.max(0, c - 1))}
                          className="h-8 w-8 rounded-lg border border-slate-300 dark:border-slate-700 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="text-xs font-bold w-4 text-center">{childrenCount}</span>
                        <button
                          type="button"
                          onClick={() => setChildrenCount((c) => c + 1)}
                          className="h-8 w-8 rounded-lg border border-slate-300 dark:border-slate-700 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Rooms */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Rooms</p>
                        <p className="text-[10px] text-slate-500">Total room units</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          disabled={rooms <= 1}
                          onClick={() => setRooms((r) => Math.max(1, r - 1))}
                          className="h-8 w-8 rounded-lg border border-slate-300 dark:border-slate-700 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="text-xs font-bold w-4 text-center">{rooms}</span>
                        <button
                          type="button"
                          onClick={() => setRooms((r) => r + 1)}
                          className="h-8 w-8 rounded-lg border border-slate-300 dark:border-slate-700 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    <Button
                      type="button"
                      onClick={() => setIsGuestPopoverOpen(false)}
                      variant="default"
                      size="sm"
                      className="w-full text-xs font-bold"
                    >
                      Done
                    </Button>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="md:col-span-1 p-1">
                <Button
                  type="submit"
                  variant="default"
                  className="w-full h-12 bg-[#0071C2] hover:bg-[#005999] text-white font-bold rounded-xl flex items-center justify-center shadow-md transition-transform active:scale-95"
                >
                  <Search className="h-5 w-5" />
                  <span className="md:hidden ml-2 font-bold">Search Stays</span>
                </Button>
              </div>
            </form>
          ) : (
            /* FLIGHTS SEARCH FORM */
            <form onSubmit={handleFlightsSearch} className="bg-white dark:bg-slate-900 rounded-xl p-3 grid grid-cols-1 md:grid-cols-12 gap-2 text-slate-800 dark:text-slate-100 items-center">
              <div className="md:col-span-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent focus-within:border-[#0071C2]">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Flying from
                </label>
                <div className="flex items-center gap-2 mt-0.5">
                  <Plane className="h-4 w-4 text-[#0071C2] shrink-0" />
                  <input
                    type="text"
                    value={flightOrigin}
                    onChange={(e) => setFlightOrigin(e.target.value)}
                    placeholder="Origin (e.g. New York, London, Delhi)"
                    className="w-full bg-transparent text-xs font-semibold outline-none"
                    required
                  />
                </div>
              </div>

              <div className="md:col-span-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent focus-within:border-[#0071C2]">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Flying to
                </label>
                <div className="flex items-center gap-2 mt-0.5">
                  <MapPin className="h-4 w-4 text-[#FEBB02] shrink-0" />
                  <input
                    type="text"
                    value={flightDestination}
                    onChange={(e) => setFlightDestination(e.target.value)}
                    placeholder="Destination (e.g. Paris, Tokyo, Dubai)"
                    className="w-full bg-transparent text-xs font-semibold outline-none"
                    required
                  />
                </div>
              </div>

              <div className="md:col-span-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent focus-within:border-[#0071C2]">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Departure Date
                </label>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Calendar className="h-4 w-4 text-[#0071C2] shrink-0" />
                  <input
                    type="date"
                    value={flightDepart}
                    onChange={(e) => setFlightDepart(e.target.value)}
                    className="w-full bg-transparent text-xs font-semibold outline-none"
                    required
                  />
                </div>
              </div>

              <div className="md:col-span-2 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent focus-within:border-[#0071C2]">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Cabin Class
                </label>
                <select
                  value={flightCabin}
                  onChange={(e) => setFlightCabin(e.target.value)}
                  className="w-full bg-transparent text-xs font-semibold outline-none mt-1 cursor-pointer"
                >
                  <option value="ECONOMY">Economy</option>
                  <option value="BUSINESS">Business Class</option>
                  <option value="FIRST">First Class</option>
                </select>
              </div>

              <div className="md:col-span-1 p-1">
                <Button
                  type="submit"
                  variant="default"
                  className="w-full h-12 bg-[#0071C2] hover:bg-[#005999] text-white font-bold rounded-xl flex items-center justify-center shadow-md transition-transform active:scale-95"
                >
                  <Search className="h-5 w-5" />
                </Button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
