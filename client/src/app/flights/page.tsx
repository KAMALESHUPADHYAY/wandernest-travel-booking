'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { FlightCard } from '@/components/flights/FlightCard';
import { FlightFilters, FlightFilterState } from '@/components/flights/FlightFilters';
import { FlightPriceCalendar } from '@/components/flights/FlightPriceCalendar';
import { Button } from '@/components/ui/button';
import {
  Plane,
  ArrowRightLeft,
  Calendar,
  Users,
  Search,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  ArrowUpDown,
  Filter,
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

function FlightsSearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Search input state
  const [tripType, setTripType] = useState<'round' | 'oneway'>(
    (searchParams.get('tripType') as 'round' | 'oneway') || 'oneway'
  );
  const [fromCity, setFromCity] = useState(
    searchParams.get('from') || searchParams.get('departureCity') || 'Delhi'
  );
  const [toCity, setToCity] = useState(
    searchParams.get('to') || searchParams.get('arrivalCity') || 'Goa'
  );
  const [departDate, setDepartDate] = useState(() => {
    const pDate = searchParams.get('departDate');
    if (pDate) return pDate;
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d.toISOString().split('T')[0];
  });
  const [returnDate, setReturnDate] = useState(() => {
    const rDate = searchParams.get('returnDate');
    if (rDate) return rDate;
    const d = new Date();
    d.setDate(d.getDate() + 10);
    return d.toISOString().split('T')[0];
  });
  const [passengers, setPassengers] = useState(
    parseInt(searchParams.get('passengers') || '1', 10) || 1
  );
  const [cabinClass, setCabinClass] = useState(
    searchParams.get('cabinClass') || 'ECONOMY'
  );

  // Filters state
  const [filters, setFilters] = useState<FlightFilterState>({
    stops: searchParams.get('stops') || 'all',
    airlines: searchParams.get('airlines') ? searchParams.get('airlines')!.split(',') : [],
    departureTimeWindow: searchParams.get('departureTimeWindow') || 'all',
    minPrice: searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined,
    maxPrice: searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined,
    cabinClass: searchParams.get('cabinClass') || 'ALL',
  });

  // Sort state
  const [sortBy, setSortBy] = useState<'cheapest' | 'fastest' | 'earliest'>(
    (searchParams.get('sortBy') as any) || 'cheapest'
  );

  // Data fetching state
  const [flights, setFlights] = useState<any[]>([]);
  const [availableAirlines, setAvailableAirlines] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Swap From & To cities
  const handleSwapCities = () => {
    setFromCity(toCity);
    setToCity(fromCity);
  };

  // Perform search
  const executeSearch = () => {
    const params = new URLSearchParams();
    if (fromCity) params.set('from', fromCity);
    if (toCity) params.set('to', toCity);
    if (departDate) params.set('departDate', departDate);
    if (tripType === 'round' && returnDate) params.set('returnDate', returnDate);
    if (tripType) params.set('tripType', tripType);
    if (passengers) params.set('passengers', String(passengers));
    if (cabinClass && cabinClass !== 'ALL') params.set('cabinClass', cabinClass);
    if (filters.stops && filters.stops !== 'all') params.set('stops', filters.stops);
    if (filters.airlines.length > 0) params.set('airlines', filters.airlines.join(','));
    if (filters.departureTimeWindow && filters.departureTimeWindow !== 'all') {
      params.set('departureTimeWindow', filters.departureTimeWindow);
    }
    if (filters.maxPrice) params.set('maxPrice', String(filters.maxPrice));
    if (sortBy) params.set('sortBy', sortBy);

    router.push(`/flights?${params.toString()}`);
  };

  // Fetch flights from API
  useEffect(() => {
    const fetchFlightsData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const queryParams = new URLSearchParams();
        if (fromCity) queryParams.set('from', fromCity);
        if (toCity) queryParams.set('to', toCity);
        if (passengers) queryParams.set('passengers', String(passengers));
        if (cabinClass && cabinClass !== 'ALL') queryParams.set('cabinClass', cabinClass);
        if (filters.stops && filters.stops !== 'all') queryParams.set('stops', filters.stops);
        if (filters.airlines.length > 0) queryParams.set('airlines', filters.airlines.join(','));
        if (filters.departureTimeWindow && filters.departureTimeWindow !== 'all') {
          queryParams.set('departureTimeWindow', filters.departureTimeWindow);
        }
        if (filters.maxPrice) queryParams.set('maxPrice', String(filters.maxPrice));
        if (sortBy) queryParams.set('sortBy', sortBy);
        queryParams.set('limit', '20');

        const res = await api.get(`/flights?${queryParams.toString()}`);
        if (res.data?.success) {
          setFlights(res.data.data || []);
          if (res.data.metadata?.availableAirlines) {
            setAvailableAirlines(res.data.metadata.availableAirlines);
          }
        } else {
          setFlights([]);
        }
      } catch (err: any) {
        console.error('Failed to fetch flights:', err);
        setError('Unable to load flight options. Please check your network and try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFlightsData();
  }, [fromCity, toCity, passengers, cabinClass, filters, sortBy]);

  const handleResetFilters = () => {
    setFilters({
      stops: 'all',
      airlines: [],
      departureTimeWindow: 'all',
      minPrice: undefined,
      maxPrice: undefined,
      cabinClass: 'ALL',
    });
  };

  return (
    <div className="min-w-0 min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      {/* Top Search Hero Header */}
      <section className="bg-[#003B95] text-white pt-8 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-[#FEBB02] mb-2">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Search hundreds of airlines in seconds</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                Compare and Book Flights
              </h1>
            </div>

            {/* Trip Type Toggle */}
            <div className="inline-flex p-1 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setTripType('oneway')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  tripType === 'oneway' ? 'bg-white text-[#003B95] shadow-sm' : 'text-white/80 hover:text-white'
                }`}
              >
                One-way
              </button>
              <button
                type="button"
                onClick={() => setTripType('round')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  tripType === 'round' ? 'bg-white text-[#003B95] shadow-sm' : 'text-white/80 hover:text-white'
                }`}
              >
                Round-trip
              </button>
            </div>
          </div>

          {/* Search Box Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              executeSearch();
            }}
            className="bg-white dark:bg-slate-900 rounded-2xl p-3 shadow-xl grid grid-cols-1 md:grid-cols-12 gap-2 text-slate-800 dark:text-slate-100 items-center border border-slate-200/50 dark:border-slate-800"
          >
            {/* Origin */}
            <div className="md:col-span-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 transition-colors">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Flying from
              </label>
              <div className="flex items-center gap-2 mt-0.5">
                <Plane className="h-4 w-4 text-[#0071C2] shrink-0" />
                <input
                  type="text"
                  value={fromCity}
                  onChange={(e) => setFromCity(e.target.value)}
                  placeholder="City or Airport (e.g. Delhi, BOM)"
                  className="w-full bg-transparent text-xs font-bold outline-none"
                  required
                />
              </div>
            </div>

            {/* Swap Button */}
            <div className="hidden md:flex md:col-span-1 justify-center">
              <button
                type="button"
                onClick={handleSwapCities}
                title="Swap origin and destination"
                className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-[#FEBB02] hover:text-slate-950 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-all border border-slate-200 dark:border-slate-700 active:rotate-180"
              >
                <ArrowRightLeft className="h-4 w-4" />
              </button>
            </div>

            {/* Destination */}
            <div className="md:col-span-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 transition-colors">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Flying to
              </label>
              <div className="flex items-center gap-2 mt-0.5">
                <Plane className="h-4 w-4 text-[#FEBB02] shrink-0 rotate-90" />
                <input
                  type="text"
                  value={toCity}
                  onChange={(e) => setToCity(e.target.value)}
                  placeholder="City or Airport (e.g. Goa, Paris)"
                  className="w-full bg-transparent text-xs font-bold outline-none"
                  required
                />
              </div>
            </div>

            {/* Dates */}
            <div className="md:col-span-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 transition-colors">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {tripType === 'round' ? 'Dates (Depart & Return)' : 'Departure Date'}
              </label>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Calendar className="h-4 w-4 text-[#0071C2] shrink-0" />
                <input
                  type="date"
                  value={departDate}
                  onChange={(e) => setDepartDate(e.target.value)}
                  className="w-full bg-transparent text-xs font-bold outline-none"
                  required
                />
                {tripType === 'round' && (
                  <>
                    <span className="text-slate-300 dark:text-slate-600">&ndash;</span>
                    <input
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="w-full bg-transparent text-xs font-bold outline-none"
                      required
                    />
                  </>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2 p-1">
              <Button
                type="submit"
                variant="default"
                className="w-full h-12 bg-[#0071C2] hover:bg-[#005999] text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
              >
                <Search className="h-4 w-4" />
                <span>Search</span>
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Main Results Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        {/* Price Calendar Strip */}
        <FlightPriceCalendar
          currentDate={departDate}
          onSelectDate={(newDate) => {
            setDepartDate(newDate);
          }}
          basePrice={flights.length > 0 ? flights[0].price : 75}
        />

        {/* Results Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
              {fromCity && toCity
                ? `Flights from ${fromCity} to ${toCity}`
                : 'All Available Flights'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isLoading
                ? 'Searching airlines...'
                : `${flights.length} flights found &bull; Prices include taxes & fees`}
            </p>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden">
              <Dialog open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 rounded-xl text-xs font-bold flex items-center gap-1.5"
                  >
                    <Filter className="h-3.5 w-3.5 text-[#0071C2]" />
                    <span>Filters</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-base font-bold">Flight Filters</DialogTitle>
                  </DialogHeader>
                  <FlightFilters
                    filters={filters}
                    onChange={(newFilters) => {
                      setFilters(newFilters);
                    }}
                    onReset={handleResetFilters}
                    availableAirlines={availableAirlines}
                  />
                </DialogContent>
              </Dialog>
            </div>

            {/* Sort Dropdown / Segmented Buttons */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setSortBy('cheapest')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  sortBy === 'cheapest'
                    ? 'bg-[#0071C2] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Cheapest
              </button>
              <button
                type="button"
                onClick={() => setSortBy('fastest')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  sortBy === 'fastest'
                    ? 'bg-[#0071C2] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Fastest
              </button>
              <button
                type="button"
                onClick={() => setSortBy('earliest')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  sortBy === 'earliest'
                    ? 'bg-[#0071C2] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Earliest
              </button>
            </div>
          </div>
        </div>

        {/* Content Layout: Left Sidebar + Right Results List */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-20">
            <FlightFilters
              filters={filters}
              onChange={setFilters}
              onReset={handleResetFilters}
              availableAirlines={availableAirlines}
            />
          </aside>

          {/* Results Column */}
          <section className="lg:col-span-8 space-y-4">
            {/* Loading Skeletons */}
            {isLoading && (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm animate-pulse space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800" />
                        <div className="space-y-1.5">
                          <div className="w-24 h-4 bg-slate-200 dark:bg-slate-800 rounded" />
                          <div className="w-16 h-3 bg-slate-200 dark:bg-slate-800 rounded" />
                        </div>
                      </div>
                      <div className="w-28 h-6 bg-slate-200 dark:bg-slate-800 rounded-full" />
                    </div>

                    <div className="grid grid-cols-7 items-center gap-2 pt-2">
                      <div className="col-span-2 space-y-1">
                        <div className="w-16 h-6 bg-slate-200 dark:bg-slate-800 rounded" />
                        <div className="w-20 h-3 bg-slate-200 dark:bg-slate-800 rounded" />
                      </div>
                      <div className="col-span-3 flex flex-col items-center gap-1">
                        <div className="w-12 h-3 bg-slate-200 dark:bg-slate-800 rounded" />
                        <div className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded" />
                      </div>
                      <div className="col-span-2 space-y-1 flex flex-col items-end">
                        <div className="w-16 h-6 bg-slate-200 dark:bg-slate-800 rounded" />
                        <div className="w-20 h-3 bg-slate-200 dark:bg-slate-800 rounded" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Error State */}
            {!isLoading && error && (
              <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-2xl p-8 text-center space-y-3">
                <AlertTriangle className="h-10 w-10 text-rose-500 mx-auto" />
                <h3 className="font-bold text-slate-900 dark:text-slate-100">Unable to load flights</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">{error}</p>
                <Button
                  onClick={() => executeSearch()}
                  variant="outline"
                  size="sm"
                  className="rounded-xl font-bold"
                >
                  Retry Search
                </Button>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && flights.length === 0 && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-10 text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center mx-auto text-[#0071C2]">
                  <Plane className="h-7 w-7 rotate-45" />
                </div>
                <div className="space-y-1 max-w-md mx-auto">
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    No flights match your search criteria
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    We couldn&apos;t find any flights between &ldquo;{fromCity}&rdquo; and &ldquo;{toCity}&rdquo; with your selected filters. Try searching between major hubs or reset your filters.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  <Button
                    onClick={handleResetFilters}
                    variant="outline"
                    size="sm"
                    className="rounded-xl font-bold text-xs flex items-center gap-1.5"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Clear all filters</span>
                  </Button>
                  <Button
                    onClick={() => {
                      setFromCity('Mumbai');
                      setToCity('Goa');
                    }}
                    variant="default"
                    size="sm"
                    className="rounded-xl font-bold text-xs bg-[#0071C2] hover:bg-[#005999] text-white"
                  >
                    Try Mumbai ➔ Goa
                  </Button>
                  <Button
                    onClick={() => {
                      setFromCity('Delhi');
                      setToCity('Goa');
                    }}
                    variant="default"
                    size="sm"
                    className="rounded-xl font-bold text-xs bg-[#0071C2] hover:bg-[#005999] text-white"
                  >
                    Try Delhi ➔ Goa
                  </Button>
                </div>
              </div>
            )}

            {/* Flight Results Cards */}
            {!isLoading && !error && flights.length > 0 && (
              <div className="space-y-4">
                {flights.map((flight) => (
                  <FlightCard key={flight.id} flight={flight} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default function FlightsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
          <div className="animate-pulse flex items-center gap-2 text-sm font-semibold text-slate-500">
            <Plane className="h-5 w-5 text-[#0071C2] animate-bounce" />
            <span>Loading WanderNest flights...</span>
          </div>
        </div>
      }
    >
      <FlightsSearchContent />
    </Suspense>
  );
}
