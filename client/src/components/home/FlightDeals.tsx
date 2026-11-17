'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Plane, Clock, ArrowRight, ArrowRightLeft, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export function FlightDeals() {
  const { data: flights, isLoading } = useQuery({
    queryKey: ['flight-deals'],
    queryFn: async () => {
      const res = await api.get('/flights?deals=true');
      return res.data?.data || [];
    },
  });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0071C2] mb-1">
            <Plane className="h-4 w-4 text-[#FEBB02]" />
            <span>Exclusive Airfare Offers</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Top Global Flight Deals
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Direct airline fares and non-stop international routes at guaranteed low prices
          </p>
        </div>

        <Link
          href="/flights"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0071C2] hover:underline"
        >
          Explore all flights <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-44 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {flights?.map((flight: any, index: number) => {
            const durationHours = Math.floor(flight.duration / 60);
            const durationMins = flight.duration % 60;

            return (
              <motion.div
                key={flight.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-card hover:shadow-cardHover transition-all flex flex-col justify-between space-y-4"
              >
                {/* Airline & Status Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={flight.airlineLogo}
                      alt={flight.airline}
                      className="h-8 w-8 rounded-lg object-cover"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {flight.airline}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-mono">{flight.flightNumber}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/60 text-[#0071C2]">
                    {flight.stops === 0 ? 'Direct Non-Stop' : `${flight.stops} Stop`}
                  </span>
                </div>

                {/* Route Visualization */}
                <div className="flex items-center justify-between pt-2">
                  <div className="text-left">
                    <span className="text-xl font-black text-slate-900 dark:text-slate-100">
                      {flight.departureAirport}
                    </span>
                    <span className="block text-[11px] text-slate-500">{flight.departureCity}</span>
                  </div>

                  <div className="flex-1 px-4 flex flex-col items-center">
                    <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {durationHours}h {durationMins > 0 ? `${durationMins}m` : ''}
                    </span>
                    <div className="w-full flex items-center my-1">
                      <div className="h-[1.5px] flex-1 bg-slate-200 dark:bg-slate-700" />
                      <Plane className="h-3.5 w-3.5 text-[#0071C2] mx-1 transform rotate-90" />
                      <div className="h-[1.5px] flex-1 bg-slate-200 dark:bg-slate-700" />
                    </div>
                    <span className="text-[9px] uppercase font-bold text-emerald-600 dark:text-emerald-400">
                      {flight.cabinClass}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-xl font-black text-slate-900 dark:text-slate-100">
                      {flight.arrivalAirport}
                    </span>
                    <span className="block text-[11px] text-slate-500">{flight.arrivalCity}</span>
                  </div>
                </div>

                {/* Price and CTA */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase font-semibold">One-way fare</span>
                    <span className="text-lg font-black text-[#0071C2]">
                      ${flight.price}
                    </span>
                  </div>

                  <Link href={`/flights?departureCity=${encodeURIComponent(flight.departureCity)}&arrivalCity=${encodeURIComponent(flight.arrivalCity)}`}>
                    <Button variant="default" size="sm" className="text-xs font-bold bg-[#0071C2] hover:bg-[#005999]">
                      Select Flight
                    </Button>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
}
