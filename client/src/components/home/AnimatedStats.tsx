'use client';

import React from 'react';
import { Users, Globe2, Star, ThumbsUp } from 'lucide-react';
import { motion } from 'framer-motion';

export function AnimatedStats() {
  const stats = [
    {
      value: '2,500,000+',
      label: 'Verified Stays Booked',
      icon: Users,
    },
    {
      value: '150+',
      label: 'Countries & Territories',
      icon: Globe2,
    },
    {
      value: '4.9 / 5',
      label: 'Average Traveler Rating',
      icon: Star,
    },
    {
      value: '98%',
      label: 'Guest Satisfaction Rate',
      icon: ThumbsUp,
    },
  ];

  return (
    <section className="bg-slate-900 text-white py-16 border-y border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="text-center space-y-2 p-4"
              >
                <div className="h-12 w-12 mx-auto rounded-2xl bg-white/10 flex items-center justify-center text-[#FEBB02]">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                  {stat.value}
                </div>
                <p className="text-xs sm:text-sm font-medium text-slate-400">
                  {stat.label}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
