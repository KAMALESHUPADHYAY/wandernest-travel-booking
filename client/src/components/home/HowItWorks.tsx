'use client';

import React from 'react';
import { Search, SlidersHorizontal, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function HowItWorks() {
  const steps = [
    {
      step: '01',
      title: 'Search & Discover',
      description: 'Enter your dream destination or flight route. Filter by price, star rating, verified guest scores, and property amenities.',
      icon: Search,
      color: 'bg-blue-50 dark:bg-blue-950/60 text-[#0071C2]',
    },
    {
      step: '02',
      title: 'Compare & Customize',
      description: 'Explore high-resolution galleries, transparent room tiers, authentic reviews, and flexible cancellation terms.',
      icon: SlidersHorizontal,
      color: 'bg-amber-50 dark:bg-amber-950/60 text-[#FEBB02]',
    },
    {
      step: '03',
      title: 'Instant Confirmation',
      description: 'Lock in your reservation in seconds with secure mock payment, zero booking fees, and an instant printable invoice voucher.',
      icon: CheckCircle2,
      color: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-[#0071C2]">
          Simple & Transparent
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          How WanderNest Works
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Booking your perfect holiday takes less than two minutes from start to finish
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        {steps.map((s, index) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.15 }}
              className="relative bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-card hover:shadow-cardHover transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`h-14 w-14 rounded-2xl ${s.color} flex items-center justify-center`}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <span className="font-mono text-3xl font-black text-slate-200 dark:text-slate-800">
                    {s.step}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {s.title}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {s.description}
                </p>
              </div>

              {index < steps.length - 1 && (
                <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                  <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 shadow-sm border border-slate-200 dark:border-slate-700">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
