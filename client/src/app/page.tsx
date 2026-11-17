'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Compass,
  CheckCircle2,
  AlertCircle,
  Database,
  Lock,
  ExternalLink,
  Sparkles,
  Plane,
  Bed,
  MapPin,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import axios from 'axios';

export default function HomePage() {
  const { user, openAuthModal, logout } = useAuth();
  const [backendHealth, setBackendHealth] = useState<any>(null);
  const [healthStatus, setHealthStatus] = useState<'loading' | 'connected' | 'error'>('loading');

  useEffect(() => {
    const checkApi = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/health');
        setBackendHealth(res.data);
        setHealthStatus('connected');
      } catch (err) {
        setHealthStatus('error');
      }
    };
    checkApi();
  }, []);

  return (
    <div className="space-y-10 pb-16">
      {/* Signature Booking.com Navy Hero Banner */}
      <section className="bg-[#003B95] text-white pt-10 pb-20 px-4 sm:px-6 lg:px-8 shadow-inner">
        <div className="max-w-7xl mx-auto space-y-4">
          <Badge variant="deal" className="text-xs px-3 py-1 font-bold">
            <Sparkles className="h-3.5 w-3.5 mr-1 inline" /> Phase 1 Initialized & Active
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Find your next stay <br />
            <span className="text-[#FEBB02]">anywhere on Earth</span>
          </h1>
          <p className="text-lg sm:text-xl text-sky-100 max-w-2xl font-normal leading-relaxed">
            Search low prices on hotels, luxury villas, flight routes, and dream destinations across the globe.
          </p>
        </div>
      </section>

      {/* Main Status & Architecture Verification Container */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Backend & Database Connection */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-md border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-[#0071C2]">
                  <Database className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Backend & Prisma Database
                  </h3>
                  <p className="text-xs text-slate-500">Node.js Express REST API</p>
                </div>
              </div>
              {healthStatus === 'connected' ? (
                <Badge variant="success" className="gap-1 font-semibold">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Online
                </Badge>
              ) : healthStatus === 'loading' ? (
                <Badge variant="secondary">Probing...</Badge>
              ) : (
                <Badge variant="destructive" className="gap-1">
                  <AlertCircle className="h-3.5 w-3.5" /> Offline
                </Badge>
              )}
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Express TypeScript backend configured with Zod validation, JWT security, and 11 Prisma database models.
            </p>

            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3.5 text-xs space-y-1.5 font-mono text-slate-700 dark:text-slate-300">
              <div className="flex justify-between">
                <span>Health Endpoint:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {healthStatus === 'connected' ? '200 OK' : 'Checking...'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>API Docs (Swagger):</span>
                <a
                  href="http://localhost:5000/api/docs"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#0071C2] hover:underline inline-flex items-center gap-1 font-semibold"
                >
                  /api/docs <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <div className="flex justify-between">
                <span>Database Engine:</span>
                <span className="font-semibold">Prisma / SQLite (dev.db)</span>
              </div>
            </div>
          </div>

          {/* Card 2: Authentication & Role Guard */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-md border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-[#FEBB02]">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Authentication & Session
                  </h3>
                  <p className="text-xs text-slate-500">JWT Token + Bcrypt + Role Guard</p>
                </div>
              </div>
              {user ? (
                <Badge variant="score" className="gap-1 font-bold">
                  <UserCheck className="h-3.5 w-3.5" /> Authenticated
                </Badge>
              ) : (
                <Badge variant="outline">Guest Session</Badge>
              )}
            </div>

            {user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-blue-50/60 dark:bg-blue-950/30 rounded-xl">
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                    alt={user.name}
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-[#0071C2]"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {user.name}
                    </h4>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                  <Badge
                    variant={user.role === 'ADMIN' ? 'deal' : 'secondary'}
                    className="ml-auto text-[10px] font-bold"
                  >
                    {user.role}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={logout}
                    variant="outline"
                    size="sm"
                    className="text-xs text-rose-600 border-rose-200 hover:bg-rose-50"
                  >
                    Sign Out
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Try logging in using the seeded test accounts or register a brand-new traveler/admin profile.
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => openAuthModal('login')}
                    variant="navy"
                    size="sm"
                    className="text-xs"
                  >
                    Open Sign In Modal
                  </Button>
                  <Button
                    onClick={() => openAuthModal('register')}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                  >
                    Create Account
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Architecture Milestones Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#003B95] to-[#0071C2] text-white rounded-3xl p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs uppercase font-extrabold tracking-widest text-[#FEBB02]">
              Phase 1 Milestone Complete
            </span>
            <h2 className="text-2xl font-bold tracking-tight">
              Ready for Phase 2: Booking.com Landing Page & Search
            </h2>
            <p className="text-sm text-sky-100">
              Database is loaded with real destinations (Paris, Tokyo, Bali, New York, Swiss Alps),
              luxury hotels, flights, and promotional deals.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => openAuthModal('login')}
              variant="accent"
              className="text-slate-950 font-bold px-6 py-2.5 rounded-xl shadow-lg"
            >
              Test Sign In Now
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
