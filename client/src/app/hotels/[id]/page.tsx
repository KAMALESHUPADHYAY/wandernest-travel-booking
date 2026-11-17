'use client';

import React, { useState, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import dynamic from 'next/dynamic';
import Link from 'next/link';

import {
  Star,
  MapPin,
  Heart,
  Share2,
  Check,
  ShieldCheck,
  Coffee,
  Wifi,
  Sparkles,
  Users,
  Bed,
  Calendar,
  Clock,
  ThumbsUp,
  ThumbsDown,
  ArrowRight,
  ChevronRight,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HotelGallery } from '@/components/hotels/HotelGallery';
import { toast } from 'sonner';

// Dynamic Leaflet Map
const LeafletHotelMap = dynamic(() => import('@/components/map/LeafletHotelMap'), {
  ssr: false,
  loading: () => (
    <div className="h-72 w-full rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse flex items-center justify-center text-slate-400 text-xs">
      Loading location map...
    </div>
  ),
});

function HotelDetailContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, openAuthModal } = useAuth();
  const queryClient = useQueryClient();

  const hotelId = params.id as string;

  // Search date and guest parameters
  const [checkIn, setCheckIn] = useState(
    searchParams.get('checkIn') ||
      (() => {
        const d = new Date();
        d.setDate(d.getDate() + 7);
        return d.toISOString().split('T')[0];
      })()
  );

  const [checkOut, setCheckOut] = useState(
    searchParams.get('checkOut') ||
      (() => {
        const d = new Date();
        d.setDate(d.getDate() + 11);
        return d.toISOString().split('T')[0];
      })()
  );

  const [guests, setGuests] = useState(searchParams.get('guests') || '2');
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [roomCount, setRoomCount] = useState(1);
  const [isSaved, setIsSaved] = useState(false);

  // Fetch Hotel Details
  const { data: hotel, isLoading, isError } = useQuery({
    queryKey: ['hotel-detail', hotelId],
    queryFn: async () => {
      const res = await api.get(`/hotels/${hotelId}`);
      return res.data?.data;
    },
  });

  // Calculate nights
  const calculateNights = () => {
    try {
      const d1 = new Date(checkIn);
      const d2 = new Date(checkOut);
      const diffTime = d2.getTime() - d1.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 1;
    } catch {
      return 1;
    }
  };

  const nights = calculateNights();

  // Wishlist toggle
  const wishlistMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/wishlist/toggle', { hotelId });
      return res.data;
    },
    onSuccess: (data) => {
      setIsSaved(data.action === 'added');
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ['user-wishlist'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Could not update saved properties');
    },
  });

  const handleToggleWishlist = () => {
    if (!user) {
      toast.info('Please sign in to save your favorite hotels');
      openAuthModal('login');
      return;
    }
    wishlistMutation.mutate();
  };

  const handleShare = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Property link copied to clipboard!');
    }
  };

  const handleReserve = (roomId?: string) => {
    const finalRoomId = roomId || selectedRoomId || hotel?.rooms?.[0]?.id;
    if (!finalRoomId) {
      toast.error('Please select an available room');
      return;
    }

    const query = new URLSearchParams({
      hotelId: hotel.id,
      roomId: finalRoomId,
      checkIn,
      checkOut,
      guests,
      rooms: String(roomCount),
    });

    router.push(`/checkout?${query.toString()}`);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 animate-pulse">
        <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="h-10 w-96 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="h-[400px] w-full bg-slate-200 dark:bg-slate-800 rounded-3xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (isError || !hotel) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-2xl font-bold">Property Not Found</h2>
        <p className="text-sm text-slate-500">
          The requested hotel listing does not exist or may have been removed.
        </p>
        <Link href="/hotels">
          <Button variant="default" className="bg-[#0071C2]">
            Browse Available Hotels
          </Button>
        </Link>
      </div>
    );
  }

  // Selected room calculation
  const currentRoom =
    hotel.rooms.find((r: any) => r.id === (selectedRoomId || hotel.rooms[0]?.id)) ||
    hotel.rooms[0];
  const totalPrice = currentRoom ? currentRoom.pricePerNight * nights * roomCount : hotel.pricePerNight * nights;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      {/* Breadcrumbs */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1.5 text-xs text-slate-500">
          <Link href="/" className="hover:text-[#0071C2]">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/hotels" className="hover:text-[#0071C2]">Hotels</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href={`/hotels?city=${hotel.city}`} className="hover:text-[#0071C2]">{hotel.city}</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-slate-900 dark:text-slate-200 font-bold truncate max-w-xs">{hotel.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8">
        {/* Top Header Row */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="flex text-[#FEBB02]">
                {Array.from({ length: hotel.starRating || 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FEBB02] text-slate-950">
                Genius Partner
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              {hotel.name}
            </h1>

            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              <MapPin className="h-4 w-4 text-[#0071C2] shrink-0" />
              <span>{hotel.address}, {hotel.city}, {hotel.country}</span>
              <span>•</span>
              <a href="#location-map" className="text-[#0071C2] font-bold hover:underline">
                Excellent location – show on map
              </a>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleToggleWishlist}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all ${
                isSaved
                  ? 'border-rose-300 bg-rose-50 dark:bg-rose-950/40 text-rose-600'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
              }`}
            >
              <Heart className={`h-4 w-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 text-xs font-bold"
            >
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </button>

            <Button
              onClick={() => handleReserve()}
              className="bg-[#0071C2] hover:bg-[#005999] text-white font-bold px-6 h-10 rounded-xl shadow-md text-xs"
            >
              Reserve Now
            </Button>
          </div>
        </div>

        {/* 5-Photo Mosaic Gallery with Lightbox */}
        <HotelGallery images={hotel.images} hotelName={hotel.name} />

        {/* Main Content Layout (2 cols: Left info + Right sticky reserve card) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (8 cols): Overview, Rooms, Amenities, Policies, Map */}
          <div className="lg:col-span-8 space-y-8">
            {/* Overview & Score Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              {/* Score header */}
              <div className="flex items-center justify-between p-4 bg-blue-50/70 dark:bg-blue-950/40 rounded-2xl border border-blue-100 dark:border-blue-900">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-[#003B95] text-white flex items-center justify-center font-black text-lg shadow-sm">
                    {hotel.rating.toFixed(1)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {hotel.rating >= 4.8 ? 'Exceptional Rating' : 'Very Good Rating'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Based on {hotel.reviewCount} verified guest reviews
                    </p>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-4 text-xs font-medium text-slate-600 dark:text-slate-300">
                  <span>Cleanliness: 9.8</span>
                  <span>Comfort: 9.9</span>
                  <span>Location: 9.9</span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Experience world-class luxury at {hotel.name}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {hotel.description}
                </p>
              </div>

              {/* Amenities Grid */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Most Popular Facilities & Perks
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {hotel.amenities?.map((amenity: string, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs font-medium text-slate-700 dark:text-slate-300"
                    >
                      <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Room Selection Table & Cards */}
            <div id="rooms-section" className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  Available Room Types
                </h2>
                <p className="text-xs text-slate-500">
                  Select your ideal suite for {nights} night(s)
                </p>
              </div>

              <div className="space-y-4">
                {hotel.rooms?.map((room: any) => {
                  const isSelected = selectedRoomId === room.id;
                  const roomPrice = room.pricePerNight * nights;

                  return (
                    <div
                      key={room.id}
                      className={`bg-white dark:bg-slate-900 rounded-3xl border transition-all p-5 sm:p-6 shadow-sm flex flex-col md:flex-row justify-between gap-6 ${
                        isSelected
                          ? 'border-[#0071C2] ring-2 ring-[#0071C2]/20'
                          : 'border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      {/* Room Details */}
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                            {room.name}
                          </h3>
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#0071C2] font-semibold">
                            {room.type}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                          <span className="flex items-center gap-1.5">
                            <Users className="h-3.5 w-3.5 text-[#0071C2]" /> Up to {room.capacity} Guests
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Bed className="h-3.5 w-3.5 text-[#0071C2]" /> {room.bedType}
                          </span>
                          {room.size && <span>• {room.size} m² / {room.size * 10} sq ft</span>}
                        </div>

                        {/* Room Amenities */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {room.amenities?.map((ra: string, i: number) => (
                            <span
                              key={i}
                              className="text-[11px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md text-slate-600 dark:text-slate-300"
                            >
                              {ra}
                            </span>
                          ))}
                        </div>

                        <div className="pt-2 text-xs text-emerald-600 dark:text-emerald-400 font-semibold space-y-1">
                          <div className="flex items-center gap-1">
                            <Check className="h-3.5 w-3.5" /> Free cancellation before 48h of check-in
                          </div>
                          <div className="flex items-center gap-1">
                            <Coffee className="h-3.5 w-3.5" /> Delicious breakfast included in rate
                          </div>
                        </div>
                      </div>

                      {/* Pricing & CTA */}
                      <div className="md:w-60 shrink-0 flex flex-col justify-between items-start md:items-end border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-4 md:pt-0 md:pl-6 space-y-3">
                        <div className="text-left md:text-right">
                          {room.originalPrice && (
                            <span className="text-xs text-slate-400 line-through">
                              ${room.originalPrice * nights}
                            </span>
                          )}
                          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
                            ${roomPrice}
                          </div>
                          <span className="text-[11px] text-slate-400">
                            For {nights} night(s), taxes included
                          </span>
                        </div>

                        <Button
                          type="button"
                          onClick={() => {
                            setSelectedRoomId(room.id);
                            handleReserve(room.id);
                          }}
                          variant="default"
                          className="w-full bg-[#0071C2] hover:bg-[#005999] text-white font-bold h-11 rounded-xl shadow-md text-xs flex items-center justify-center gap-1.5"
                        >
                          <span>Reserve Room</span>
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Location Map */}
            <div id="location-map" className="space-y-3 scroll-mt-24">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Property Location
              </h2>
              <p className="text-xs text-slate-500">
                {hotel.address}, {hotel.city}, {hotel.country}
              </p>
              <LeafletHotelMap
                hotels={[hotel]}
                className="h-80 w-full"
              />
            </div>

            {/* Guest Reviews Preview */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Guest Reviews ({hotel.reviewCount})
              </h2>

              <div className="space-y-4">
                {hotel.reviews?.length > 0 ? (
                  hotel.reviews.map((rev: any) => (
                    <div
                      key={rev.id}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={rev.user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${rev.user?.name}`}
                            alt={rev.user?.name}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                          <div>
                            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                              {rev.user?.name}
                            </h4>
                            <span className="text-[10px] text-slate-400">
                              {rev.tripType} traveler
                            </span>
                          </div>
                        </div>

                        <div className="h-7 w-7 rounded-lg bg-[#003B95] text-white flex items-center justify-center font-bold text-xs">
                          {rev.rating.toFixed(1)}
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 italic">
                        &ldquo;{rev.comment}&rdquo;
                      </p>

                      {rev.pros && (
                        <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                          <ThumbsUp className="h-3 w-3" />
                          <span>{rev.pros}</span>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400">No reviews yet for this listing.</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column (4 cols): Sticky Reservation Summary Card */}
          <div className="lg:col-span-4 sticky top-24 space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
              <div>
                <span className="text-xs text-slate-400 uppercase font-semibold">Total Price</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-[#0071C2]">
                    ${totalPrice}
                  </span>
                  <span className="text-xs text-slate-500">for {nights} night(s)</span>
                </div>
              </div>

              {/* Date & Guests Picker in Card */}
              <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400">Check-in</label>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full mt-1 p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold bg-transparent"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400">Check-out</label>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full mt-1 p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold bg-transparent"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Guests</span>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-xs font-bold"
                  >
                    <option value="1">1 Guest</option>
                    <option value="2">2 Guests</option>
                    <option value="3">3 Guests</option>
                    <option value="4">4 Guests</option>
                  </select>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Rooms</span>
                  <select
                    value={roomCount}
                    onChange={(e) => setRoomCount(parseInt(e.target.value, 10))}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-xs font-bold"
                  >
                    <option value="1">1 Room</option>
                    <option value="2">2 Rooms</option>
                    <option value="3">3 Rooms</option>
                  </select>
                </div>
              </div>

              {/* Selected Suite summary */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Selected Option</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 block">
                  {currentRoom?.name || 'Standard Deluxe Room'}
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 text-[11px] block font-semibold">
                  Free cancellation included
                </span>
              </div>

              {/* Action */}
              <Button
                type="button"
                onClick={() => handleReserve()}
                className="w-full h-12 bg-[#0071C2] hover:bg-[#005999] text-white font-bold rounded-2xl shadow-lg text-sm"
              >
                I&apos;ll Reserve
              </Button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 text-center">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span>You won&apos;t be charged yet</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HotelDetailPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-sm">Loading Hotel Details...</div>}>
      <HotelDetailContent />
    </Suspense>
  );
}
