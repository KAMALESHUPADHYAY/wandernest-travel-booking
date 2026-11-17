'use client';

import React from 'react';
import Link from 'next/link';
import { Star, MapPin, Heart, Check, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface HotelCardProps {
  hotel: any;
  isSaved?: boolean;
  onToggleWishlist?: (hotelId: string) => void;
  checkIn?: string;
  checkOut?: string;
  guests?: string;
}

export function HotelCard({
  hotel,
  isSaved = false,
  onToggleWishlist,
  checkIn,
  checkOut,
  guests,
}: HotelCardProps) {
  const { user, openAuthModal } = useAuth();

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.info('Please sign in to save your favorite hotels');
      openAuthModal('login');
      return;
    }
    if (onToggleWishlist) onToggleWishlist(hotel.id);
  };

  const primaryImage =
    hotel.images?.[0] ||
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80';

  // Build detail link with preserved search params
  const queryParams = new URLSearchParams();
  if (checkIn) queryParams.set('checkIn', checkIn);
  if (checkOut) queryParams.set('checkOut', checkOut);
  if (guests) queryParams.set('guests', guests);
  const detailHref = `/hotels/${hotel.id}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

  return (
    <div className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-card hover:shadow-cardHover transition-all overflow-hidden flex flex-col md:flex-row">
      {/* Left: Thumbnail & Wishlist Button */}
      <div className="relative md:w-72 lg:w-80 h-56 md:h-auto shrink-0 overflow-hidden">
        <Link href={detailHref}>
          <img
            src={primaryImage}
            alt={hotel.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Wishlist Heart */}
        <button
          onClick={handleWishlistClick}
          className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-all text-slate-600 dark:text-slate-200"
          aria-label="Save to wishlist"
        >
          <Heart
            className={`h-4 w-4 transition-colors ${
              isSaved ? 'fill-rose-500 text-rose-500' : 'hover:text-rose-500'
            }`}
          />
        </button>

        {/* Featured Tag */}
        {hotel.featured && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-black bg-[#FEBB02] text-slate-950 shadow-sm flex items-center gap-1">
            <Sparkles className="h-3 w-3" /> Top Pick
          </span>
        )}
      </div>

      {/* Center & Right: Content */}
      <div className="p-5 md:p-6 flex-1 flex flex-col justify-between space-y-4">
        {/* Top Info Header */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <div className="flex text-[#FEBB02]">
                  {Array.from({ length: hotel.starRating || 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <span className="text-[11px] text-slate-400 font-medium">Hotel</span>
              </div>

              <Link href={detailHref}>
                <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#0071C2] transition-colors leading-snug">
                  {hotel.name}
                </h3>
              </Link>

              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                <MapPin className="h-3.5 w-3.5 text-[#0071C2] shrink-0" />
                <span className="truncate">{hotel.address}, {hotel.city}</span>
                <span className="text-slate-300">•</span>
                <span className="text-[#0071C2] font-semibold text-[11px]">Show on map</span>
              </div>
            </div>

            {/* Score Badge */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="text-right hidden sm:block">
                <span className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  {hotel.rating >= 4.8 ? 'Exceptional' : 'Very Good'}
                </span>
                <span className="text-[10px] text-slate-400">{hotel.reviewCount} reviews</span>
              </div>
              <div className="h-9 w-9 rounded-xl bg-[#003B95] text-white flex items-center justify-center font-black text-sm shadow-sm">
                {hotel.rating.toFixed(1)}
              </div>
            </div>
          </div>

          {/* Perks & Features */}
          <div className="pt-2 flex flex-wrap gap-2 text-xs">
            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg">
              <Check className="h-3.5 w-3.5" /> Free cancellation
            </span>
            <span className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-300 font-medium bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
              No prepayment needed
            </span>
            {hotel.amenities?.slice(0, 2).map((a: string, i: number) => (
              <span key={i} className="text-slate-500 dark:text-slate-400 text-xs px-2 py-1 bg-slate-50 dark:bg-slate-800/60 rounded-lg">
                {a}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Row: Room preview & Price CTA */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="text-xs text-slate-500 space-y-0.5">
            <span className="block font-bold text-slate-700 dark:text-slate-300">
              {hotel.rooms?.[0]?.name || 'Standard Deluxe Queen Room'}
            </span>
            <span className="text-[11px] text-slate-400">
              {hotel.rooms?.[0]?.bedType || '1 Extra-Large Double Bed'}
            </span>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-4">
            <div className="text-right">
              <span className="block text-[10px] text-slate-400 uppercase font-semibold">1 night, 2 adults</span>
              <span className="text-xl md:text-2xl font-black text-slate-900 dark:text-slate-100">
                ${hotel.pricePerNight}
              </span>
              <span className="block text-[10px] text-slate-400">+ $15 taxes and charges</span>
            </div>

            <Link href={detailHref}>
              <Button
                variant="default"
                className="bg-[#0071C2] hover:bg-[#005999] text-white font-bold px-5 h-11 rounded-xl shadow-md flex items-center gap-1.5"
              >
                <span>See availability</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
