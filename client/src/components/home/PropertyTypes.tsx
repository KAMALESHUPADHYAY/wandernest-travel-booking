'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Building2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function PropertyTypes() {
  const { data: types, isLoading } = useQuery({
    queryKey: ['property-types'],
    queryFn: async () => {
      const res = await api.get('/hotels/property-types');
      return res.data?.data || [];
    },
  });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0071C2] mb-1">
            <Building2 className="h-4 w-4 text-[#FEBB02]" />
            <span>Curated Collections</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Browse by Property Type
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Choose from beachfront villas, cozy alpine chalets, or chic city apartments
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-56 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {types?.map((item: any, index: number) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
            >
              <Link
                href={`/hotels?type=${encodeURIComponent(item.name)}`}
                className="group block rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-card hover:shadow-cardHover transition-all"
              >
                <div className="h-36 overflow-hidden relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/0 transition-colors" />
                </div>
                <div className="p-3">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#0071C2] transition-colors truncate">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {item.count.toLocaleString()} stays
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
