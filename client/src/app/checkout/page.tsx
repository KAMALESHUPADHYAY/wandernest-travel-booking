'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Lock,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Users,
  MapPin,
  Plane,
  Hotel,
  Tag,
  AlertCircle,
  Clock,
  Sparkles,
  Luggage,
  QrCode,
  Building,
} from 'lucide-react';
import { toast } from 'sonner';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, openAuthModal } = useAuth();

  // Booking Type & Params
  const typeParam = searchParams.get('type') || (searchParams.get('flightId') ? 'flight' : 'hotel');
  const bookingType: 'HOTEL' | 'FLIGHT' = typeParam.toUpperCase() === 'FLIGHT' ? 'FLIGHT' : 'HOTEL';

  const hotelId = searchParams.get('hotelId') || '';
  const roomId = searchParams.get('roomId') || '';
  const checkInParam = searchParams.get('checkIn') || '';
  const checkOutParam = searchParams.get('checkOut') || '';
  const guestsParam = parseInt(searchParams.get('guests') || '2', 10);

  const flightId = searchParams.get('flightId') || '';
  const departDateParam = searchParams.get('departDate') || '';
  const passengersParam = parseInt(searchParams.get('passengers') || '1', 10);

  // Stepper state: 1 (Review) -> 2 (Guest Details) -> 3 (Payment)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Fetched Entity State
  const [itemData, setItemData] = useState<any>(null);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [isLoadingItem, setIsLoadingItem] = useState(true);

  // Guest Details State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [guestList, setGuestList] = useState<string[]>(['']);

  // Promo Code State
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<any>(null);
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<'CREDIT_CARD' | 'UPI' | 'MOCK_WALLET'>('CREDIT_CARD');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [upiId, setUpiId] = useState('');
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);

  // Pre-fill user data if logged in
  useEffect(() => {
    if (user) {
      const parts = (user.name || '').trim().split(' ');
      setFirstName(parts[0] || '');
      setLastName(parts.slice(1).join(' ') || '');
      setEmail(user.email || '');
      setPhone(user.phone || '+91 98765 43210');
      setCardHolder(user.name || 'DEMO TRAVELER');
    }
  }, [user]);

  // Fetch Hotel or Flight data
  useEffect(() => {
    const fetchItem = async () => {
      setIsLoadingItem(true);
      try {
        if (bookingType === 'HOTEL') {
          const hId = hotelId || 'eb18d9a8-a332-47e1-b972-9c18886b1741'; // Fallback to seeded Goa hotel if empty
          const res = await api.get(`/hotels/${hId}`);
          if (res.data?.success && res.data.data) {
            const h = res.data.data;
            setItemData(h);
            const foundRoom = h.rooms?.find((r: any) => r.id === roomId) || h.rooms?.[0];
            setSelectedRoom(foundRoom);
          }
        } else {
          // Flight booking
          const fId = flightId || 'ddc3969d-52d4-4f87-a689-7c86d1cd0863';
          const res = await api.get(`/flights/${fId}`);
          if (res.data?.success && res.data.data) {
            setItemData(res.data.data);
          }
        }
      } catch (err) {
        console.error('Failed to load item for checkout:', err);
        toast.error('Unable to load booking details');
      } finally {
        setIsLoadingItem(false);
      }
    };

    fetchItem();
  }, [bookingType, hotelId, roomId, flightId]);

  // Calculations
  const calculateNights = () => {
    if (!checkInParam || !checkOutParam) return 2;
    try {
      const d1 = new Date(checkInParam).getTime();
      const d2 = new Date(checkOutParam).getTime();
      const n = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));
      return n > 0 ? n : 2;
    } catch {
      return 2;
    }
  };

  const nights = calculateNights();

  const basePrice = React.useMemo(() => {
    if (bookingType === 'HOTEL') {
      const perNight = selectedRoom?.pricePerNight || itemData?.pricePerNight || 150;
      return perNight * nights;
    } else {
      const flightPrice = itemData?.price || 85;
      return flightPrice * (passengersParam || 1);
    }
  }, [bookingType, selectedRoom, itemData, nights, passengersParam]);

  const taxAmount = Math.round(basePrice * 0.12 * 100) / 100;
  const serviceFee = Math.round(basePrice * 0.03 * 100) / 100;
  const discountAmount = appliedPromo ? appliedPromo.discountAmount : 0;
  const totalAmount = Math.max(0, Math.round((basePrice + taxAmount + serviceFee - discountAmount) * 100) / 100);

  // Apply Promo Code
  const handleApplyPromo = async (codeToApply?: string) => {
    const code = (codeToApply || promoInput).trim().toUpperCase();
    if (!code) {
      toast.error('Please enter a promo code');
      return;
    }

    setIsValidatingPromo(true);
    try {
      const res = await api.post('/bookings/validate-promo', {
        promoCode: code,
        bookingType,
        baseAmount: basePrice,
      });

      if (res.data?.success && res.data.data) {
        setAppliedPromo(res.data.data);
        setPromoInput(code);
        toast.success(`Coupon ${code} applied! Saved ${res.data.data.discountPercent}%`);
      }
    } catch (err: any) {
      setAppliedPromo(null);
      toast.error(err.response?.data?.message || 'Invalid or expired promo code');
    } finally {
      setIsValidatingPromo(false);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoInput('');
    toast.info('Promo code removed');
  };

  // Quick fill demo payment cards
  const handleQuickFillCard = (type: 'visa' | 'mastercard' | 'upi') => {
    if (type === 'visa') {
      setPaymentMethod('CREDIT_CARD');
      setCardNumber('4242 4242 4242 4242');
      setCardHolder(user?.name || 'SARAH JENKINS');
      setCardExpiry('12/28');
      setCardCvv('123');
      toast.info('Pre-filled Demo Visa card (Successful test payment)');
    } else if (type === 'mastercard') {
      setPaymentMethod('CREDIT_CARD');
      setCardNumber('5555 5555 5555 4444');
      setCardHolder(user?.name || 'ALEX MORGAN');
      setCardExpiry('09/27');
      setCardCvv('456');
      toast.info('Pre-filled Demo Mastercard');
    } else if (type === 'upi') {
      setPaymentMethod('UPI');
      setUpiId('traveler@okaxis');
      toast.info('Pre-filled Demo Instant UPI ID');
    }
  };

  // Step 2 Validation
  const handleProceedToPayment = () => {
    if (!firstName.trim() || !lastName.trim()) {
      toast.error('Please enter first and last name');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    if (!phone.trim()) {
      toast.error('Please enter a valid mobile number');
      return;
    }
    setCurrentStep(3);
  };

  // Final Payment & Booking Submit
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.warning('Please log in to confirm your booking and view your receipt');
      openAuthModal('login');
      return;
    }

    setIsSubmittingBooking(true);
    try {
      const payload: any = {
        bookingType,
        contactInfo: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          phone: phone.trim(),
        },
        guestDetails: [{ name: `${firstName} ${lastName}`, type: 'Primary Guest' }],
        specialRequests: specialRequests.trim() || undefined,
        promoCode: appliedPromo?.promoCode || undefined,
        paymentMethod,
        paymentDetails: {
          cardBrand: paymentMethod === 'CREDIT_CARD' ? (cardNumber.startsWith('5') ? 'Mastercard' : 'Visa') : 'UPI',
          last4: paymentMethod === 'CREDIT_CARD' ? (cardNumber.replace(/\s/g, '').slice(-4) || '4242') : '9999',
          expMonth: cardExpiry.split('/')[0] || '12',
          expYear: cardExpiry.split('/')[1] || '28',
        },
      };

      if (bookingType === 'HOTEL') {
        payload.hotelId = itemData.id;
        payload.roomId = selectedRoom.id;
        const now = new Date();
        const cin = checkInParam ? new Date(checkInParam) : new Date(now.getTime() + 1000 * 60 * 60 * 24 * 7);
        const cout = checkOutParam ? new Date(checkOutParam) : new Date(now.getTime() + 1000 * 60 * 60 * 24 * 9);
        payload.checkIn = cin.toISOString();
        payload.checkOut = cout.toISOString();
        payload.guests = guestsParam || 2;
      } else {
        payload.flightId = itemData.id;
        const now = new Date();
        payload.flightDepartureDate = departDateParam ? new Date(departDateParam).toISOString() : new Date(now.getTime() + 1000 * 60 * 60 * 24 * 5).toISOString();
        payload.passengers = passengersParam || 1;
      }

      const res = await api.post('/bookings', payload);

      if (res.data?.success && res.data.data) {
        const booking = res.data.data;
        toast.success(`Booking Confirmed! Ref: ${booking.bookingNumber}`, {
          description: 'A confirmation email with an Ethereal preview link has been generated.',
        });
        // Clear session storage selected item
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('wandernest_selected_flight');
          sessionStorage.removeItem('wandernest_selected_hotel');
        }
        router.push(`/checkout/confirmation/${booking.bookingNumber}`);
      }
    } catch (err: any) {
      console.error('Booking submission error:', err);
      toast.error(err.response?.data?.message || 'Payment processing failed. Please try again.');
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      {/* Top Header Bar */}
      <header className="bg-[#003B95] text-white py-6 px-4 sm:px-6 lg:px-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              Secure Checkout & Booking
            </h1>
            <p className="text-xs text-blue-100 flex items-center gap-1.5 mt-0.5">
              <ShieldCheck className="h-3.5 w-3.5 text-[#FEBB02]" />
              <span>256-bit SSL encrypted &bull; Booking.com protection</span>
            </p>
          </div>

          {/* Stepper Indicator */}
          <div className="flex items-center gap-2 sm:gap-3 bg-white/10 px-4 py-2 rounded-2xl border border-white/15">
            {[
              { num: 1, label: 'Review' },
              { num: 2, label: 'Traveler' },
              { num: 3, label: 'Payment' },
            ].map((step) => {
              const isActive = currentStep === step.num;
              const isPast = currentStep > step.num;
              return (
                <div key={step.num} className="flex items-center gap-1.5">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                      isActive
                        ? 'bg-[#FEBB02] text-slate-950 shadow-md scale-110'
                        : isPast
                        ? 'bg-emerald-500 text-white'
                        : 'bg-white/20 text-white/70'
                    }`}
                  >
                    {isPast ? '✓' : step.num}
                  </div>
                  <span
                    className={`text-xs font-bold hidden sm:inline ${
                      isActive ? 'text-white' : 'text-white/60'
                    }`}
                  >
                    {step.label}
                  </span>
                  {step.num < 3 && <span className="text-white/30 text-xs mx-0.5">&rsaquo;</span>}
                </div>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Checkout Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Multi-Step Forms (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* ==================================================== */}
            {/* STEP 1: REVIEW SELECTION */}
            {/* ==================================================== */}
            {currentStep === 1 && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#0071C2]">Step 1 of 3</span>
                    <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
                      Review Your Trip Details
                    </h2>
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 text-[#0071C2]">
                    {bookingType === 'HOTEL' ? '🏨 Hotel Stay' : '✈️ Flight Ticket'}
                  </span>
                </div>

                {isLoadingItem ? (
                  <div className="animate-pulse space-y-4">
                    <div className="h-36 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
                    <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
                  </div>
                ) : itemData ? (
                  <div className="space-y-6">
                    {/* Item Card Preview */}
                    {bookingType === 'HOTEL' ? (
                      <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-700/60 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                        <div className="relative w-full sm:w-32 h-28 rounded-xl overflow-hidden bg-slate-200 shrink-0">
                          <Image
                            src={
                              (() => {
                                try {
                                  return JSON.parse(itemData.images)[0];
                                } catch {
                                  return 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80';
                                }
                              })()
                            }
                            alt={itemData.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="space-y-1.5 flex-1">
                          <h3 className="font-black text-base text-slate-900 dark:text-slate-100">
                            {itemData.name}
                          </h3>
                          <p className="text-xs text-slate-500 flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-[#0071C2]" />
                            <span>{itemData.address}, {itemData.city}</span>
                          </p>
                          <div className="pt-1 flex flex-wrap items-center gap-3 text-xs text-slate-700 dark:text-slate-300 font-semibold">
                            <span className="bg-white dark:bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                              🛏️ {selectedRoom?.name || 'Luxury Room'}
                            </span>
                            <span>{nights} night(s) &bull; {guestsParam} guest(s)</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-700/60 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-[#0071C2]">
                              <Plane className="h-4 w-4" />
                            </div>
                            <div>
                              <span className="font-bold text-sm text-slate-900 dark:text-slate-100 block">
                                {itemData.airline} ({itemData.flightNumber})
                              </span>
                              <span className="text-[11px] text-slate-400 uppercase font-mono">{itemData.cabinClass}</span>
                            </div>
                          </div>
                          <span className="text-xs text-slate-500 bg-white dark:bg-slate-900 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                            {passengersParam} passenger(s)
                          </span>
                        </div>

                        <div className="grid grid-cols-3 items-center text-center pt-2">
                          <div>
                            <span className="text-lg font-black text-slate-900 dark:text-slate-100 block">{itemData.departureAirport}</span>
                            <span className="text-xs text-slate-500">{itemData.departureCity}</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <span className="text-[10px] text-slate-400">{Math.floor(itemData.duration / 60)}h {itemData.duration % 60}m</span>
                            <div className="w-full h-0.5 bg-slate-300 dark:bg-slate-600 my-1 relative">
                              <Plane className="h-3 w-3 text-[#0071C2] absolute left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90" />
                            </div>
                            <span className="text-[10px] font-bold text-emerald-600">{itemData.stops === 0 ? 'Non-stop' : `${itemData.stops} stop`}</span>
                          </div>
                          <div>
                            <span className="text-lg font-black text-slate-900 dark:text-slate-100 block">{itemData.arrivalAirport}</span>
                            <span className="text-xs text-slate-500">{itemData.arrivalCity}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Cancellation Policy Banner */}
                    <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 flex items-start gap-3 text-xs text-emerald-900 dark:text-emerald-100">
                      <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block">WanderNest Flexible Refund Guarantee</span>
                        <p className="text-[11px] text-emerald-700 dark:text-emerald-300 mt-0.5">
                          Free 100% full refund if cancelled 48 hours or more before your trip. 50% partial refund if cancelled between 24 and 48 hours. Transparent terms with zero booking fees.
                        </p>
                      </div>
                    </div>

                    <Button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      variant="default"
                      className="w-full h-12 bg-[#0071C2] hover:bg-[#005999] text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 text-sm"
                    >
                      <span>Continue to Traveler Details</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                ) : null}
              </div>
            )}

            {/* ==================================================== */}
            {/* STEP 2: TRAVELER & GUEST DETAILS */}
            {/* ==================================================== */}
            {currentStep === 2 && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#0071C2]">Step 2 of 3</span>
                    <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
                      Traveler Contact & Guest Info
                    </h2>
                  </div>
                  {!user && (
                    <Button
                      type="button"
                      onClick={() => openAuthModal('login')}
                      variant="outline"
                      size="sm"
                      className="rounded-xl text-xs font-bold text-[#0071C2]"
                    >
                      Sign In to autofill
                    </Button>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        First Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="e.g. Sarah"
                        className="w-full h-11 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-xs font-medium outline-none focus:border-[#0071C2]"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Last Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="e.g. Jenkins"
                        className="w-full h-11 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-xs font-medium outline-none focus:border-[#0071C2]"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. sarah@example.com"
                        className="w-full h-11 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-xs font-medium outline-none focus:border-[#0071C2]"
                        required
                      />
                      <span className="text-[10px] text-slate-400">Confirmation voucher will be emailed here.</span>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Mobile Phone Number <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. +91 98765 43210"
                        className="w-full h-11 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-xs font-medium outline-none focus:border-[#0071C2]"
                        required
                      />
                      <span className="text-[10px] text-slate-400">For SMS departure & check-in alerts.</span>
                    </div>
                  </div>

                  <div className="space-y-1 pt-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Special Requests (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      placeholder="e.g. Non-smoking room, early arrival, high-floor preference, wheelchair assistance..."
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-xs font-medium outline-none focus:border-[#0071C2]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                  <Button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    variant="ghost"
                    className="rounded-xl text-xs font-bold flex items-center gap-1.5"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Review</span>
                  </Button>

                  <Button
                    type="button"
                    onClick={handleProceedToPayment}
                    variant="default"
                    className="h-11 px-6 rounded-xl bg-[#0071C2] hover:bg-[#005999] text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
                  >
                    <span>Proceed to Payment</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* ==================================================== */}
            {/* STEP 3: MOCK PAYMENT GATEWAY */}
            {/* ==================================================== */}
            {currentStep === 3 && (
              <form
                onSubmit={handleFinalSubmit}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6"
              >
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#0071C2]">Step 3 of 3</span>
                    <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
                      Payment Details
                    </h2>
                  </div>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                    <Lock className="h-3 w-3" />
                    <span>Encrypted Simulation</span>
                  </span>
                </div>

                {/* DEMO CALLOUT BANNER */}
                <div className="bg-amber-50 dark:bg-amber-950/30 border-2 border-dashed border-amber-300 dark:border-amber-700 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200 font-bold text-xs uppercase tracking-wider">
                    <Sparkles className="h-4 w-4 text-[#FEBB02]" />
                    <span>Demo Payment Gateway &mdash; No Real Money</span>
                  </div>
                  <p className="text-xs text-amber-900/90 dark:text-amber-200/80 leading-relaxed">
                    This is a simulation environment for testing WanderNest. No actual credit/debit card charges will be made. Click any test credential below to instantly pre-fill the form:
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleQuickFillCard('visa')}
                      className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-amber-300 text-slate-800 dark:text-slate-100 text-[11px] font-bold hover:bg-amber-100 transition-colors"
                    >
                      💳 Visa (4242 4242...)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickFillCard('mastercard')}
                      className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-amber-300 text-slate-800 dark:text-slate-100 text-[11px] font-bold hover:bg-amber-100 transition-colors"
                    >
                      💳 Mastercard (5555 5555...)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickFillCard('upi')}
                      className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-amber-300 text-slate-800 dark:text-slate-100 text-[11px] font-bold hover:bg-amber-100 transition-colors"
                    >
                      ⚡ Instant UPI ID
                    </button>
                  </div>
                </div>

                {/* Payment Method Selector Tabs */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Select Payment Method
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'CREDIT_CARD', label: 'Credit / Debit Card', icon: CreditCard },
                      { id: 'UPI', label: 'UPI / QR Code', icon: QrCode },
                      { id: 'MOCK_WALLET', label: 'NetBanking / Wallet', icon: Building },
                    ].map((m) => {
                      const Icon = m.icon;
                      const isSelected = paymentMethod === m.id;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setPaymentMethod(m.id as any)}
                          className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                            isSelected
                              ? 'bg-[#003B95] text-white border-[#003B95] shadow-md ring-2 ring-blue-500/20'
                              : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-[#0071C2]'
                          }`}
                        >
                          <Icon className={`h-4 w-4 mb-1 ${isSelected ? 'text-[#FEBB02]' : 'text-slate-400'}`} />
                          <span className="text-xs font-bold leading-tight">{m.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Credit Card Form Fields */}
                {paymentMethod === 'CREDIT_CARD' && (
                  <div className="space-y-4 pt-2">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Card Number
                      </label>
                      <div className="relative">
                        <CreditCard className="h-4 w-4 text-slate-400 absolute left-3 top-3.5" />
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="4242 4242 4242 4242"
                          maxLength={19}
                          className="w-full h-11 pl-9 pr-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-xs font-mono font-bold outline-none focus:border-[#0071C2]"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-1 space-y-1">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          Name on Card
                        </label>
                        <input
                          type="text"
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value)}
                          placeholder="SARAH JENKINS"
                          className="w-full h-11 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-xs font-medium outline-none focus:border-[#0071C2]"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          Expiry (MM/YY)
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="12/28"
                          maxLength={5}
                          className="w-full h-11 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-xs font-mono font-bold outline-none focus:border-[#0071C2]"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          Security CVV
                        </label>
                        <input
                          type="password"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="123"
                          maxLength={4}
                          className="w-full h-11 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-xs font-mono font-bold outline-none focus:border-[#0071C2]"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* UPI Fields */}
                {paymentMethod === 'UPI' && (
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Enter UPI ID / VPA
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. traveler@okhdfcbank"
                      className="w-full h-11 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold outline-none focus:border-[#0071C2]"
                    />
                    <p className="text-[11px] text-slate-400">
                      A mock payment request notification will be auto-approved instantly.
                    </p>
                  </div>
                )}

                {/* NetBanking / Wallet */}
                {paymentMethod === 'MOCK_WALLET' && (
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                    <p className="font-bold text-slate-900 dark:text-slate-100">WanderNest Mock Wallet</p>
                    <p>Current balance: ₹50,000 (Demo Funds). Instant 1-click authorization.</p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                  <Button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    variant="ghost"
                    className="rounded-xl text-xs font-bold flex items-center gap-1.5"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Traveler Info</span>
                  </Button>

                  <Button
                    type="submit"
                    disabled={isSubmittingBooking}
                    variant="default"
                    className="h-12 px-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm flex items-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-98 transition-all"
                  >
                    {isSubmittingBooking ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Confirming Reservation...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="h-4 w-4" />
                        <span>Pay {formatPrice(totalAmount, 'INR')} & Confirm</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Sticky Summary & Promo Code (4 cols) */}
          <div className="lg:col-span-4 space-y-6 sticky top-24">
            {/* Promo Code Box */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-bold text-xs">
                <Tag className="h-4 w-4 text-[#0071C2]" />
                <span>Have a Coupon Code?</span>
              </div>

              {appliedPromo ? (
                <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 block">
                      {appliedPromo.promoCode} ({appliedPromo.discountPercent}% OFF)
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400">
                      You save {formatPrice(appliedPromo.discountAmount, 'INR')}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemovePromo}
                    className="text-xs font-bold text-rose-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                      placeholder="e.g. WANDER10"
                      className="flex-1 h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-xs font-mono font-bold uppercase outline-none focus:border-[#0071C2]"
                    />
                    <Button
                      type="button"
                      onClick={() => handleApplyPromo()}
                      disabled={isValidatingPromo}
                      variant="outline"
                      size="sm"
                      className="h-10 rounded-xl font-bold text-xs"
                    >
                      {isValidatingPromo ? 'Checking...' : 'Apply'}
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="text-[10px] text-slate-400">Try:</span>
                    {['WANDER10', 'HOTEL20', 'FLY15'].map((code) => (
                      <button
                        key={code}
                        type="button"
                        onClick={() => handleApplyPromo(code)}
                        className="text-[10px] font-bold text-[#0071C2] bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded hover:bg-blue-100"
                      >
                        {code}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Price Breakdown Sidebar Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3">
                Price Breakdown
              </h3>

              <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex justify-between items-center">
                  <span>Base Price ({bookingType === 'HOTEL' ? `${nights} nights` : `${passengersParam} passenger`})</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {formatPrice(basePrice, 'INR')}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span>Taxes & Tourism Fees (12%)</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {formatPrice(taxAmount, 'INR')}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span>Service & Processing Fee (3%)</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {formatPrice(serviceFee, 'INR')}
                  </span>
                </div>

                {appliedPromo && (
                  <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400 font-bold">
                    <span>Discount ({appliedPromo.promoCode})</span>
                    <span>-{formatPrice(appliedPromo.discountAmount, 'INR')}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-baseline">
                  <div>
                    <span className="text-sm font-black text-slate-900 dark:text-slate-100 block">Total Due</span>
                    <span className="text-[10px] text-slate-400">Includes all taxes & fees</span>
                  </div>
                  <span className="text-2xl font-black text-[#003B95] dark:text-blue-400">
                    {formatPrice(totalAmount, 'INR')}
                  </span>
                </div>
              </div>
            </div>

            {/* Help & Trust Badge */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300">
                <ShieldCheck className="h-4 w-4 text-[#0071C2]" />
                <span>Need help with your reservation?</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Our 24/7 travel care team is here to help with special room requests, dates adjustment, and free instant cancellations.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
          <div className="animate-pulse flex items-center gap-2 text-sm font-semibold text-slate-500">
            <Lock className="h-5 w-5 text-[#0071C2] animate-bounce" />
            <span>Loading WanderNest secure checkout...</span>
          </div>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
