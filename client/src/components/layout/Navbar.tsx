'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Bed,
  Plane,
  Compass,
  Heart,
  User as UserIcon,
  LogOut,
  Moon,
  Sun,
  ShieldCheck,
  ChevronDown,
  Menu,
  X,
  Luggage,
} from 'lucide-react';

export function Navbar() {
  const { user, logout, openAuthModal } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    if (typeof document !== 'undefined') {
      const isDark = document.documentElement.classList.toggle('dark');
      setIsDarkMode(isDark);
    }
  };

  return (
    <header className="bg-[#003B95] text-white">
      {/* Top Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-10 w-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-[#FEBB02] group-hover:scale-105 transition-transform">
              <Compass className="h-6 w-6" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-white">
                Wander<span className="text-[#FEBB02]">Nest</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] tracking-widest uppercase font-semibold text-sky-200/80 bg-white/10 px-1.5 py-0.5 rounded">
                Booking
              </span>
            </div>
          </Link>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Currency Badge */}
            <button
              className="hidden sm:flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
              title="Currency selection"
            >
              <span>USD</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-white/10 text-white/90 transition-colors"
              aria-label="Toggle theme"
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
                <span className="absolute -top-1 -right-1 bg-[#FEBB02] text-slate-950 text-[10px] font-black h-4 w-4 rounded-full flex items-center justify-center">
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
              className="md:hidden p-2 text-white/90 hover:bg-white/10 rounded-lg"
              aria-label="Toggle navigation"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Navigation Categories Sub-bar (Booking.com signature pills) */}
        <nav className="flex items-center gap-1.5 sm:gap-2 pb-3 overflow-x-auto no-scrollbar pt-1">
          <Link
            href="/hotels"
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold bg-white/20 text-white border border-white/30 whitespace-nowrap shadow-sm transition-all hover:bg-white/25"
          >
            <Bed className="h-4 w-4 text-[#FEBB02]" />
            <span>Stays</span>
          </Link>
          <Link
            href="/flights"
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold text-white/90 hover:bg-white/10 border border-transparent hover:border-white/20 whitespace-nowrap transition-all"
          >
            <Plane className="h-4 w-4" />
            <span>Flights</span>
          </Link>
          <Link
            href="/destinations"
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold text-white/90 hover:bg-white/10 border border-transparent hover:border-white/20 whitespace-nowrap transition-all"
          >
            <Compass className="h-4 w-4" />
            <span>Explore Destinations</span>
          </Link>
        </nav>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#002B6E] px-4 pt-3 pb-6 border-t border-white/10 space-y-2">
          <Link
            href="/hotels"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-white/10 text-sm font-medium"
          >
            <Bed className="h-4 w-4 text-[#FEBB02]" /> Stays & Hotels
          </Link>
          <Link
            href="/flights"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-white/10 text-sm font-medium"
          >
            <Plane className="h-4 w-4" /> Flights
          </Link>
          <Link
            href="/destinations"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-white/10 text-sm font-medium"
          >
            <Compass className="h-4 w-4" /> Explore Destinations
          </Link>
          <Link
            href="/wishlist"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-white/10 text-sm font-medium"
          >
            <Heart className="h-4 w-4 text-rose-400" /> Saved Properties
          </Link>
        </div>
      )}
    </header>
  );
}
