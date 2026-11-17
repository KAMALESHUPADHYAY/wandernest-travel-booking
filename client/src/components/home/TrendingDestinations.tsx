'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { MapPin, TrendingUp, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function TrendingDestinations() {
  const { data, isLoading } = useQuery({
    queryKey: ['trending-destinations'],
    queryFn: async () => {
      const res = await api.get('/destinations?popular=true');
      return res.data?.data || [];
    },
  });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0071C2] mb-1">
            <TrendingUp className="h-4 w-4" />
            <span>Most Loved by Travelers</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Trending Destinations
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Most popular choices for international and domestic travelers
          </p>
        </div>

        <Link
          href="/destinations"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0071C2] hover:underline"
        >
          View all destinations <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-72 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data?.slice(0, 8).map((dest: any, index: number) => (
            <motion.div
              key={dest.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Link
                href={`/hotels?city=${encodeURIComponent(dest.city)}`}
                className="group relative block h-80 rounded-2xl overflow-hidden shadow-card hover:shadow-cardHover transition-all duration-300"
              >
                {/* Background Image with Zoom */}
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />

                {/* Top Badges */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/90 text-slate-900 backdrop-blur-sm shadow-sm">
                    {dest.country}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#FEBB02] text-slate-950 shadow-sm">
                    {dest.hotelCount || 12}+ properties
                  </span>
                </div>

                {/* Bottom Details */}
                <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-sky-200">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{dest.city}</span>
                  </div>
                  <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-[#FEBB02] transition-colors">
                    {dest.name}
                  </h3>
                  <div className="flex items-baseline justify-between pt-1 border-t border-white/20">
                    <span className="text-[11px] text-slate-300 font-medium">Starting from</span>
                    <span className="text-base font-black text-[#FEBB02]">
                      ${dest.startingPrice || 120}
                      <span className="text-[11px] font-normal text-slate-300"> / night</span>
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
