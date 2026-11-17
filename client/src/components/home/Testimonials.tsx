'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Star, MessageSquareQuote, CheckCircle, ThumbsUp } from 'lucide-react';
import { motion } from 'framer-motion';

export function Testimonials() {
  const { data: reviews, isLoading } = useQuery({
    queryKey: ['landing-testimonials'],
    queryFn: async () => {
      const res = await api.get('/reviews');
      return res.data?.data || [];
    },
  });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0071C2] mb-1">
            <MessageSquareQuote className="h-4 w-4 text-[#FEBB02]" />
            <span>Real Guest Experiences</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Loved by 500,000+ Happy Travelers
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Verified guest reviews from travelers who booked stays through WanderNest
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((n) => (
            <div key={n} className="h-48 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews?.map((rev: any, index: number) => (
            <motion.div
              key={rev.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-card hover:shadow-cardHover transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Rating & Trip Type */}
                <div className="flex items-center justify-between">
                  <div className="flex text-[#FEBB02]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(rev.rating) ? 'fill-current' : 'text-slate-300 dark:text-slate-700'
                        }`}
                      />
                    ))}
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/60 text-[#0071C2]">
                    {rev.tripType} Trip
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  &ldquo;{rev.title}&rdquo;
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
                  {rev.comment}
                </p>

                {rev.pros && (
                  <div className="pt-2 flex items-start gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    <ThumbsUp className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                    <span>{rev.pros}</span>
                  </div>
                )}
              </div>

              {/* User Profile Footer */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={rev.user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${rev.user?.name}`}
                    alt={rev.user?.name}
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-[#0071C2]"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1">
                      {rev.user?.name}
                      <CheckCircle className="h-3 w-3 text-emerald-500" />
                    </h4>
                    <p className="text-[10px] text-slate-400">Verified Traveler</p>
                  </div>
                </div>

                {rev.hotel && (
                  <div className="text-right text-[11px] font-medium text-slate-500">
                    Stayed at <span className="font-bold text-[#0071C2]">{rev.hotel.name}</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
