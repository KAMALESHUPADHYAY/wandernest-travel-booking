'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Lock, Mail, User as UserIcon, Phone, ShieldCheck, Loader2 } from 'lucide-react';

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authModalTab, openAuthModal, login, register } = useAuth();

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isLoginSubmitting, setIsLoginSubmitting] = useState(false);

  // Register form state
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerRole, setRegisterRole] = useState<'USER' | 'ADMIN'>('USER');
  const [isRegisterSubmitting, setIsRegisterSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) return;
    setIsLoginSubmitting(true);
    await login(loginEmail, loginPassword);
    setIsLoginSubmitting(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerName || !registerEmail || !registerPassword) return;
    setIsRegisterSubmitting(true);
    await register(registerName, registerEmail, registerPassword, registerPhone, registerRole);
    setIsRegisterSubmitting(false);
  };

  const fillDemoTraveler = () => {
    setLoginEmail('traveler@wandernest.com');
    setLoginPassword('traveler123');
  };

  const fillDemoAdmin = () => {
    setLoginEmail('admin@wandernest.com');
    setLoginPassword('admin123');
  };

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={closeAuthModal}>
      <DialogHeader>
        <div className="flex items-center gap-2 mb-1">
          <div className="h-8 w-8 rounded-lg bg-[#003B95] flex items-center justify-center text-white font-black text-sm">
            WN
          </div>
          <span className="text-xl font-bold tracking-tight text-[#003B95] dark:text-sky-400">
            WanderNest
          </span>
        </div>
        <DialogTitle>
          {authModalTab === 'login' ? 'Sign in to your account' : 'Create your WanderNest account'}
        </DialogTitle>
        <DialogDescription>
          {authModalTab === 'login'
            ? 'Unlock Genius discounts, manage your trips, and view your saved stays.'
            : 'Join millions of travelers discovering luxury stays and flights worldwide.'}
        </DialogDescription>
      </DialogHeader>

      <Tabs value={authModalTab} onValueChange={(val) => openAuthModal(val as 'login' | 'register')}>
        <TabsList>
          <TabsTrigger value="login">Sign In</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>

        {/* SIGN IN TAB */}
        <TabsContent value="login">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <Input
                  type="email"
                  placeholder="name@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoginSubmitting}
              className="w-full bg-[#0071C2] hover:bg-[#005999] text-white py-2.5 rounded-xl font-bold text-sm shadow-md"
            >
              {isLoginSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>

            {/* Quick Demo Credentials */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <p className="text-xs text-center text-slate-500 mb-2 font-medium">
                Quick Demo Fill:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={fillDemoTraveler}
                  className="text-xs py-1.5 px-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-300 transition-colors"
                >
                  Demo Traveler
                </button>
                <button
                  type="button"
                  onClick={fillDemoAdmin}
                  className="text-xs py-1.5 px-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-300 transition-colors"
                >
                  Demo Admin
                </button>
              </div>
            </div>
          </form>
        </TabsContent>

        {/* REGISTER TAB */}
        <TabsContent value="register">
          <form onSubmit={handleRegister} className="space-y-3.5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Alexander Wright"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <Input
                  type="email"
                  placeholder="alexander@example.com"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <Input
                  type="password"
                  placeholder="Minimum 6 characters"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  className="pl-10"
                  minLength={6}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Phone Number (optional)
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <Input
                  type="tel"
                  placeholder="+1 555 0192"
                  value={registerPhone}
                  onChange={(e) => setRegisterPhone(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Account Type
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setRegisterRole('USER')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium border text-center transition-all ${
                    registerRole === 'USER'
                      ? 'border-[#0071C2] bg-blue-50/50 dark:bg-blue-950/40 text-[#0071C2] font-semibold'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Traveler
                </button>
                <button
                  type="button"
                  onClick={() => setRegisterRole('ADMIN')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium border text-center transition-all ${
                    registerRole === 'ADMIN'
                      ? 'border-[#0071C2] bg-blue-50/50 dark:bg-blue-950/40 text-[#0071C2] font-semibold'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Admin / Host
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isRegisterSubmitting}
              className="w-full bg-[#0071C2] hover:bg-[#005999] text-white py-2.5 rounded-xl font-bold text-sm shadow-md mt-2"
            >
              {isRegisterSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </Dialog>
  );
}
