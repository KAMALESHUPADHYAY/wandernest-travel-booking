'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal, RotateCcw, Star, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HotelFilterSidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export function HotelFilterSidebar({ isMobileOpen, onCloseMobile }: HotelFilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Price range state
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

  // Star ratings state (array of numbers)
  const currentStars = searchParams.get('starRating')
    ? searchParams.get('starRating')!.split(',')
    : [];

  // Minimum rating
  const currentMinRating = searchParams.get('minRating') || '';

  // Free cancellation
  const currentFreeCancellation = searchParams.get('freeCancellation') === 'true';

  // Amenities
  const currentAmenities = searchParams.get('amenities')
    ? searchParams.get('amenities')!.split(',')
    : [];

  const updateFilters = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value.trim() !== '') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set('page', '1');
    router.push(`/hotels?${params.toString()}`);
  };

  const handleStarToggle = (star: string) => {
    let updated: string[];
    if (currentStars.includes(star)) {
      updated = currentStars.filter((s) => s !== star);
    } else {
      updated = [...currentStars, star];
    }
    updateFilters('starRating', updated.length > 0 ? updated.join(',') : null);
  };

  const handleAmenityToggle = (amenity: string) => {
    let updated: string[];
    if (currentAmenities.includes(amenity)) {
      updated = currentAmenities.filter((a) => a !== amenity);
    } else {
      updated = [...currentAmenities, amenity];
    }
    updateFilters('amenities', updated.length > 0 ? updated.join(',') : null);
  };

  const handleClearAll = () => {
    const params = new URLSearchParams();
    if (searchParams.get('city')) params.set('city', searchParams.get('city')!);
    if (searchParams.get('checkIn')) params.set('checkIn', searchParams.get('checkIn')!);
    if (searchParams.get('checkOut')) params.set('checkOut', searchParams.get('checkOut')!);
    if (searchParams.get('guests')) params.set('guests', searchParams.get('guests')!);
    router.push(`/hotels?${params.toString()}`);
  };

  const popularAmenities = [
    'Free high-speed WiFi',
    'Pool',
    'Spa',
    'Eiffel Tower views',
    'Beachfront',
    'Restaurant',
    'Private Balcony',
  ];

  const content = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-[#0071C2]" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Filter by:
          </h3>
        </div>
        <button
          onClick={handleClearAll}
          className="text-xs font-semibold text-[#0071C2] hover:underline flex items-center gap-1"
        >
          <RotateCcw className="h-3 w-3" /> Clear all
        </button>
      </div>

      {/* 1. Price Per Night Range */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Price per night
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] text-slate-400">Min Price ($)</label>
            <input
              type="number"
              placeholder="0"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              onBlur={() => updateFilters('minPrice', minPrice)}
              className="w-full h-9 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold"
            />
          </div>
          <div>
            <label className="text-[10px] text-slate-400">Max Price ($)</label>
            <input
              type="number"
              placeholder="1000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              onBlur={() => updateFilters('maxPrice', maxPrice)}
              className="w-full h-9 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold"
            />
          </div>
        </div>
      </div>

      {/* 2. Star Rating */}
      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Property Class
        </h4>
        <div className="space-y-1.5">
          {['5', '4', '3'].map((star) => {
            const isChecked = currentStars.includes(star);
            return (
              <label
                key={star}
                onClick={() => handleStarToggle(star)}
                className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer hover:text-slate-900 select-none"
              >
                <div
                  className={`h-4 w-4 rounded border flex items-center justify-center transition-colors ${
                    isChecked
                      ? 'bg-[#0071C2] border-[#0071C2] text-white'
                      : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                  }`}
                >
                  {isChecked && <Check className="h-3 w-3" />}
                </div>
                <div className="flex items-center text-[#FEBB02]">
                  {Array.from({ length: parseInt(star, 10) }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                  <span className="text-slate-600 dark:text-slate-400 ml-1.5 font-medium">
                    {star} Stars
                  </span>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* 3. Guest Review Score */}
      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Review Score
        </h4>
        <div className="space-y-1.5">
          {[
            { label: 'Wonderful: 4.8+', value: '4.8' },
            { label: 'Very Good: 4.5+', value: '4.5' },
            { label: 'Good: 4.0+', value: '4.0' },
          ].map((item) => {
            const isSelected = currentMinRating === item.value;
            return (
              <label
                key={item.value}
                onClick={() => updateFilters('minRating', isSelected ? null : item.value)}
                className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer hover:text-slate-900 select-none"
              >
                <div
                  className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                    isSelected
                      ? 'border-[#0071C2] bg-[#0071C2]'
                      : 'border-slate-300 dark:border-slate-600'
                  }`}
                >
                  {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                </div>
                <span>{item.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 4. Policies */}
      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Cancellation Policy
        </h4>
        <label
          onClick={() => updateFilters('freeCancellation', currentFreeCancellation ? null : 'true')}
          className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer hover:text-slate-900 select-none"
        >
          <div
            className={`h-4 w-4 rounded border flex items-center justify-center transition-colors ${
              currentFreeCancellation
                ? 'bg-[#0071C2] border-[#0071C2] text-white'
                : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
            }`}
          >
            {currentFreeCancellation && <Check className="h-3 w-3" />}
          </div>
          <span>Free cancellation available</span>
        </label>
      </div>

      {/* 5. Popular Amenities */}
      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Popular Amenities
        </h4>
        <div className="space-y-1.5">
          {popularAmenities.map((amenity) => {
            const isChecked = currentAmenities.includes(amenity);
            return (
              <label
                key={amenity}
                onClick={() => handleAmenityToggle(amenity)}
                className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer hover:text-slate-900 select-none"
              >
                <div
                  className={`h-4 w-4 rounded border flex items-center justify-center transition-colors ${
                    isChecked
                      ? 'bg-[#0071C2] border-[#0071C2] text-white'
                      : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                  }`}
                >
                  {isChecked && <Check className="h-3 w-3" />}
                </div>
                <span>{amenity}</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:block w-72 shrink-0 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm self-start sticky top-24">
        {content}
      </aside>

      {/* Mobile Slide-over Drawer */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />
          <div className="relative ml-auto w-full max-w-xs h-full bg-white dark:bg-slate-900 p-6 shadow-2xl overflow-y-auto">
            <button
              onClick={onCloseMobile}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>
            {content}
          </div>
        </div>
      )}
    </>
  );
}
