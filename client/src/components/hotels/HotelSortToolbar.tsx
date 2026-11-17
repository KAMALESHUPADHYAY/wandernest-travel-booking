'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LayoutList, Map, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HotelSortToolbarProps {
  totalCount: number;
  viewMode: 'list' | 'map';
  onToggleView: (mode: 'list' | 'map') => void;
  onOpenMobileFilters: () => void;
}

export function HotelSortToolbar({
  totalCount,
  viewMode,
  onToggleView,
  onOpenMobileFilters,
}: HotelSortToolbarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get('sortBy') || 'rating_desc';
  const destination = searchParams.get('city') || 'All Destinations';

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sortBy', newSort);
    params.set('page', '1');
    router.push(`/hotels?${params.toString()}`);
  };

  const removeFilter = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    params.set('page', '1');
    router.push(`/hotels?${params.toString()}`);
  };

  // Active filter items
  const activeFilters = [];
  if (searchParams.get('minPrice') || searchParams.get('maxPrice')) {
    activeFilters.push({
      key: 'price',
      label: `$${searchParams.get('minPrice') || '0'} - $${searchParams.get('maxPrice') || '1000+'}`,
      onRemove: () => {
        const p = new URLSearchParams(searchParams.toString());
        p.delete('minPrice');
        p.delete('maxPrice');
        p.set('page', '1');
        router.push(`/hotels?${p.toString()}`);
      },
    });
  }
  if (searchParams.get('starRating')) {
    activeFilters.push({
      key: 'starRating',
      label: `${searchParams.get('starRating')} Stars`,
      onRemove: () => removeFilter('starRating'),
    });
  }
  if (searchParams.get('minRating')) {
    activeFilters.push({
      key: 'minRating',
      label: `${searchParams.get('minRating')}+ Rating`,
      onRemove: () => removeFilter('minRating'),
    });
  }
  if (searchParams.get('freeCancellation')) {
    activeFilters.push({
      key: 'freeCancellation',
      label: 'Free Cancellation',
      onRemove: () => removeFilter('freeCancellation'),
    });
  }
  if (searchParams.get('amenities')) {
    activeFilters.push({
      key: 'amenities',
      label: searchParams.get('amenities')!,
      onRemove: () => removeFilter('amenities'),
    });
  }

  return (
    <div className="space-y-3 mb-6">
      {/* Top Bar: Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-slate-100">
            {destination}: <span className="text-[#0071C2]">{totalCount} properties</span>
          </h1>
          <p className="text-xs text-slate-500">Live prices with instant confirmation</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile Filter Button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onOpenMobileFilters}
            className="lg:hidden text-xs font-bold gap-1.5"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filters
          </Button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="text-[11px] font-bold text-slate-400 uppercase hidden sm:inline">
              Sort:
            </span>
            <select
              value={currentSort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="bg-transparent text-xs font-bold outline-none cursor-pointer text-slate-800 dark:text-slate-200"
            >
              <option value="rating_desc">Top Rated First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="popularity">Most Popular / Reviewed</option>
              <option value="stars_desc">Property Class (5 to 1)</option>
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => onToggleView('list')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-900 text-[#0071C2] shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="List View"
            >
              <LayoutList className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onToggleView('map')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'map'
                  ? 'bg-white dark:bg-slate-900 text-[#0071C2] shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Map View"
            >
              <Map className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Active Filter Pills */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-slate-400 font-medium">Active filters:</span>
          {activeFilters.map((f) => (
            <span
              key={f.key}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-[#0071C2] border border-blue-200 dark:border-blue-900"
            >
              <span>{f.label}</span>
              <button
                type="button"
                onClick={f.onRemove}
                className="hover:text-rose-500 transition-colors"
                aria-label={`Remove filter ${f.label}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
