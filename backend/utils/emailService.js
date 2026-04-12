const nodemailer = require("nodemailer");

// ── Transporter (Gmail SMTP) ──────────────────────────────────────
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Use SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail App Password (not normal password)
  },
  tls: {
    rejectUnauthorized: false // Yeh line timeout rokegi Render par
  }
});

// ── Main Email Function ───────────────────────────────────────────
const sendApprovalEmail = async (toEmail, guestName, roomNumber, hostelName, checkIn, checkOut) => {
  const checkInFormatted  = new Date(checkIn).toLocaleString("en-IN", {
    dateStyle: "full", timeStyle: "short", timeZone: "Asia/Kolkata"
  });
  const checkOutFormatted = new Date(checkOut).toLocaleString("en-IN", {
    dateStyle: "full", timeStyle: "short", timeZone: "Asia/Kolkata"
  });

  const mailOptions = {
    from: `"StayPG — SGGSIE&T" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "✅ Room Booking Approved — SGGSIE&T Hostel",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8"/>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; background: #f0f9ff; margin: 0; padding: 0; }
          .wrapper { max-width: 600px; margin: 40px auto; background: white; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 60px rgba(14,165,233,0.15); }
          .header { background: linear-gradient(135deg, #0ea5e9 0%, #0d9488 100%); padding: 40px 40px 30px; text-align: center; }
          .header h1 { color: white; font-size: 28px; font-weight: 900; margin: 0; letter-spacing: -0.5px; }
          .header p  { color: rgba(255,255,255,0.85); font-size: 13px; margin: 8px 0 0; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; }
          .badge { display: inline-block; background: rgba(255,255,255,0.2); color: white; padding: 6px 18px; border-radius: 50px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; margin-top: 16px; border: 1px solid rgba(255,255,255,0.3); }
          .body { padding: 40px; }
          .greeting { font-size: 22px; font-weight: 800; color: #0f172a; margin-bottom: 12px; }
          .intro { font-size: 15px; color: #64748b; line-height: 1.7; margin-bottom: 32px; }
          .card { background: #f0f9ff; border: 2px solid #e0f2fe; border-radius: 20px; padding: 28px; margin-bottom: 28px; }
          .card-title { font-size: 11px; font-weight: 800; color: #0ea5e9; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 20px; }
          .detail-row { display: flex; justify-content: space-between; align-items: flex-start; padding: 12px 0; border-bottom: 1px solid #e0f2fe; }
          .detail-row:last-child { border-bottom: none; padding-bottom: 0; }
          .detail-label { font-size: 12px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; }
          .detail-value { font-size: 14px; font-weight: 800; color: #0f172a; text-align: right; max-width: 60%; }
          .qr-notice { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px; text-align: center; margin-bottom: 28px; }
          .qr-notice p { font-size: 13px; color: #64748b; margin: 0; line-height: 1.6; }
          .qr-notice strong { color: #0ea5e9; }
          .btn { display: block; width: fit-content; margin: 0 auto 28px; background: linear-gradient(135deg, #0ea5e9, #0d9488); color: white; text-decoration: none; padding: 16px 40px; border-radius: 14px; font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; text-align: center; }
          .footer { background: #f8fafc; padding: 24px 40px; text-align: center; border-top: 1px solid #e2e8f0; }
          .footer p { font-size: 11px; color: #94a3b8; margin: 4px 0; font-weight: 600; }
          .footer .inst { font-size: 13px; color: #0ea5e9; font-weight: 800; }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="header">
            <h1>StayPG</h1>
            <p>Institutional Accommodation Portal</p>
            <div class="badge">✅ Booking Confirmed</div>
          </div>
          <div class="body">
            <div class="greeting">Namaskar, ${guestName}!</div>
            <div class="intro">
              Your accommodation request at <strong>SGGSIE&T, Nanded</strong> has been reviewed and 
              <strong style="color:#059669;">approved by the Rector</strong>. Here are your stay details:
            </div>

            <div class="card">
              <div class="card-title">🏨 Accommodation Details</div>
              <div class="detail-row">
                <span class="detail-label">Hostel</span>
                <span class="detail-value">${hostelName} Hostel</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Room Number</span>
                <span class="detail-value">${roomNumber}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Check-in</span>
                <span class="detail-value">${checkInFormatted}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Check-out</span>
                <span class="detail-value">${checkOutFormatted}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Institution</span>
                <span class="detail-value">SGGSIE&T, Vishnupuri, Nanded — 431606</span>
              </div>
            </div>

            <div class="qr-notice">
              <p>
                🔐 Your <strong>Smart QR Gate Pass</strong> is now active.<br/>
                Login to <strong>StayPG</strong> → My Bookings → Download QR Pass<br/>
                Show this QR at the main gate for campus entry.
              </p>
            </div>

            <a href="https://hostel-management-system-psi-seven.vercel.app/my-bookings" class="btn">
              View My Booking & QR Pass →
            </a>

            <p style="font-size:13px;color:#94a3b8;text-align:center;line-height:1.6;">
              If you have any questions, contact the Rector's office directly.<br/>
              Please carry a valid photo ID along with your QR Pass.
            </p>
          </div>
          <div class="footer">
            <p class="inst">SHRI GURU GOBIND SINGHJI INSTITUTE OF ENGINEERING & TECHNOLOGY</p>
            <p>Vishnupuri, Nanded, Maharashtra — 431606</p>
            <p style="margin-top:12px;">This is an automated email. Please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Approval email sent to ${toEmail} — MessageID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`❌ Email failed for ${toEmail}:`, err.message);
    // Email fail hone par bhi booking approve rehegi — don't throw
    return { success: false, error: err.message };
  }
};

// ── Rejection Email ───────────────────────────────────────────────
const sendRejectionEmail = async (toEmail, guestName, reason = "Please contact the Rector's office for more information.") => {
  const mailOptions = {
    from: `"StayPG — SGGSIE&T" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "❌ Room Booking Request — Update Required",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8"/>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; background: #fff1f2; margin: 0; padding: 0; }
          .wrapper { max-width: 600px; margin: 40px auto; background: white; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 60px rgba(225,29,72,0.1); }
          .header { background: linear-gradient(135deg, #e11d48 0%, #be185d 100%); padding: 40px; text-align: center; }
          .header h1 { color: white; font-size: 28px; font-weight: 900; margin: 0; }
          .header p  { color: rgba(255,255,255,0.85); font-size: 13px; margin: 8px 0 0; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; }
          .body { padding: 40px; }
          .greeting { font-size: 22px; font-weight: 800; color: #0f172a; margin-bottom: 12px; }
          .intro { font-size: 15px; color: #64748b; line-height: 1.7; margin-bottom: 24px; }
          .reason-box { background: #fff1f2; border: 2px solid #fecdd3; border-radius: 16px; padding: 20px; margin-bottom: 28px; }
          .reason-box p { font-size: 14px; color: #be185d; font-weight: 600; margin: 0; line-height: 1.6; }
          .btn { display: block; width: fit-content; margin: 0 auto 28px; background: linear-gradient(135deg, #0ea5e9, #0d9488); color: white; text-decoration: none; padding: 16px 40px; border-radius: 14px; font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; text-align: center; }
          .footer { background: #f8fafc; padding: 24px 40px; text-align: center; border-top: 1px solid #e2e8f0; }
          .footer p { font-size: 11px; color: #94a3b8; margin: 4px 0; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="header">
            <h1>StayPG</h1>
            <p>Booking Status Update</p>
          </div>
          <div class="body">
            <div class="greeting">Dear ${guestName},</div>
            <div class="intro">
              We regret to inform you that your accommodation request at <strong>SGGSIE&T, Nanded</strong> 
              could not be approved at this time.
            </div>
            <div class="reason-box">
              <p>📋 <strong>Reason:</strong> ${reason}</p>
            </div>
            <p style="font-size:14px;color:#64748b;line-height:1.7;margin-bottom:28px;">
              You may re-apply with correct documents or contact the Rector's office directly for assistance.
            </p>
            <a href="https://hostel-management-system-psi-seven.vercel.app/home" class="btn">
              Try Booking Again →
            </a>
          </div>
          <div class="footer">
            <p style="font-size:13px;color:#0ea5e9;font-weight:800;">SGGSIE&T — Nanded</p>
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 Rejection email sent to ${toEmail}`);
  } catch (err) {
    console.error(`❌ Rejection email failed:`, err.message);
  }
};

module.exports = { sendApprovalEmail, sendRejectionEmail };