import React from 'react';
import { HeroSearch } from '@/components/home/HeroSearch';
import { TrustBadges } from '@/components/home/TrustBadges';
import { TrendingDestinations } from '@/components/home/TrendingDestinations';
import { PopularHotels } from '@/components/home/PopularHotels';
import { FlightDeals } from '@/components/home/FlightDeals';
import { PropertyTypes } from '@/components/home/PropertyTypes';
import { ExploreThemes } from '@/components/home/ExploreThemes';
import { TopDestinationsTabs } from '@/components/home/TopDestinationsTabs';
import { SpecialOffers } from '@/components/home/SpecialOffers';
import { HowItWorks } from '@/components/home/HowItWorks';
import { Testimonials } from '@/components/home/Testimonials';
import { TravelInspiration } from '@/components/home/TravelInspiration';
import { AnimatedStats } from '@/components/home/AnimatedStats';
import { NewsletterSection } from '@/components/home/NewsletterSection';
import { FaqAccordion } from '@/components/home/FaqAccordion';

export default function HomePage() {
  return (
    <div className="flex flex-col space-y-4 pb-12 overflow-x-hidden">
      {/* 1. Hero with background image and a big tabbed search box (Stays | Flights) */}
      <HeroSearch />

      {/* 2. Trust badges strip */}
      <TrustBadges />

      {/* 3. Trending Destinations */}
      <TrendingDestinations />

      {/* 4. Popular Hotels carousel / grid */}
      <PopularHotels />

      {/* 5. Flight Deals cards */}
      <FlightDeals />

      {/* 6. Browse by Property Type */}
      <PropertyTypes />

      {/* 7. Explore by Theme */}
      <ExploreThemes />

      {/* 8. Top Destinations tabs (India / International) */}
      <TopDestinationsTabs />

      {/* 9. Special Offers banner with countdown timer */}
      <SpecialOffers />

      {/* 10. How It Works (3 steps) */}
      <HowItWorks />

      {/* 11. Testimonials carousel */}
      <Testimonials />

      {/* 12. Travel Inspiration blog cards */}
      <TravelInspiration />

      {/* 13. Animated stats counters */}
      <AnimatedStats />

      {/* 14. Newsletter subscription (saves to DB) */}
      <NewsletterSection />

      {/* 15. FAQ accordion */}
      <FaqAccordion />
    </div>
  );
}
