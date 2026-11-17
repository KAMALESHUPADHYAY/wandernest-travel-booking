'use client';

import React from 'react';
import { ShieldCheck, Award, Headphones, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

export function TrustBadges() {
  const badges = [
    {
      icon: ShieldCheck,
      title: '2M+ Verified Properties',
      description: 'Handpicked hotels, villas & apartments across 150+ countries.',
      color: 'text-[#0071C2]',
      bg: 'bg-blue-50 dark:bg-blue-950/50',
    },
    {
      icon: RotateCcw,
      title: 'Free Cancellation',
      description: 'Plans change. Enjoy flexible booking policies on most stays.',
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/50',
    },
    {
      icon: Headphones,
      title: '24/7 Global Support',
      description: 'Our customer support team is on standby in 40+ languages.',
      color: 'text-[#FEBB02]',
      bg: 'bg-amber-50 dark:bg-amber-950/50',
    },
    {
      icon: Award,
      title: 'Best Price Guarantee',
      description: 'Found a lower public price elsewhere? We will match the difference.',
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-50 dark:bg-purple-950/50',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-12 relative z-20">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {badges.map((b, i) => {
            const Icon = b.icon;
            return (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex items-start gap-4"
              >
                <div className={`h-12 w-12 rounded-2xl ${b.bg} flex items-center justify-center shrink-0`}>
                  <Icon className={`h-6 w-6 ${b.color}`} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {b.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {b.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
