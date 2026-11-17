'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  CheckCircle2,
  Printer,
  Download,
  Share2,
  Calendar,
  MapPin,
  Plane,
  Hotel,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  User,
  CreditCard,
  XCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

export default function BookingConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const bookingNumber = params?.bookingNumber as string;

  const [booking, setBooking] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cancellation State
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      if (!bookingNumber) return;
      setIsLoading(true);
      setError(null);
      try {
        const res = await api.get(`/bookings/${bookingNumber}`);
        if (res.data?.success && res.data.data) {
          setBooking(res.data.data);
        } else {
          setError('Booking not found');
        }
      } catch (err: any) {
        console.error('Failed to load booking:', err);
        setError(err.response?.data?.message || 'Could not load reservation details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooking();
  }, [bookingNumber]);

  // Handle Printable PDF
  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  // Calculate cancellation eligibility preview
  const getRefundPreview = () => {
    if (!booking) return { pct: 100, amount: 0, text: 'Full 100% refund' };
    const startDate = booking.bookingType === 'HOTEL' ? booking.checkIn : booking.flightDepartureDate;
    if (!startDate) return { pct: 100, amount: booking.totalAmount, text: 'Full 100% refund' };

    const diffHours = (new Date(startDate).getTime() - Date.now()) / (1000 * 60 * 60);

    if (diffHours > 48) {
      return {
        pct: 100,
        amount: booking.totalAmount,
        text: 'Eligible for 100% Full Refund (> 48h notice)',
      };
    } else if (diffHours >= 24) {
      return {
        pct: 50,
        amount: Math.round(booking.totalAmount * 0.5),
        text: 'Eligible for 50% Partial Refund (24h - 48h notice)',
      };
    } else {
      return {
        pct: 0,
        amount: 0,
        text: 'Non-refundable (< 24h before trip)',
      };
    }
  };

  // Execute Cancellation
  const handleConfirmCancel = async () => {
    setIsCancelling(true);
    try {
      const res = await api.post(`/bookings/${booking.bookingNumber}/cancel`, {
        reason: cancelReason || 'Customer requested online cancellation',
      });

      if (res.data?.success) {
        toast.success('Reservation Cancelled', {
          description: `Refund of ${formatPrice(res.data.data.refundAmount, 'INR')} processed to your original payment method.`,
        });
        setBooking((prev: any) => ({
          ...prev,
          status: 'CANCELLED',
          refundAmount: res.data.data.refundAmount,
        }));
        setIsCancelModalOpen(false);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to cancel reservation');
    } finally {
      setIsCancelling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
        <div className="animate-pulse space-y-3 text-center">
          <div className="w-12 h-12 rounded-full bg-[#0071C2]/20 flex items-center justify-center mx-auto text-[#0071C2]">
            <CheckCircle2 className="h-6 w-6 animate-spin" />
          </div>
          <p className="text-xs font-bold text-slate-500">Loading reservation voucher...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 max-w-md text-center space-y-4 shadow-sm">
          <AlertTriangle className="h-12 w-12 text-rose-500 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Booking Not Found</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">{error || 'Could not locate reservation reference.'}</p>
          <Button
            onClick={() => router.push('/')}
            variant="default"
            className="bg-[#0071C2] hover:bg-[#005999] text-white rounded-xl text-xs font-bold"
          >
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  let contact: any = {};
  try {
    contact = typeof booking.contactInfo === 'string' ? JSON.parse(booking.contactInfo) : booking.contactInfo || {};
  } catch (e) {}

  let paymentDetails: any = {};
  try {
    paymentDetails = booking.payment?.paymentDetails ? JSON.parse(booking.payment.paymentDetails) : {};
  } catch (e) {}

  const refundInfo = getRefundPreview();
  const isCancelled = booking.status === 'CANCELLED';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      {/* Print Specific CSS Styles */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          nav, footer, .no-print {
            display: none !important;
          }
          .printable-card {
            box-shadow: none !important;
            border: 1px solid #cbd5e1 !important;
            margin: 0 !important;
            padding: 16px !important;
            page-break-inside: avoid;
          }
        }
      `}</style>

      {/* Cancellation Confirmation Dialog */}
      <Dialog open={isCancelModalOpen} onOpenChange={setIsCancelModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-black text-rose-600 flex items-center gap-2">
              <XCircle className="h-5 w-5" />
              <span>Cancel Reservation</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Are you sure you want to cancel booking <strong>{booking.bookingNumber}</strong>?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 space-y-1">
              <span className="font-bold block">Refund Policy Applicable:</span>
              <p>{refundInfo.text}</p>
              <p className="font-black text-sm text-emerald-600 dark:text-emerald-400 mt-1">
                Refund Amount: {formatPrice(refundInfo.amount, 'INR')}
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Reason for Cancellation (Optional)
              </label>
              <textarea
                rows={2}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="e.g. Change of plans, dates conflicting, booked alternative..."
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-transparent outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsCancelModalOpen(false)}
                className="rounded-xl font-bold text-xs"
              >
                Keep Booking
              </Button>
              <Button
                type="button"
                disabled={isCancelling}
                onClick={handleConfirmCancel}
                variant="default"
                size="sm"
                className="rounded-xl font-bold text-xs bg-rose-600 hover:bg-rose-700 text-white"
              >
                {isCancelling ? 'Cancelling...' : 'Confirm Cancellation'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Celebration Status Card */}
        <div className={`p-6 sm:p-8 rounded-3xl border shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 ${
          isCancelled
            ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900 text-rose-950 dark:text-rose-100'
            : 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100'
        }`}>
          <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
              isCancelled ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
            }`}>
              {isCancelled ? <XCircle className="h-8 w-8" /> : <CheckCircle2 className="h-8 w-8" />}
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white dark:bg-slate-900 shadow-sm border">
                {isCancelled ? 'Cancelled & Refunded' : 'Confirmed & Guaranteed'}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                {isCancelled ? 'Reservation Cancelled' : 'Your Trip is Confirmed!'}
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {isCancelled
                  ? `Booking ${booking.bookingNumber} has been refunded.`
                  : `Confirmation email with Ethereal preview dispatched to ${contact.email || 'your email'}.`}
              </p>
            </div>
          </div>

          {/* Booking Reference Pill */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-center shadow-sm shrink-0 min-w-[180px]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Booking Reference
            </span>
            <span className="text-xl font-black text-[#003B95] dark:text-blue-400 font-mono tracking-wider block mt-0.5">
              {booking.bookingNumber}
            </span>
          </div>
        </div>

        {/* Action Buttons Toolbar (No-Print) */}
        <div className="no-print flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <Button
              onClick={handlePrint}
              variant="outline"
              size="sm"
              className="rounded-xl text-xs font-bold flex items-center gap-1.5 h-10 border-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <Printer className="h-4 w-4 text-[#0071C2]" />
              <span>Print / Download PDF</span>
            </Button>

            <Button
              onClick={() => {
                if (typeof navigator !== 'undefined') {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success('Reservation link copied to clipboard!');
                }
              }}
              variant="outline"
              size="sm"
              className="rounded-xl text-xs font-bold flex items-center gap-1.5 h-10 border-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {!isCancelled && (
              <Button
                onClick={() => setIsCancelModalOpen(true)}
                variant="outline"
                size="sm"
                className="rounded-xl text-xs font-bold text-rose-600 border-rose-200 hover:bg-rose-50 dark:hover:bg-rose-950/40 h-10"
              >
                <span>Cancel Reservation</span>
              </Button>
            )}

            <Button
              onClick={() => router.push('/')}
              variant="default"
              size="sm"
              className="rounded-xl text-xs font-bold bg-[#0071C2] hover:bg-[#005999] text-white h-10 shadow-sm"
            >
              <span>Back to Home</span>
            </Button>
          </div>
        </div>

        {/* Printable Travel Voucher & Invoice Card */}
        <div className="printable-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          {/* Brand Header */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <div className="text-2xl font-black text-[#003B95] tracking-tight">WanderNest</div>
              <p className="text-[11px] text-slate-400">Official Travel Voucher & Tax Invoice</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 block">
                Ref: {booking.bookingNumber}
              </span>
              <span className="text-[11px] text-slate-400">
                Booked on {new Date(booking.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Reserved Item Summary */}
          {booking.bookingType === 'HOTEL' && booking.hotel && (
            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-5 border border-slate-200/60 dark:border-slate-700 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0071C2] bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded">
                    Hotel Reservation
                  </span>
                  <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 mt-1">
                    {booking.hotel.name}
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3 w-3 text-[#0071C2]" />
                    <span>{booking.hotel.address}, {booking.hotel.city}, {booking.hotel.country}</span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
                <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 block font-semibold">Check-in</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {booking.checkIn ? new Date(booking.checkIn).toDateString() : 'N/A'}
                  </span>
                </div>
                <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 block font-semibold">Check-out</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {booking.checkOut ? new Date(booking.checkOut).toDateString() : 'N/A'}
                  </span>
                </div>
                <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 block font-semibold">Room Type</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {booking.room?.name || 'Standard Luxury Room'}
                  </span>
                </div>
                <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 block font-semibold">Guests</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {booking.guests || 2} guest(s)
                  </span>
                </div>
              </div>
            </div>
          )}

          {booking.bookingType === 'FLIGHT' && booking.flight && (
            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-5 border border-slate-200/60 dark:border-slate-700 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0071C2] bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded">
                Flight Boarding Ticket
              </span>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">
                    {booking.flight.airline} ({booking.flight.flightNumber})
                  </h3>
                  <span className="text-xs text-slate-400 uppercase font-mono">{booking.flight.cabinClass}</span>
                </div>
                <span className="text-xs font-semibold text-slate-500">
                  {booking.flight.baggage || '7kg Cabin + 15kg Check-in'}
                </span>
              </div>

              <div className="grid grid-cols-3 items-center text-center pt-2">
                <div>
                  <span className="text-xl font-black text-slate-900 dark:text-slate-100 block">
                    {booking.flight.departureAirport}
                  </span>
                  <span className="text-xs text-slate-500">{booking.flight.departureCity}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-slate-400">{Math.floor(booking.flight.duration / 60)}h {booking.flight.duration % 60}m</span>
                  <div className="w-full h-0.5 bg-slate-300 dark:bg-slate-600 my-1 relative">
                    <Plane className="h-3 w-3 text-[#0071C2] absolute left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90" />
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600">
                    {booking.flight.stops === 0 ? 'Non-stop' : `${booking.flight.stops} stop`}
                  </span>
                </div>
                <div>
                  <span className="text-xl font-black text-slate-900 dark:text-slate-100 block">
                    {booking.flight.arrivalAirport}
                  </span>
                  <span className="text-xs text-slate-500">{booking.flight.arrivalCity}</span>
                </div>
              </div>
            </div>
          )}

          {/* Traveler Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-2 text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-[#0071C2]" />
                <span>Primary Traveler Contact</span>
              </span>
              <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                {contact.firstName} {contact.lastName || contact.fullName}
              </p>
              <p className="text-slate-500">Email: {contact.email}</p>
              <p className="text-slate-500">Phone: {contact.phone}</p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-2 text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <CreditCard className="h-3.5 w-3.5 text-emerald-600" />
                <span>Mock Payment Receipt</span>
              </span>
              <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                {booking.payment?.method || 'CREDIT_CARD'} (Last 4: {paymentDetails.last4 || '4242'})
              </p>
              <p className="text-slate-500 font-mono text-[11px]">
                Txn ID: {booking.payment?.transactionId || 'TXN-WN-SIMULATED'}
              </p>
              <p className="text-emerald-600 font-semibold">
                Status: {booking.payment?.status || 'SUCCESS'} &bull; Mock Gateway
              </p>
            </div>
          </div>

          {/* Financial Breakdown Table */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">
              Payment Breakdown
            </h4>
            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex justify-between items-center">
                <span>Base Accommodation / Ticket Rate</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {formatPrice(booking.basePrice || booking.totalAmount * 0.85, 'INR')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Taxes & Tourism Levies (12%)</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {formatPrice(booking.taxAmount || booking.totalAmount * 0.12, 'INR')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Service & Processing Fee (3%)</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {formatPrice(booking.serviceFee || booking.totalAmount * 0.03, 'INR')}
                </span>
              </div>

              {booking.discountAmount && booking.discountAmount > 0 && (
                <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400 font-bold">
                  <span>Promo Discount ({booking.promoCode || 'PROMO'})</span>
                  <span>-{formatPrice(booking.discountAmount, 'INR')}</span>
                </div>
              )}

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-baseline font-bold">
                <span className="text-sm text-slate-900 dark:text-slate-100">Total Amount Paid</span>
                <span className="text-xl font-black text-[#003B95] dark:text-blue-400">
                  {formatPrice(booking.totalAmount, 'INR')}
                </span>
              </div>

              {isCancelled && (
                <div className="pt-2 border-t border-rose-200 flex justify-between items-baseline font-bold text-rose-600">
                  <span>Refund Issued (Demo Gateway)</span>
                  <span className="text-lg">-{formatPrice(booking.refundAmount || booking.totalAmount, 'INR')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
