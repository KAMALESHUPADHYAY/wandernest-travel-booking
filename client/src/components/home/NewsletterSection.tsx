'use client';

import React, { useState } from 'react';
import { api } from '@/lib/api';
import { Mail, CheckCircle2, Loader2, Sparkles, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      const res = await api.post('/newsletter', { email });
      if (res.data?.success) {
        toast.success(res.data.message);
        setIsSubscribed(true);
        setEmail('');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Could not subscribe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="bg-[#003B95] text-white rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-2xl"
      >
        {/* Background Decorative Rings */}
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full border border-white/10 pointer-events-none" />
        <div className="absolute -right-10 -top-10 w-60 h-60 rounded-full border border-white/10 pointer-events-none" />

        <div className="max-w-2xl mx-auto text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-[#FEBB02]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Exclusive Secret Deals</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            Get Instant Up to 25% Off Your Next Stay
          </h2>

          <p className="text-xs sm:text-sm text-sky-100 max-w-lg mx-auto leading-relaxed">
            Join the WanderNest Club. Receive private flash sales, limited-time flight discounts, and early access to holiday promotions.
          </p>

          {isSubscribed ? (
            <div className="pt-4 flex items-center justify-center gap-2 text-emerald-300 font-bold text-sm bg-white/10 rounded-2xl py-3 px-6 max-w-md mx-auto">
              <CheckCircle2 className="h-5 w-5" />
              <span>You’re on the list! Check your inbox for promo code WANDER25.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="pt-2 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <div className="relative flex-1">
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full h-12 pl-10 pr-4 rounded-xl bg-white text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm font-semibold outline-none shadow-md focus:ring-2 focus:ring-[#FEBB02]"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                variant="accent"
                className="h-12 px-6 rounded-xl bg-[#FEBB02] hover:bg-[#E5A802] text-slate-950 font-black text-xs sm:text-sm shadow-md"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Subscribing...
                  </>
                ) : (
                  'Subscribe'
                )}
              </Button>
            </form>
          )}

          <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-sky-200/80">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>No spam, guaranteed. Unsubscribe at any time with one click.</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
