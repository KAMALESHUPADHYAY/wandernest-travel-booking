'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, Globe, Heart, Shield, Award, HelpCircle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      {/* Upper Pre-footer Banner */}
      <div className="bg-[#003B95] text-white py-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-[#FEBB02]">
              <Compass className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-base">Save time, save money!</h4>
              <p className="text-xs text-sky-100">Sign up and we&apos;ll send the best deals directly to your inbox</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-sky-200">
              Trusted by 500,000+ travelers worldwide
            </span>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="col-span-2 lg:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-[#0071C2] flex items-center justify-center text-[#FEBB02] font-black text-xs">
                WN
              </div>
              <span className="text-xl font-black text-white">
                Wander<span className="text-[#FEBB02]">Nest</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your gateway to unforgettable stays, bespoke private villas, and worldwide flight routes with the best price guarantee.
            </p>
            <div className="pt-2 text-xs text-slate-400">
              <span className="block font-semibold text-slate-200">Customer Support:</span>
              <span>24/7 Global Priority Desk</span>
            </div>
          </div>

          {/* Destinations */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Top Destinations</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/hotels?city=Paris" className="hover:text-white transition-colors">Paris, France</Link></li>
              <li><Link href="/hotels?city=Tokyo" className="hover:text-white transition-colors">Tokyo, Japan</Link></li>
              <li><Link href="/hotels?city=Bali" className="hover:text-white transition-colors">Bali, Indonesia</Link></li>
              <li><Link href="/hotels?city=Goa" className="hover:text-white transition-colors">Goa, India</Link></li>
              <li><Link href="/hotels?city=Zermatt" className="hover:text-white transition-colors">Swiss Alps, Switzerland</Link></li>
              <li><Link href="/hotels?city=New York" className="hover:text-white transition-colors">New York, USA</Link></li>
            </ul>
          </div>

          {/* Property Types */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Property Types</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/hotels" className="hover:text-white transition-colors">Hotels & Suites</Link></li>
              <li><Link href="/hotels" className="hover:text-white transition-colors">Luxury Private Villas</Link></li>
              <li><Link href="/hotels" className="hover:text-white transition-colors">Beachfront Resorts</Link></li>
              <li><Link href="/hotels" className="hover:text-white transition-colors">Serviced Apartments</Link></li>
              <li><Link href="/hotels" className="hover:text-white transition-colors">Alpine Chalets & Cabins</Link></li>
              <li><Link href="/hotels" className="hover:text-white transition-colors">Glamping Domes</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Support & Help</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#faq" className="hover:text-white transition-colors">Help Center & FAQ</a></li>
              <li><Link href="/profile" className="hover:text-white transition-colors">Manage Your Bookings</Link></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Safety Resource Center</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Cancellation Options</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Travel Insurance Guide</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Genius Loyalty Rewards</span></li>
            </ul>
          </div>

          {/* Company & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">About WanderNest</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><span className="hover:text-white cursor-pointer transition-colors">About Us</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Careers & Press</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Investor Relations</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Terms & Conditions</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Privacy Notice</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Security & Compliance</span></li>
            </ul>
          </div>
        </div>

        {/* Accepted Payments Strip */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
            <span className="font-semibold text-slate-300 mr-2">Secure Payments Accepted:</span>
            <span className="px-2 py-1 bg-slate-800 rounded font-semibold text-slate-200 text-[11px] border border-slate-700">VISA</span>
            <span className="px-2 py-1 bg-slate-800 rounded font-semibold text-slate-200 text-[11px] border border-slate-700">Mastercard</span>
            <span className="px-2 py-1 bg-slate-800 rounded font-semibold text-slate-200 text-[11px] border border-slate-700">Amex</span>
            <span className="px-2 py-1 bg-slate-800 rounded font-semibold text-slate-200 text-[11px] border border-slate-700">PayPal</span>
            <span className="px-2 py-1 bg-slate-800 rounded font-semibold text-slate-200 text-[11px] border border-slate-700">UPI / GPay</span>
            <span className="px-2 py-1 bg-slate-800 rounded font-semibold text-slate-200 text-[11px] border border-slate-700">Apple Pay</span>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Globe className="h-3.5 w-3.5 text-slate-400" /> English (US)
            </span>
            <span>•</span>
            <span className="font-semibold text-slate-300">USD ($)</span>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} WanderNest Travel Inc. All rights reserved.</p>
          <p className="mt-1 text-[11px] text-slate-500">
            WanderNest is an independent travel platform inspired by Booking.com design principles. All trademarks and brands belong to their respective owners.
          </p>
        </div>
      </div>
    </footer>
  );
}
