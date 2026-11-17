'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { api } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { WeatherWidget } from '@/components/destinations/WeatherWidget';
import { Button } from '@/components/ui/button';
import {
  MapPin,
  Star,
  Calendar,
  Compass,
  Hotel,
  Plane,
  Sparkles,
  ChevronRight,
  Share2,
  Heart,
  Luggage,
  Clock,
  ArrowRight,
  Landmark,
  CheckCircle2,
  AlertTriangle,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

// Dynamically import Leaflet map to disable SSR
const LeafletDestinationMap = dynamic(
  () => import('@/components/map/LeafletDestinationMap'),
  {
    ssr: false,
    loading: () => (
      <div className="h-[380px] w-full bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center animate-pulse text-xs text-slate-400">
        Loading Destination Map...
      </div>
    ),
  }
);

export default function DestinationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [destination, setDestination] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const fetchDestinationData = async () => {
      if (!slug) return;
      setIsLoading(true);
      setError(null);
      try {
        const res = await api.get(`/destinations/${slug}`);
        if (res.data?.success && res.data.data) {
          setDestination(res.data.data);
        } else {
          setError('Destination not found.');
        }
      } catch (err: any) {
        console.error('Failed to load destination details:', err);
        setError('Could not load destination information. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDestinationData();
  }, [slug]);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleToggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(
      isWishlisted ? 'Removed from saved destinations' : 'Saved to your travel wishlist!'
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
        <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        <div className="h-96 w-full bg-slate-200 dark:bg-slate-800 rounded-3xl animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-10 w-3/4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
            <div className="h-32 w-full bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
          </div>
          <div className="h-64 w-full bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 max-w-md text-center space-y-4 shadow-sm">
          <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Destination Not Found
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {error || "We couldn't find the destination you were searching for."}
          </p>
          <div className="flex gap-2 justify-center">
            <Button
              onClick={() => router.push('/destinations')}
              variant="default"
              className="bg-[#0071C2] hover:bg-[#005999] text-white rounded-xl text-xs font-bold"
            >
              Browse All Destinations
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const galleryImages: string[] =
    destination.gallery && destination.gallery.length > 0
      ? destination.gallery
      : [destination.image];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
          <button
            type="button"
            onClick={() => setLightboxIndex(null)}
            className="absolute top-5 right-5 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="relative max-w-5xl max-h-[85vh] w-full h-[70vh]">
            <Image
              src={galleryImages[lightboxIndex]}
              alt={`${destination.name} photo`}
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link href="/" className="hover:text-[#0071C2]">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
          <Link href="/destinations" className="hover:text-[#0071C2]">
            Destinations
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-slate-900 dark:text-slate-100 font-bold">
            {destination.name}
          </span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8">
        {/* Destination Header Title & Action Buttons */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#003B95] text-white">
                {destination.category || 'Destination'}
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/50 text-[#0071C2] border border-blue-200 dark:border-blue-900">
                {destination.country}
              </span>
              <div className="flex items-center gap-1 text-xs font-black bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 px-2 py-0.5 rounded-lg border border-amber-200 dark:border-amber-800">
                <Star className="h-3.5 w-3.5 fill-[#FEBB02] text-[#FEBB02]" />
                <span>4.9 / 5</span>
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              {destination.name}, {destination.city}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-[#0071C2]" />
              <span>{destination.city}, {destination.country}</span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <Button
              onClick={handleToggleWishlist}
              variant="outline"
              size="sm"
              className={`rounded-xl text-xs font-bold flex items-center gap-1.5 h-10 ${
                isWishlisted ? 'text-rose-600 border-rose-200 bg-rose-50 dark:bg-rose-950/30' : ''
              }`}
            >
              <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{isWishlisted ? 'Saved' : 'Save'}</span>
            </Button>

            <Button
              onClick={handleShare}
              variant="outline"
              size="sm"
              className="rounded-xl text-xs font-bold flex items-center gap-1.5 h-10"
            >
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </Button>

            <Button
              onClick={() => {
                const el = document.getElementById('destination-hotels');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              variant="default"
              size="sm"
              className="rounded-xl text-xs font-bold bg-[#0071C2] hover:bg-[#005999] text-white flex items-center gap-1.5 h-10 shadow-sm"
            >
              <Hotel className="h-4 w-4" />
              <span>Plan Trip & Stays</span>
            </Button>
          </div>
        </div>

        {/* Image Mosaic Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 h-[320px] sm:h-[420px] rounded-3xl overflow-hidden">
          {/* Main Large Image (2 cols on desktop) */}
          <div
            onClick={() => setLightboxIndex(0)}
            className="md:col-span-2 relative h-full cursor-pointer group overflow-hidden bg-slate-200"
          >
            <Image
              src={galleryImages[0] || destination.image}
              alt={destination.name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
          </div>

          {/* Secondary Stack (1 col) */}
          <div className="hidden md:flex flex-col gap-3 h-full">
            <div
              onClick={() => setLightboxIndex(1 % galleryImages.length)}
              className="relative h-1/2 cursor-pointer group overflow-hidden bg-slate-200 rounded-xl"
            >
              <Image
                src={galleryImages[1] || galleryImages[0]}
                alt={`${destination.name} preview 2`}
                fill
                sizes="25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div
              onClick={() => setLightboxIndex(2 % galleryImages.length)}
              className="relative h-1/2 cursor-pointer group overflow-hidden bg-slate-200 rounded-xl"
            >
              <Image
                src={galleryImages[2] || galleryImages[0]}
                alt={`${destination.name} preview 3`}
                fill
                sizes="25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Tertiary Stack (1 col) */}
          <div className="hidden md:flex flex-col gap-3 h-full">
            <div
              onClick={() => setLightboxIndex(3 % galleryImages.length)}
              className="relative h-1/2 cursor-pointer group overflow-hidden bg-slate-200 rounded-xl"
            >
              <Image
                src={galleryImages[3] || galleryImages[0]}
                alt={`${destination.name} preview 4`}
                fill
                sizes="25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div
              onClick={() => setLightboxIndex(0)}
              className="relative h-1/2 cursor-pointer group overflow-hidden bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold text-xs"
            >
              <Image
                src={galleryImages[4] || galleryImages[0]}
                alt={`${destination.name} preview 5`}
                fill
                sizes="25vw"
                className="object-cover opacity-60 group-hover:opacity-80 transition-opacity"
              />
              <span className="relative z-10 bg-black/60 px-3 py-1.5 rounded-xl backdrop-blur-sm">
                View All Photos ({galleryImages.length})
              </span>
            </div>
          </div>
        </div>

        {/* Best Time To Visit Banner */}
        {destination.bestTime && (
          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                Best Time to Visit
              </h4>
              <p className="text-xs font-semibold text-emerald-900 dark:text-emerald-100 mt-0.5">
                {destination.bestTime}
              </p>
            </div>
          </div>
        )}

        {/* Content Columns: Left (Overview & Attractions & Map) + Right (Weather Widget & Quick Book) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Info (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Overview */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-3">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                About {destination.name}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {destination.description}
              </p>
            </div>

            {/* Top Attractions */}
            {destination.attractions && destination.attractions.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                      Top Attractions & Sights in {destination.name}
                    </h3>
                    <p className="text-xs text-slate-500">Must-visit historical and cultural highlights</p>
                  </div>
                  <Sparkles className="h-4 w-4 text-[#FEBB02]" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {destination.attractions.map((att: any, idx: number) => (
                    <div
                      key={idx}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-2 hover:border-[#0071C2] transition-colors"
                    >
                      <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-[#0071C2] flex items-center justify-center font-bold text-xs">
                        {idx + 1}
                      </div>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">
                        {att.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                        {att.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Destination Interactive Leaflet Map */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Location & Neighborhood Map
                  </h3>
                  <p className="text-xs text-slate-500">
                    Explore coordinates & nearby hotel locations in {destination.city}
                  </p>
                </div>
                <div className="text-xs font-mono text-slate-400">
                  {destination.latitude.toFixed(2)}&deg;N, {destination.longitude.toFixed(2)}&deg;E
                </div>
              </div>

              <LeafletDestinationMap
                latitude={destination.latitude}
                longitude={destination.longitude}
                destinationName={destination.name}
                cityName={destination.city}
                hotels={destination.nearbyHotels || []}
              />
            </div>
          </div>

          {/* Right Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-6 sticky top-20">
            {/* Live Weather Widget */}
            <WeatherWidget
              latitude={destination.latitude}
              longitude={destination.longitude}
              cityName={destination.city}
            />

            {/* Quick Trip Planning CTA Box */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <Compass className="h-5 w-5 text-[#0071C2]" />
                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  Plan Your Trip to {destination.name}
                </h4>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Stays from:</span>
                  <span className="font-black text-[#003B95] dark:text-blue-400">
                    {formatPrice(destination.startingPrice || 120, 'INR')} / night
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Properties available:</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {destination.nearbyHotels?.length || 1} hotels
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Flights:</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    Direct routes available
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  onClick={() => router.push(`/hotels?city=${encodeURIComponent(destination.city)}`)}
                  variant="default"
                  className="w-full h-11 rounded-xl font-bold bg-[#0071C2] hover:bg-[#005999] text-white flex items-center justify-center gap-2"
                >
                  <Hotel className="h-4 w-4" />
                  <span>Search Hotels in {destination.city}</span>
                </Button>

                <Button
                  onClick={() => router.push(`/flights?arrivalCity=${encodeURIComponent(destination.city)}`)}
                  variant="outline"
                  className="w-full h-11 rounded-xl font-bold border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <Plane className="h-4 w-4 text-[#0071C2]" />
                  <span>Search Flights to {destination.city}</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Nearby Hotels Section */}
        <section id="destination-hotels" className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">
                Featured Places to Stay in {destination.name}
              </h3>
              <p className="text-xs text-slate-500">Top-rated hotels with verified traveler ratings</p>
            </div>
            <Link
              href={`/hotels?city=${encodeURIComponent(destination.city)}`}
              className="text-xs font-bold text-[#0071C2] hover:underline flex items-center gap-1"
            >
              <span>View all hotels</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(destination.nearbyHotels || []).map((hotel: any) => {
              let parsedImages: string[] = [];
              try {
                parsedImages = JSON.parse(hotel.images);
              } catch (e) {
                parsedImages = [destination.image];
              }

              return (
                <div
                  key={hotel.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all group flex flex-col justify-between"
                >
                  <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                    <Image
                      src={parsedImages[0] || destination.image}
                      alt={hotel.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md px-2 py-0.5 rounded-lg text-xs font-black flex items-center gap-1 shadow-sm">
                      <Star className="h-3.5 w-3.5 fill-[#FEBB02] text-[#FEBB02]" />
                      <span>{hotel.rating}</span>
                    </div>
                  </div>

                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-[#0071C2] transition-colors line-clamp-1">
                        {hotel.name}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{hotel.address}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">Starting from</span>
                        <span className="text-sm font-black text-[#003B95] dark:text-blue-400">
                          {formatPrice(hotel.pricePerNight, 'INR')}
                        </span>
                      </div>

                      <Link
                        href={`/hotels/${hotel.id}`}
                        className="px-3 py-1.5 rounded-xl bg-[#0071C2] hover:bg-[#005999] text-white text-xs font-bold transition-all shadow-sm"
                      >
                        View Stays
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Popular Arriving Flights Section */}
        {destination.popularFlights && destination.popularFlights.length > 0 && (
          <section className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">
                  Flights to {destination.city}
                </h3>
                <p className="text-xs text-slate-500">Popular domestic & international flight routes</p>
              </div>
              <Link
                href={`/flights?to=${encodeURIComponent(destination.city)}`}
                className="text-xs font-bold text-[#0071C2] hover:underline flex items-center gap-1"
              >
                <span>View all flights</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {destination.popularFlights.map((flight: any) => (
                <div
                  key={flight.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex items-center justify-between gap-4 hover:border-[#0071C2] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-[#0071C2] shrink-0">
                      <Plane className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
                          {flight.airline}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {flight.flightNumber}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {flight.departureCity} ({flight.departureAirport}) ➔ {flight.arrivalCity} ({flight.arrivalAirport})
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-sm font-black text-[#003B95] dark:text-blue-400 block">
                      {formatPrice(flight.price, 'INR')}
                    </span>
                    <Link
                      href={`/flights?from=${encodeURIComponent(flight.departureCity)}&to=${encodeURIComponent(flight.arrivalCity)}`}
                      className="text-[11px] font-bold text-[#0071C2] hover:underline"
                    >
                      Book Flight ➔
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
