'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Compass,
  Bed,
  Plane,
  MapPin,
  Tag,
  Heart,
  Moon,
  Sun,
  ShieldCheck,
  ChevronDown,
  Menu,
  X,
  Luggage,
  Globe,
  DollarSign,
  User as UserIcon,
  LogOut,
} from 'lucide-react';

export function Navbar() {
  const { user, logout, openAuthModal } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('INR');

  useEffect(() => {
    if (typeof document !== 'undefined') {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    }
  }, []);

  const toggleTheme = () => {
    if (typeof document !== 'undefined') {
      const isDark = document.documentElement.classList.toggle('dark');
      setIsDarkMode(isDark);
    }
  };

  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#003B95] text-white shadow-md backdrop-blur-md">
      {/* Top Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-10 w-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-[#FEBB02] group-hover:scale-105 transition-transform shadow-inner">
              <Compass className="h-6 w-6" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-white">
                Wander<span className="text-[#FEBB02]">Nest</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] tracking-widest uppercase font-bold text-sky-200/90 bg-white/10 px-1.5 py-0.5 rounded">
                Booking
              </span>
            </div>
          </Link>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link
              href="/hotels"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-white/90 hover:bg-white/10 transition-colors"
            >
              <Bed className="h-4 w-4 text-[#FEBB02]" />
              Stays
            </Link>
            <Link
              href="/flights"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-white/90 hover:bg-white/10 transition-colors"
            >
              <Plane className="h-4 w-4" />
              Flights
            </Link>
            <Link
              href="/destinations"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-white/90 hover:bg-white/10 transition-colors"
            >
              <MapPin className="h-4 w-4 text-emerald-300" />
              Destinations
            </Link>
            <a
              href="#special-deals"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-white/90 hover:bg-white/10 transition-colors"
            >
              <Tag className="h-4 w-4 text-[#FEBB02]" />
              Deals
            </a>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Currency Selector */}
            <div className="relative">
              <button
                onClick={() => setIsCurrencyModalOpen(!isCurrencyModalOpen)}
                className="flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
                title="Select Currency"
              >
                <span>{selectedCurrency}</span>
                <ChevronDown className="h-3.5 w-3.5 text-white/70" />
              </button>

              {isCurrencyModalOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50">
                  <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase">
                    Select Currency
                  </div>
                  {currencies.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => {
                        setSelectedCurrency(c.code);
                        setIsCurrencyModalOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                        selectedCurrency === c.code ? 'font-bold text-[#0071C2]' : ''
                      }`}
                    >
                      <span>{c.name}</span>
                      <span className="font-mono text-slate-400">{c.code} ({c.symbol})</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-white/10 text-white/90 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="h-4 w-4 text-[#FEBB02]" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Wishlist Link */}
            <Link
              href="/wishlist"
              className="relative p-2 rounded-lg hover:bg-white/10 text-white/90 transition-colors"
              title="Saved properties"
            >
              <Heart className="h-5 w-5" />
              {user?._count?.wishlists ? (
                <span className="absolute -top-1 -right-1 bg-[#FEBB02] text-slate-950 text-[10px] font-black h-4 w-4 rounded-full flex items-center justify-center animate-pulse">
                  {user._count.wishlists}
                </span>
              ) : null}
            </Link>

            {/* User Profile or Sign In Buttons */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 py-1.5 px-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all border border-white/15"
                >
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                    alt={user.name}
                    className="h-7 w-7 rounded-full object-cover ring-2 ring-[#FEBB02]"
                  />
                  <div className="hidden md:flex flex-col text-left">
                    <span className="text-xs font-bold leading-tight">{user.name}</span>
                    <span className="text-[10px] text-sky-200 uppercase font-semibold">
                      {user.role === 'ADMIN' ? 'Admin' : 'Genius Level 1'}
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-white/70" />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs text-slate-500 dark:text-slate-400">Signed in as</p>
                      <p className="text-sm font-bold truncate">{user.email}</p>
                      {user.role === 'ADMIN' && (
                        <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold uppercase bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-md">
                          <ShieldCheck className="h-3 w-3" /> Admin Privileges
                        </span>
                      )}
                    </div>

                    <Link
                      href="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Luggage className="h-4 w-4 text-[#0071C2]" />
                      My Bookings & Trips
                    </Link>

                    <Link
                      href="/wishlist"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Heart className="h-4 w-4 text-rose-500" />
                      Saved Stays & Wishlist
                    </Link>

                    {user.role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors"
                      >
                        <ShieldCheck className="h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    )}

                    <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => openAuthModal('login')}
                  variant="bookingNav"
                  size="sm"
                  className="text-xs font-bold"
                >
                  Sign in
                </Button>
                <Button
                  onClick={() => openAuthModal('register')}
                  variant="accent"
                  size="sm"
                  className="text-xs font-bold shadow-sm"
                >
                  Register
                </Button>
              </div>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-white/90 hover:bg-white/10 rounded-lg"
              aria-label="Toggle navigation"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-[#002B6E] px-4 pt-3 pb-6 border-t border-white/10 space-y-2">
            <Link
              href="/hotels"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-white/10 text-sm font-medium"
            >
              <Bed className="h-4 w-4 text-[#FEBB02]" /> Stays & Hotels
            </Link>
            <Link
              href="/flights"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-white/10 text-sm font-medium"
            >
              <Plane className="h-4 w-4" /> Flights
            </Link>
            <Link
              href="/destinations"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-white/10 text-sm font-medium"
            >
              <MapPin className="h-4 w-4 text-emerald-300" /> Explore Destinations
            </Link>
            <a
              href="#special-deals"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-white/10 text-sm font-medium"
            >
              <Tag className="h-4 w-4 text-[#FEBB02]" /> Deals & Special Offers
            </a>
            <Link
              href="/wishlist"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-white/10 text-sm font-medium"
            >
              <Heart className="h-4 w-4 text-rose-400" /> Saved Properties
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
