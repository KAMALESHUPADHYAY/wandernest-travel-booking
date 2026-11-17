'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, Palmtree, Mountain, Building, Flame, HeartHandshake, Baby } from 'lucide-react';
import { motion } from 'framer-motion';

export function ExploreThemes() {
  const themes = [
    {
      id: 'beach',
      title: 'Beach & Coastal',
      subtitle: 'Sun, sand & azure waters',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
      icon: Palmtree,
      color: 'bg-cyan-500',
    },
    {
      id: 'mountains',
      title: 'Mountain Escapes',
      subtitle: 'Alpine peaks & crisp air',
      image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=600&q=80',
      icon: Mountain,
      color: 'bg-emerald-600',
    },
    {
      id: 'city',
      title: 'City Lights',
      subtitle: 'Culture, dining & nightlife',
      image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&q=80',
      icon: Building,
      color: 'bg-blue-600',
    },
    {
      id: 'adventure',
      title: 'Outdoor Adventure',
      subtitle: 'Trekking, rafting & safari',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80',
      icon: Flame,
      color: 'bg-amber-500',
    },
    {
      id: 'honeymoon',
      title: 'Romantic Getaways',
      subtitle: 'Intimate retreats & villas',
      image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=600&q=80',
      icon: HeartHandshake,
      color: 'bg-rose-500',
    },
    {
      id: 'family',
      title: 'Family Friendly',
      subtitle: 'Spacious suites & activities',
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80',
      icon: Baby,
      color: 'bg-violet-600',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0071C2] mb-1">
          <Compass className="h-4 w-4 text-[#FEBB02]" />
          <span>Trip Styles</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          Explore by Travel Theme
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Find stays customized around how you love to vacation
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {themes.map((theme, index) => {
          const Icon = theme.icon;
          return (
            <motion.div
              key={theme.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
            >
              <Link
                href={`/hotels?theme=${theme.id}`}
                className="group relative block h-64 rounded-2xl overflow-hidden shadow-card hover:shadow-cardHover transition-all"
              >
                <img
                  src={theme.image}
                  alt={theme.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />

                <div className="absolute top-3 left-3">
                  <div className={`h-8 w-8 rounded-lg ${theme.color} text-white flex items-center justify-center shadow-md`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="text-sm font-bold tracking-tight group-hover:text-[#FEBB02] transition-colors leading-tight">
                    {theme.title}
                  </h3>
                  <p className="text-[10px] text-slate-300 mt-0.5 line-clamp-1">
                    {theme.subtitle}
                  </p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
