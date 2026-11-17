'use client';

import React from 'react';

export function HotelSkeletonCard() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col md:flex-row gap-6 animate-pulse">
      <div className="md:w-72 h-52 bg-slate-200 dark:bg-slate-800 rounded-2xl shrink-0" />
      <div className="flex-1 space-y-4">
        <div className="space-y-2">
          <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-800 rounded" />
        </div>
        <div className="flex gap-2">
          <div className="h-6 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg" />
          <div className="h-6 w-28 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        </div>
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="h-10 w-36 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
