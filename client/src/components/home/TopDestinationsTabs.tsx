'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Globe, MapPin, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function TopDestinationsTabs() {
  const [activeRegion, setActiveRegion] = useState<'india' | 'international'>('india');

  const { data: destinations, isLoading } = useQuery({
    queryKey: ['destinations-by-region', activeRegion],
    queryFn: async () => {
      const res = await api.get(`/destinations?region=${activeRegion}`);
      return res.data?.data || [];
    },
  });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0071C2] mb-1">
            <Globe className="h-4 w-4 text-[#FEBB02]" />
            <span>Regional Guides</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Top Destinations
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Explore unforgettable domestic Indian wonders or iconic world capitals
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveRegion('india')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeRegion === 'india'
                ? 'bg-white dark:bg-slate-900 text-[#0071C2] shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            🇮🇳 India Escapes
          </button>
          <button
            onClick={() => setActiveRegion('international')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeRegion === 'international'
                ? 'bg-white dark:bg-slate-900 text-[#0071C2] shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            ✈️ International
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-64 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        ) : (
          <motion.div
            key={activeRegion}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {destinations?.map((dest: any) => (
              <Link
                key={dest.id}
                href={`/hotels?city=${encodeURIComponent(dest.city)}`}
                className="group relative block h-64 rounded-2xl overflow-hidden shadow-card hover:shadow-cardHover transition-all border border-slate-200/50 dark:border-slate-800"
              >
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent" />

                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#FEBB02] text-slate-950 shadow-sm">
                    {dest.hotelCount || 8}+ stays
                  </span>
                </div>

                <div className="absolute bottom-3 left-4 right-4 text-white space-y-1">
                  <div className="flex items-center gap-1 text-[11px] text-sky-200">
                    <MapPin className="h-3 w-3" />
                    <span>{dest.country}</span>
                  </div>
                  <h3 className="text-lg font-bold group-hover:text-[#FEBB02] transition-colors leading-tight">
                    {dest.name}
                  </h3>
                  <div className="flex items-center justify-between pt-1 border-t border-white/20 text-xs">
                    <span className="text-slate-300 text-[11px]">Average night:</span>
                    <span className="font-black text-[#FEBB02]">
                      ${dest.startingPrice || 110}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
