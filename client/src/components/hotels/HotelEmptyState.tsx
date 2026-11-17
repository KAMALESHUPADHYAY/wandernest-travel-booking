'use client';

import React from 'react';
import { SearchX, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HotelEmptyStateProps {
  onClearFilters: () => void;
}

export function HotelEmptyState({ onClearFilters }: HotelEmptyStateProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-4 shadow-sm">
      <div className="h-16 w-16 mx-auto rounded-3xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-[#0071C2]">
        <SearchX className="h-8 w-8" />
      </div>
      <div className="max-w-md mx-auto space-y-1">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          No matching properties found
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          We couldn&apos;t find any hotels matching your current filter criteria. Try adjusting your price range, relaxing the star rating, or clearing your filters.
        </p>
      </div>
      <Button
        onClick={onClearFilters}
        variant="default"
        className="bg-[#0071C2] hover:bg-[#005999] text-white font-bold text-xs px-5 rounded-xl shadow-md gap-2"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        Clear All Filters
      </Button>
    </div>
  );
}
