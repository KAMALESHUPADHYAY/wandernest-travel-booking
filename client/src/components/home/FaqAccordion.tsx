'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does free cancellation work on WanderNest?',
      a: 'Most properties on WanderNest offer Free Cancellation up to 24 to 48 hours prior to check-in. The specific cancellation deadline is clearly displayed on each hotel card and during the checkout steps. If your plans change, you can cancel directly from your profile dashboard with instant mock refund confirmation.',
    },
    {
      q: 'What is the WanderNest Genius Rewards Program?',
      a: 'Every traveler with a verified WanderNest account automatically enters Genius Level 1, unlocking instant 10% to 20% discounts on selected properties worldwide, priority customer care, and complimentary breakfast perks on participating stays.',
    },
    {
      q: 'What payment methods are supported? Is my money safe?',
      a: 'WanderNest supports all major credit & debit cards (Visa, Mastercard, American Express), PayPal, Apple Pay, and UPI. All checkout processes are encrypted and tokenized. Our simulated payment gateway ensures seamless, risk-free instant confirmation.',
    },
    {
      q: 'Can I modify my travel dates or guest counts after booking?',
      a: 'Yes! Simply navigate to "My Bookings & Trips" from your user avatar dropdown. As long as the property permits modifications, you can adjust guest names, add special requests (such as high-floor or quiet room preferences), or adjust dates.',
    },
    {
      q: 'How do I download a tax invoice or booking voucher for expenses?',
      a: 'Immediately after completing your booking, an official WanderNest Invoice and Confirmation Voucher with unique booking reference (e.g. WN-2026-XXXXX) is generated. You can download or print it anytime from your dashboard.',
    },
    {
      q: 'Are the guest scores and hotel ratings authentic?',
      a: 'Yes. Only verified guests who have booked and completed their stay through WanderNest are invited to write reviews and submit ratings, guaranteeing 100% genuine feedback with transparent pros and cons.',
    },
  ];

  return (
    <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 scroll-mt-20">
      <div className="text-center mb-10 space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0071C2]">
          <HelpCircle className="h-4 w-4 text-[#FEBB02]" />
          <span>Frequently Asked Questions</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          Everything You Need to Know
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Got questions? We’ve got answers to help you plan your next trip effortlessly
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left text-sm font-bold text-slate-900 dark:text-slate-100 hover:text-[#0071C2] transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${
                    isOpen ? 'transform rotate-180 text-[#0071C2]' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
