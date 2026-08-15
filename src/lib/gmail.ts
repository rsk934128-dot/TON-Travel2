/**
 * Gmail Helper for TON Travel App
 * Using client-side Google OAuth access token to send HTML Travel Vouchers directly
 */

export interface SendEmailParams {
  accessToken: string;
  to: string;
  subject: string;
  htmlBody: string;
}

// Convert standard base64 string to base64url format required by Gmail API
function base64UrlEncode(str: string): string {
  const base64 = btoa(unescape(encodeURIComponent(str)));
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Sends an email via Gmail API using an OAuth Access Token
 */
export async function sendEmailViaGmailApi({
  accessToken,
  to,
  subject,
  htmlBody
}: SendEmailParams): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const mimeEmail = [
      `To: ${to}`,
      `Subject: ${subject}`,
      'Content-Type: text/html; charset=utf-8',
      'MIME-Version: 1.0',
      '',
      htmlBody
    ].join('\r\n');

    const raw = base64UrlEncode(mimeEmail);

    const response = await fetch('https://gmail.googleapis.com/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ raw })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error?.message || `Gmail API returned ${response.status}`);
    }

    const data = await response.json();
    return { success: true, id: data.id };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to send email' };
  }
}

/**
 * Formats a clean HTML voucher string for email dispatch
 */
export function buildVoucherHtml(booking: {
  reference: string;
  hotelName: string;
  location: string;
  roomCategory: string;
  guests: number;
  checkIn: string;
  checkOut: string;
  nights: number;
  totalPaidUsd: number;
  totalPaidTon: number;
  cashbackTon: number;
  cashbackUsd: number;
  payoutWallet: string;
  primaryGuestName: string;
}): string {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0d1117; color: #f0f6fc; padding: 24px; margin: 0; }
      .card { background-color: #161b22; border: 1px solid #30363d; border-radius: 16px; max-width: 580px; margin: 0 auto; overflow: hidden; font-size: 14px; }
      .header { background: linear-gradient(135deg, #0088cc, #005588); padding: 20px 24px; color: white; }
      .header h1 { margin: 0; font-size: 20px; font-weight: 700; letter-spacing: 0.5px; }
      .header p { margin: 4px 0 0; opacity: 0.9; font-size: 12px; }
      .body { padding: 24px; }
      .badge { display: inline-block; background-color: #238636; color: white; font-weight: 600; padding: 4px 10px; border-radius: 20px; font-size: 12px; margin-bottom: 16px; }
      .section-title { color: #8b949e; text-transform: uppercase; font-size: 11px; letter-spacing: 1px; margin-bottom: 8px; font-weight: 600; }
      .hotel-name { font-size: 18px; font-weight: 700; color: #ffffff; margin: 0 0 4px; }
      .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; background-color: #0d1117; padding: 14px; border-radius: 10px; margin-top: 12px; border: 1px solid #21262d; }
      .detail-item strong { display: block; color: #8b949e; font-size: 11px; }
      .detail-item span { color: #e6edf3; font-weight: 600; }
      .summary-box { background-color: #1c2128; border-left: 4px solid #0088cc; padding: 14px; border-radius: 4px; margin-top: 16px; }
      .wallet-box { font-family: monospace; background: #090d12; padding: 8px 12px; border-radius: 6px; border: 1px dashed #30363d; color: #0088cc; font-size: 12px; word-break: break-all; margin-top: 6px; }
      .footer { border-top: 1px solid #21262d; padding: 16px 24px; text-align: center; color: #8b949e; font-size: 12px; background-color: #0d1117; }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="header">
        <h1>💎 TON TRAVEL VOUCHER</h1>
        <p>Issued via Telegram Mini App | Reference ${booking.reference}</p>
      </div>
      <div class="body">
        <span class="badge">✅ Reservation Guaranteed & Check-in Ready</span>
        
        <div class="section-title">Hotel Details</div>
        <div class="hotel-name">${booking.hotelName}</div>
        <div style="color: #8b949e; margin-bottom: 12px;">📍 ${booking.location}</div>

        <div class="detail-grid">
          <div class="detail-item">
            <strong>Room Category</strong>
            <span>${booking.roomCategory}</span>
          </div>
          <div class="detail-item">
            <strong>Guests</strong>
            <span>${booking.guests} Guest(s)</span>
          </div>
          <div class="detail-item">
            <strong>Check-In Date</strong>
            <span>${booking.checkIn}</span>
          </div>
          <div class="detail-item">
            <strong>Check-Out Date</strong>
            <span>${booking.checkOut} (${booking.nights} night/s)</span>
          </div>
        </div>

        <div class="summary-box">
          <div class="section-title" style="color: #0088cc;">Payment & TON Cashback Summary</div>
          <div style="font-size: 16px; font-weight: 700; color: #ffffff; margin-top: 4px;">
            Total Paid: $${booking.totalPaidUsd.toFixed(2)} USD (${booking.totalPaidTon.toFixed(2)} TON)
          </div>
          <div style="color: #3fb950; font-weight: 600; margin-top: 6px; font-size: 13px;">
            👑 Telegram Premium 8% TON Cashback Reward: +${booking.cashbackTon.toFixed(3)} TON (approx. $${booking.cashbackUsd.toFixed(2)} USD)
          </div>
          <div style="margin-top: 8px;">
            <div style="font-size: 11px; color: #8b949e;">Payout Wallet (TON SPACE):</div>
            <div class="wallet-box">${booking.payoutWallet}</div>
          </div>
        </div>

        <div style="margin-top: 16px;">
          <div class="section-title">Guest Information</div>
          <div style="color: #e6edf3; font-weight: 600;">Primary Guest: ${booking.primaryGuestName}</div>
        </div>
      </div>
      <div class="footer">
        Generated on August 14, 2026 by TON Travel App<br/>
        Need support? Contact @TONTravelBot on Telegram.
      </div>
    </div>
  </body>
  </html>
  `;
}
