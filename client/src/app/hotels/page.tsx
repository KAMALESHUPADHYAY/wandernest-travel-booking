'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import dynamic from 'next/dynamic';

import { HotelSearchHeader } from '@/components/hotels/HotelSearchHeader';
import { HotelFilterSidebar } from '@/components/hotels/HotelFilterSidebar';
import { HotelSortToolbar } from '@/components/hotels/HotelSortToolbar';
import { HotelCard } from '@/components/hotels/HotelCard';
import { HotelSkeletonCard } from '@/components/hotels/HotelSkeletonCard';
import { HotelEmptyState } from '@/components/hotels/HotelEmptyState';
import { Pagination } from '@/components/hotels/Pagination';
import { toast } from 'sonner';

// Dynamically import Leaflet Map to avoid SSR issues
const LeafletHotelMap = dynamic(() => import('@/components/map/LeafletHotelMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] w-full rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse flex items-center justify-center text-slate-400 text-xs">
      Loading interactive map...
    </div>
  ),
});

function HotelsSearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [highlightedHotelId, setHighlightedHotelId] = useState<string | null>(null);

  // Read search & filter parameters from URL
  const city = searchParams.get('city') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const starRating = searchParams.get('starRating') || '';
  const minRating = searchParams.get('minRating') || '';
  const freeCancellation = searchParams.get('freeCancellation') || '';
  const amenities = searchParams.get('amenities') || '';
  const sortBy = searchParams.get('sortBy') || 'rating_desc';
  const page = searchParams.get('page') || '1';

  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';
  const guests = searchParams.get('guests') || '2';

  // TanStack Query for hotels
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['hotels-search', searchParams.toString()],
    queryFn: async () => {
      const res = await api.get(`/hotels?${searchParams.toString()}`);
      return res.data;
    },
  });

  const hotels = data?.data || [];
  const pagination = data?.pagination || { page: 1, total: 0, totalPages: 1 };

  // Wishlist Mutation
  const [savedHotelIds, setSavedHotelIds] = useState<{ [id: string]: boolean }>({});

  const wishlistMutation = useMutation({
    mutationFn: async (hotelId: string) => {
      const res = await api.post('/wishlist/toggle', { hotelId });
      return { hotelId, data: res.data };
    },
    onSuccess: ({ hotelId, data }) => {
      setSavedHotelIds((prev) => ({
        ...prev,
        [hotelId]: data.action === 'added',
      }));
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ['user-wishlist'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Could not update saved properties');
    },
  });

  const handleClearFilters = () => {
    const params = new URLSearchParams();
    if (city) params.set('city', city);
    router.push(`/hotels?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-16">
      {/* Top Search Modify Bar */}
      <HotelSearchHeader />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex gap-8 items-start">
          {/* Left: Filter Sidebar (Desktop + Mobile Drawer) */}
          <HotelFilterSidebar
            isMobileOpen={isMobileFiltersOpen}
            onCloseMobile={() => setIsMobileFiltersOpen(false)}
          />

          {/* Right: Results Content Area */}
          <div className="flex-1 min-w-0">
            {/* Sort & View Mode Toolbar */}
            <HotelSortToolbar
              totalCount={pagination.total}
              viewMode={viewMode}
              onToggleView={setViewMode}
              onOpenMobileFilters={() => setIsMobileFiltersOpen(true)}
            />

            {/* Error State */}
            {isError && (
              <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-2xl p-6 text-center space-y-3">
                <p className="text-sm font-bold text-rose-700 dark:text-rose-300">
                  Unable to load hotel listings. Please check connection.
                </p>
                <button
                  onClick={() => refetch()}
                  className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold"
                >
                  Retry Search
                </button>
              </div>
            )}

            {/* Loading Skeleton */}
            {isLoading && (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((n) => (
                  <HotelSkeletonCard key={n} />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !isError && hotels.length === 0 && (
              <HotelEmptyState onClearFilters={handleClearFilters} />
            )}

            {/* Results: List Mode */}
            {!isLoading && !isError && hotels.length > 0 && viewMode === 'list' && (
              <div className="space-y-4">
                {hotels.map((hotel: any) => (
                  <HotelCard
                    key={hotel.id}
                    hotel={hotel}
                    isSaved={savedHotelIds[hotel.id]}
                    onToggleWishlist={(id) => wishlistMutation.mutate(id)}
                    checkIn={checkIn}
                    checkOut={checkOut}
                    guests={guests}
                  />
                ))}

                {/* Pagination */}
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                />
              </div>
            )}

            {/* Results: Map View Mode */}
            {!isLoading && !isError && hotels.length > 0 && viewMode === 'map' && (
              <div className="space-y-6">
                <LeafletHotelMap
                  hotels={hotels}
                  highlightedHotelId={highlightedHotelId}
                  onSelectHotel={(id) => setHighlightedHotelId(id)}
                  className="h-[520px] w-full"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {hotels.map((hotel: any) => (
                    <div
                      key={hotel.id}
                      onMouseEnter={() => setHighlightedHotelId(hotel.id)}
                      onMouseLeave={() => setHighlightedHotelId(null)}
                      className={`transition-all rounded-3xl ${
                        highlightedHotelId === hotel.id ? 'ring-2 ring-[#0071C2]' : ''
                      }`}
                    >
                      <HotelCard
                        hotel={hotel}
                        isSaved={savedHotelIds[hotel.id]}
                        onToggleWishlist={(id) => wishlistMutation.mutate(id)}
                        checkIn={checkIn}
                        checkOut={checkOut}
                        guests={guests}
                      />
                    </div>
                  ))}
                </div>

                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HotelsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen p-8 text-center text-sm font-semibold text-slate-500">
          Loading WanderNest Hotels...
        </div>
      }
    >
      <HotelsSearchContent />
    </Suspense>
  );
}
