'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Tag, Clock, Copy, Check, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export function SpecialOffers() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Live countdown timer state (hours, minutes, seconds)
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 36,
    seconds: 45,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const { data: offers } = useQuery({
    queryKey: ['active-offers'],
    queryFn: async () => {
      const res = await api.get('/offers');
      return res.data?.data || [];
    },
  });

  const activeOffer = offers?.[0] || {
    title: 'Early Bird Summer Escape',
    badge: 'Save 25%',
    discountPercent: 25,
    promoCode: 'SUMMER25',
    description: 'Book your dream summer vacation 30 days in advance and unlock 25% off participating luxury hotels.',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Promo code "${code}" copied to clipboard!`);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  return (
    <section id="special-deals" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 scroll-mt-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#002B6E] via-[#003B95] to-[#0071C2] text-white shadow-2xl"
      >
        {/* Background Image Overlay with low opacity */}
        <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay">
          <img
            src={activeOffer.imageUrl}
            alt={activeOffer.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-10 p-8 sm:p-12 lg:p-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FEBB02] text-slate-950 font-black text-xs">
              <Sparkles className="h-3.5 w-3.5" />
              <span>FLASH SALE OFFER · {activeOffer.badge}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              {activeOffer.title}
            </h2>

            <p className="text-sm sm:text-base text-sky-100 max-w-xl font-normal leading-relaxed">
              {activeOffer.description}
            </p>

            {/* Promo Code Box */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <div className="flex items-center bg-white/10 backdrop-blur-md border border-white/25 rounded-xl px-4 py-2.5">
                <span className="text-xs text-sky-200 mr-2 uppercase font-semibold">Promo Code:</span>
                <span className="font-mono text-base font-black text-[#FEBB02] tracking-wider">
                  {activeOffer.promoCode}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyCode(activeOffer.promoCode)}
                  className="ml-3 p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
                  title="Copy Code"
                >
                  {copiedCode === activeOffer.promoCode ? (
                    <Check className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>

              <Link href="/hotels">
                <Button
                  variant="accent"
                  className="bg-[#FEBB02] hover:bg-[#E5A802] text-slate-950 font-bold px-6 h-12 rounded-xl shadow-lg flex items-center gap-2"
                >
                  Claim Deal Now <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column: Live Countdown Timer Box */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-end">
            <div className="bg-black/30 backdrop-blur-md rounded-2xl border border-white/20 p-6 sm:p-8 w-full max-w-sm text-center space-y-4 shadow-xl">
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-sky-200 uppercase tracking-widest">
                <Clock className="h-4 w-4 text-[#FEBB02] animate-pulse" />
                <span>Offer Expires In</span>
              </div>

              {/* Countdown Digits */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                  <span className="font-mono text-2xl sm:text-3xl font-black text-white">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="block text-[10px] uppercase font-bold text-sky-200 mt-1">Hours</span>
                </div>
                <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                  <span className="font-mono text-2xl sm:text-3xl font-black text-white">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="block text-[10px] uppercase font-bold text-sky-200 mt-1">Mins</span>
                </div>
                <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                  <span className="font-mono text-2xl sm:text-3xl font-black text-[#FEBB02]">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="block text-[10px] uppercase font-bold text-sky-200 mt-1">Secs</span>
                </div>
              </div>

              <p className="text-[11px] text-sky-200">
                Discount automatically applied at checkout when using promo code.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
