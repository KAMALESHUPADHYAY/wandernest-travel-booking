'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Star, Heart, MapPin, Sparkles, ChevronRight, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export function PopularHotels() {
  const { user, openAuthModal, refreshUser } = useAuth();
  const queryClient = useQueryClient();
  const [wishlistIds, setWishlistIds] = useState<Record<string, boolean>>({});

  const { data: hotels, isLoading } = useQuery({
    queryKey: ['featured-hotels'],
    queryFn: async () => {
      const res = await api.get('/hotels?featured=true');
      return res.data?.data || [];
    },
  });

  const wishlistMutation = useMutation({
    mutationFn: async (hotelId: string) => {
      const res = await api.post('/wishlist/toggle', { hotelId });
      return { hotelId, data: res.data };
    },
    onSuccess: ({ hotelId, data }) => {
      setWishlistIds((prev) => ({
        ...prev,
        [hotelId]: data.action === 'added',
      }));
      toast.success(data.message);
      refreshUser();
      queryClient.invalidateQueries({ queryKey: ['user-wishlist'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Could not update wishlist');
    },
  });

  const handleWishlistToggle = (e: React.MouseEvent, hotelId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.info('Please sign in to save your favorite hotels');
      openAuthModal('login');
      return;
    }
    wishlistMutation.mutate(hotelId);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0071C2] mb-1">
            <Sparkles className="h-4 w-4 text-[#FEBB02]" />
            <span>Handpicked Luxury</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Popular Properties Travelers Love
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Highest-rated stays with exceptional amenities, locations, and service
          </p>
        </div>

        <Link
          href="/hotels"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0071C2] hover:underline"
        >
          Explore all stays <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-96 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels?.slice(0, 6).map((hotel: any, index: number) => {
            const isSaved = wishlistIds[hotel.id] !== undefined ? wishlistIds[hotel.id] : false;
            const primaryImage = hotel.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80';

            return (
              <motion.div
                key={hotel.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-card hover:shadow-cardHover transition-all duration-300 overflow-hidden flex flex-col"
              >
                {/* Image & Wishlist Button */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={primaryImage}
                    alt={hotel.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />

                  {/* Wishlist Heart */}
                  <button
                    onClick={(e) => handleWishlistToggle(e, hotel.id)}
                    className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-all text-slate-600 dark:text-slate-200"
                    aria-label="Save to wishlist"
                  >
                    <Heart
                      className={`h-4 w-4 transition-colors ${
                        isSaved ? 'fill-rose-500 text-rose-500' : 'hover:text-rose-500'
                      }`}
                    />
                  </button>

                  {/* Star Rating Badge */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-lg text-white text-xs font-semibold">
                    <div className="flex text-[#FEBB02]">
                      {Array.from({ length: hotel.starRating || 5 }).map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-current" />
                      ))}
                    </div>
                    <span className="text-[11px] ml-1">{hotel.starRating} Stars</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <MapPin className="h-3.5 w-3.5 text-[#0071C2]" />
                      <span>{hotel.city}, {hotel.country}</span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#0071C2] transition-colors line-clamp-1">
                      {hotel.name}
                    </h3>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {hotel.description}
                    </p>
                  </div>

                  {/* Score & Pricing Row */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    {/* Score */}
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-[#003B95] text-white flex items-center justify-center font-black text-xs">
                        {hotel.rating.toFixed(1)}
                      </div>
                      <div className="text-left">
                        <span className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                          {hotel.rating >= 4.8 ? 'Exceptional' : 'Very Good'}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {hotel.reviewCount} verified reviews
                        </span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <span className="block text-[10px] text-slate-400 uppercase font-semibold">Starting from</span>
                      <span className="text-lg font-black text-[#0071C2]">
                        ${hotel.pricePerNight}
                        <span className="text-xs font-normal text-slate-500"> / night</span>
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
}
