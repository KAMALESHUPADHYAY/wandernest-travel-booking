'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, Clock, Calendar, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function TravelInspiration() {
  const blogs = [
    {
      id: 'switzerland-hidden-gems',
      title: '10 Hidden Alpine Gems in Switzerland You Need to See',
      category: 'Mountain Escapes',
      readTime: '5 min read',
      date: 'May 2026',
      image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80',
      snippet: 'From secluded glacier valleys near Zermatt to fairy-tale wooden chalets, discover the secret side of the Swiss Alps.',
    },
    {
      id: 'tokyo-food-guide',
      title: 'The Ultimate Culinary & Izakaya Guide to Shinjuku, Tokyo',
      category: 'Food & Culture',
      readTime: '7 min read',
      date: 'June 2026',
      image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
      snippet: 'Navigate smoky alleyways, Michelin-starred ramen counters, and underground whisky bars in Tokyo’s most electrifying hub.',
    },
    {
      id: 'bali-local-experience',
      title: 'How to Experience Bali Beyond the Tourist Trail in Ubud',
      category: 'Tropical Living',
      readTime: '6 min read',
      date: 'July 2026',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
      snippet: 'Unlock sacred water purification temples, hidden jungle waterfall pools, and authentic organic farm-to-table dining.',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0071C2] mb-1">
            <BookOpen className="h-4 w-4 text-[#FEBB02]" />
            <span>Travel Stories & Tips</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Travel Inspiration & Guides
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Expert itineraries, local recommendations, and insider travel advice
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {blogs.map((b, index) => (
          <motion.div
            key={b.id}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-card hover:shadow-cardHover transition-all flex flex-col justify-between"
          >
            <div>
              <div className="h-48 overflow-hidden relative">
                <img
                  src={b.image}
                  alt={b.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#003B95] text-white">
                  {b.category}
                </span>
              </div>

              <div className="p-5 space-y-2">
                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {b.readTime}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {b.date}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#0071C2] transition-colors leading-snug">
                  {b.title}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {b.snippet}
                </p>
              </div>
            </div>

            <div className="p-5 pt-0">
              <span className="inline-flex items-center gap-1 text-xs font-bold text-[#0071C2] group-hover:underline">
                Read full story <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
