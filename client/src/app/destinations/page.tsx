'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  MapPin,
  Star,
  Search,
  Compass,
  Sparkles,
  Hotel,
  ArrowRight,
  RotateCcw,
  AlertTriangle,
  Palmtree,
  Mountain,
  Building2,
  Tent,
  Heart,
  Users,
} from 'lucide-react';
import { motion } from 'framer-motion';

function DestinationsListingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [selectedRegion, setSelectedRegion] = useState<'all' | 'india' | 'international'>(
    (searchParams.get('region') as any) || 'all'
  );

  const [destinations, setDestinations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    { name: 'All', icon: Compass },
    { name: 'Beach', icon: Palmtree },
    { name: 'Mountains', icon: Mountain },
    { name: 'City', icon: Building2 },
    { name: 'Adventure', icon: Tent },
    { name: 'Honeymoon', icon: Heart },
    { name: 'Family', icon: Users },
  ];

  const updateFilters = (cat: string, reg: string, q: string) => {
    const params = new URLSearchParams();
    if (cat && cat !== 'All') params.set('category', cat);
    if (reg && reg !== 'all') params.set('region', reg);
    if (q.trim()) params.set('search', q.trim());
    router.push(`/destinations?${params.toString()}`);
  };

  useEffect(() => {
    const fetchDestinations = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (selectedCategory !== 'All') params.set('category', selectedCategory);
        if (selectedRegion !== 'all') params.set('region', selectedRegion);
        if (searchQuery.trim()) params.set('search', searchQuery.trim());

        const res = await api.get(`/destinations?${params.toString()}`);
        if (res.data?.success) {
          setDestinations(res.data.data || []);
        } else {
          setDestinations([]);
        }
      } catch (err) {
        console.error('Failed to fetch destinations:', err);
        setError('Unable to load destinations. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(fetchDestinations, 200);
    return () => clearTimeout(timer);
  }, [selectedCategory, selectedRegion, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      {/* Hero Header */}
      <section className="bg-[#003B95] text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />
        
        <div className="max-w-7xl mx-auto space-y-6 relative z-10 text-center sm:text-left">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-[#FEBB02] border border-white/15">
              <Sparkles className="h-3.5 w-3.5" />
              <span>World-Class Curated Destinations</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Explore Dream Destinations
            </h1>
            <p className="text-sm sm:text-base text-blue-100">
              From sun-drenched tropical beaches and regal palaces to snowy alpine peaks &mdash; discover hand-picked stays and flights across the globe.
            </p>
          </div>

          {/* Search Box */}
          <div className="max-w-2xl bg-white dark:bg-slate-900 rounded-2xl p-2 shadow-xl flex items-center gap-2 border border-slate-200/50 dark:border-slate-800">
            <Search className="h-5 w-5 text-[#0071C2] ml-3 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                updateFilters(selectedCategory, selectedRegion, e.target.value);
              }}
              placeholder="Search by city, country or attraction (e.g. Goa, Paris, Swiss Alps)..."
              className="w-full bg-transparent text-sm font-semibold text-slate-800 dark:text-slate-100 outline-none px-2 py-2"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  updateFilters(selectedCategory, selectedRegion, '');
                }}
                className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1 font-bold"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 space-y-6">
        {/* Filter Controls Bar */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat.name);
                    updateFilters(cat.name, selectedRegion, searchQuery);
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    isSelected
                      ? 'bg-[#0071C2] text-white shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isSelected ? 'text-[#FEBB02]' : 'text-slate-400'}`} />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>

          {/* Region Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl self-start md:self-auto shrink-0">
            {[
              { id: 'all', label: 'All Regions' },
              { id: 'india', label: 'India' },
              { id: 'international', label: 'International' },
            ].map((reg) => (
              <button
                key={reg.id}
                type="button"
                onClick={() => {
                  setSelectedRegion(reg.id as any);
                  updateFilters(selectedCategory, reg.id, searchQuery);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedRegion === reg.id
                    ? 'bg-[#003B95] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {reg.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm animate-pulse space-y-3"
              >
                <div className="h-48 w-full bg-slate-200 dark:bg-slate-800" />
                <div className="p-4 space-y-2">
                  <div className="w-24 h-4 bg-slate-200 dark:bg-slate-800 rounded" />
                  <div className="w-40 h-5 bg-slate-200 dark:bg-slate-800 rounded" />
                  <div className="w-full h-10 bg-slate-200 dark:bg-slate-800 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-2xl p-8 text-center space-y-3">
            <AlertTriangle className="h-10 w-10 text-rose-500 mx-auto" />
            <h3 className="font-bold text-slate-900 dark:text-slate-100">Unable to load destinations</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">{error}</p>
            <Button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedRegion('all');
                setSearchQuery('');
              }}
              variant="outline"
              size="sm"
              className="rounded-xl font-bold"
            >
              Reset Filters
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && destinations.length === 0 && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center mx-auto text-[#0071C2]">
              <Compass className="h-8 w-8" />
            </div>
            <div className="space-y-1 max-w-md mx-auto">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                No destinations found
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                No destinations matched &ldquo;{searchQuery || selectedCategory}&rdquo;. Try another keyword or reset filters.
              </p>
            </div>
            <Button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedRegion('all');
                setSearchQuery('');
                updateFilters('All', 'all', '');
              }}
              variant="default"
              size="sm"
              className="rounded-xl font-bold text-xs bg-[#0071C2] hover:bg-[#005999] text-white flex items-center gap-1.5 mx-auto"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset all filters</span>
            </Button>
          </div>
        )}

        {/* Destinations Grid */}
        {!isLoading && !error && destinations.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {destinations.map((dest) => (
              <Link
                key={dest.id}
                href={`/destinations/${dest.slug}`}
                className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                {/* Image & Badge Overlay */}
                <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                  <Image
                    src={dest.image}
                    alt={dest.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20" />

                  {/* Category Pill */}
                  <div className="absolute top-3 left-3 bg-[#003B95]/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                    {dest.category || 'Featured'}
                  </div>

                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md text-slate-900 dark:text-slate-100 text-xs font-black px-2 py-0.5 rounded-lg shadow-sm flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-[#FEBB02] text-[#FEBB02]" />
                    <span>4.9</span>
                  </div>

                  {/* Bottom Image Overlay Label */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="text-lg font-black tracking-tight drop-shadow-sm group-hover:text-[#FEBB02] transition-colors">
                      {dest.name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-white/90 drop-shadow-sm">
                      <MapPin className="h-3 w-3 text-[#FEBB02] shrink-0" />
                      <span>{dest.city}, {dest.country}</span>
                    </div>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {dest.description}
                  </p>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <Hotel className="h-3.5 w-3.5 text-[#0071C2]" />
                      <span className="font-semibold">{dest.hotelCount || 1} stays</span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-medium">Stays from</span>
                      <span className="text-sm font-black text-[#003B95] dark:text-blue-400">
                        {formatPrice(dest.startingPrice || 120, 'INR')}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function DestinationsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
          <div className="animate-pulse flex items-center gap-2 text-sm font-semibold text-slate-500">
            <Compass className="h-5 w-5 text-[#0071C2] animate-spin" />
            <span>Loading WanderNest destinations...</span>
          </div>
        </div>
      }
    >
      <DestinationsListingContent />
    </Suspense>
  );
}
