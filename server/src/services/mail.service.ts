import nodemailer, { type Transporter } from 'nodemailer';

let transporter: Transporter | null = null;

async function getTransporter(): Promise<Transporter> {
  if (transporter) return transporter;

  try {
    // Generate test SMTP service account from ethereal.email
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log(`✉️ Mock Ethereal Email Mailer initialized (${testAccount.user})`);
  } catch (error) {
    console.warn('⚠️ Could not initialize Ethereal mailer, creating json transport fallback:', error);
    transporter = nodemailer.createTransport({
      jsonTransport: true,
    });
  }

  return transporter;
}

export async function sendBookingConfirmationEmail(booking: any) {
  try {
    const mailer = await getTransporter();

    let contact: any = {};
    try {
      contact = typeof booking.contactInfo === 'string' ? JSON.parse(booking.contactInfo) : booking.contactInfo;
    } catch (e) {
      contact = { email: 'traveler@wandernest.com', fullName: 'Valued Traveler' };
    }

    const recipientEmail = contact.email || 'traveler@wandernest.com';
    const recipientName = contact.fullName || `${contact.firstName || 'Valued'} ${contact.lastName || 'Traveler'}`.trim();

    const isHotel = booking.bookingType === 'HOTEL';
    const title = isHotel
      ? `Hotel Reservation Confirmed - ${booking.hotel?.name || 'Luxury Hotel'}`
      : `Flight Booking Confirmed - ${booking.flight?.airline || 'Airline'} (${booking.flight?.flightNumber || ''})`;

    const detailsHtml = isHotel
      ? `
        <div style="background: #f8fafc; border-radius: 12px; padding: 16px; margin: 16px 0;">
          <h3 style="color: #003B95; margin-top: 0;">${booking.hotel?.name || 'Hotel Stay'}</h3>
          <p style="margin: 4px 0; color: #475569;">📍 ${booking.hotel?.address || ''}, ${booking.hotel?.city || ''}</p>
          <p style="margin: 4px 0; color: #475569;">🗓️ <strong>Check-in:</strong> ${booking.checkIn ? new Date(booking.checkIn).toDateString() : 'N/A'}</p>
          <p style="margin: 4px 0; color: #475569;">🗓️ <strong>Check-out:</strong> ${booking.checkOut ? new Date(booking.checkOut).toDateString() : 'N/A'}</p>
          <p style="margin: 4px 0; color: #475569;">👥 <strong>Guests:</strong> ${booking.guests || 1}</p>
          <p style="margin: 4px 0; color: #475569;">🛏️ <strong>Room:</strong> ${booking.room?.name || 'Standard Room'}</p>
        </div>
      `
      : `
        <div style="background: #f8fafc; border-radius: 12px; padding: 16px; margin: 16px 0;">
          <h3 style="color: #003B95; margin-top: 0;">✈️ ${booking.flight?.airline} (${booking.flight?.flightNumber})</h3>
          <p style="margin: 4px 0; color: #475569;">📍 Route: <strong>${booking.flight?.departureCity} (${booking.flight?.departureAirport})</strong> ➔ <strong>${booking.flight?.arrivalCity} (${booking.flight?.arrivalAirport})</strong></p>
          <p style="margin: 4px 0; color: #475569;">🗓️ <strong>Departure:</strong> ${booking.flightDepartureDate ? new Date(booking.flightDepartureDate).toDateString() : 'N/A'}</p>
          <p style="margin: 4px 0; color: #475569;">🧳 <strong>Baggage:</strong> ${booking.flight?.baggage || 'Included'}</p>
        </div>
      `;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;">
        <div style="background: #003B95; color: white; padding: 24px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 900; letter-spacing: -0.5px;">WanderNest</h1>
          <p style="margin: 4px 0 0; font-size: 14px; color: #FEBB02; font-weight: bold;">Booking Confirmation</p>
        </div>
        
        <div style="padding: 24px;">
          <p style="font-size: 16px;">Dear <strong>${recipientName}</strong>,</p>
          <p>Thank you for choosing WanderNest. Your reservation has been successfully confirmed!</p>
          
          <div style="border: 2px dashed #0071C2; background: #eff6ff; padding: 12px; border-radius: 8px; text-align: center; margin: 16px 0;">
            <span style="font-size: 12px; color: #64748b; font-weight: bold; text-transform: uppercase;">Booking Reference</span>
            <div style="font-size: 22px; font-weight: 900; color: #003B95; letter-spacing: 1px;">${booking.bookingNumber}</div>
          </div>

          ${detailsHtml}

          <div style="background: #f1f5f9; border-radius: 12px; padding: 16px; margin: 16px 0;">
            <h4 style="margin-top: 0; color: #334155;">Payment Summary</h4>
            <table style="width: 100%; font-size: 14px; color: #475569; border-collapse: collapse;">
              <tr>
                <td style="padding: 4px 0;">Base Price</td>
                <td style="text-align: right;">₹${Math.round(booking.basePrice || booking.totalAmount * 0.85)}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0;">Taxes & Tourism Fees</td>
                <td style="text-align: right;">₹${Math.round(booking.taxAmount || booking.totalAmount * 0.12)}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0;">Service Fee</td>
                <td style="text-align: right;">₹${Math.round(booking.serviceFee || booking.totalAmount * 0.03)}</td>
              </tr>
              ${booking.discountAmount && booking.discountAmount > 0 ? `
              <tr style="color: #16a34a; font-weight: bold;">
                <td style="padding: 4px 0;">Promo Discount (${booking.promoCode || 'PROMO'})</td>
                <td style="text-align: right;">-₹${Math.round(booking.discountAmount)}</td>
              </tr>
              ` : ''}
              <tr style="border-top: 1px solid #cbd5e1; font-weight: bold; font-size: 16px; color: #003B95;">
                <td style="padding: 8px 0;">Total Paid</td>
                <td style="text-align: right; padding: 8px 0;">₹${Math.round(booking.totalAmount)}</td>
              </tr>
            </table>
          </div>

          <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 12px; font-size: 12px; color: #065f46;">
            🛡️ <strong>Cancellation Policy:</strong> Free 100% refund if cancelled up to 48 hours before check-in or departure. 50% refund between 24-48 hours.
          </div>

          <p style="margin-top: 24px; font-size: 12px; color: #94a3b8; text-align: center;">
            This is an automated confirmation email from WanderNest Travel Technologies.
          </p>
        </div>
      </div>
    `;

    const info = await mailer.sendMail({
      from: '"WanderNest Booking" <reservations@wandernest.com>',
      to: recipientEmail,
      subject: `[Confirmed] ${title} - ${booking.bookingNumber}`,
      html,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log('===============================================================');
    console.log(`📧 [MOCK EMAIL] Booking Confirmation Sent to: ${recipientEmail}`);
    console.log(`🔖 Booking Reference: ${booking.bookingNumber}`);
    console.log(`💰 Total: ₹${booking.totalAmount}`);
    if (previewUrl) {
      console.log(`🔗 Ethereal Email Preview URL: ${previewUrl}`);
    }
    console.log('===============================================================');

    return { success: true, previewUrl };
  } catch (err) {
    console.error('Failed to send booking confirmation email:', err);
    return { success: false, error: err };
  }
}

export async function sendCancellationEmail(booking: any, refundAmount: number) {
  try {
    const mailer = await getTransporter();

    let contact: any = {};
    try {
      contact = typeof booking.contactInfo === 'string' ? JSON.parse(booking.contactInfo) : booking.contactInfo;
    } catch (e) {
      contact = { email: 'traveler@wandernest.com', fullName: 'Valued Traveler' };
    }

    const recipientEmail = contact.email || 'traveler@wandernest.com';
    const recipientName = contact.fullName || 'Valued Traveler';

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;">
        <div style="background: #e11d48; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 22px; font-weight: 900;">WanderNest</h1>
          <p style="margin: 4px 0 0; font-size: 14px; font-weight: bold;">Booking Cancellation Notice</p>
        </div>
        
        <div style="padding: 24px;">
          <p>Dear <strong>${recipientName}</strong>,</p>
          <p>Your booking <strong>${booking.bookingNumber}</strong> has been cancelled as requested.</p>

          <div style="background: #f8fafc; border-radius: 12px; padding: 16px; margin: 16px 0;">
            <p style="margin: 4px 0;">Status: <strong style="color: #e11d48;">CANCELLED</strong></p>
            <p style="margin: 4px 0;">Original Total: <strong>₹${booking.totalAmount}</strong></p>
            <p style="margin: 4px 0;">Refund Issued: <strong style="color: #16a34a; font-size: 16px;">₹${refundAmount}</strong></p>
          </div>

          <p style="font-size: 13px; color: #64748b;">
            Your mock refund of ₹${refundAmount} has been credited to your original payment method (Demo Gateway).
          </p>
        </div>
      </div>
    `;

    const info = await mailer.sendMail({
      from: '"WanderNest Support" <support@wandernest.com>',
      to: recipientEmail,
      subject: `[Cancelled] Booking ${booking.bookingNumber} Cancellation & Refund Notice`,
      html,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log('===============================================================');
    console.log(`📧 [MOCK EMAIL] Cancellation Notice Sent to: ${recipientEmail}`);
    console.log(`🔖 Booking Reference: ${booking.bookingNumber}`);
    console.log(`💸 Refund Amount: ₹${refundAmount}`);
    if (previewUrl) {
      console.log(`🔗 Ethereal Cancellation Preview URL: ${previewUrl}`);
    }
    console.log('===============================================================');

    return { success: true, previewUrl };
  } catch (err) {
    console.error('Failed to send cancellation email:', err);
    return { success: false, error: err };
  }
}
