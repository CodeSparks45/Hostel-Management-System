const nodemailer = require("nodemailer");

// ── Brevo SMTP — Render pe kaam karne wala config ──
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,  // Brevo account email
    pass: process.env.EMAIL_PASS,  // Brevo SMTP API Key (Settings → SMTP & API)
  },
  connectionTimeout: 30000,
  greetingTimeout: 15000,
  socketTimeout: 30000,
  tls: { rejectUnauthorized: false },
  pool: true,
  maxConnections: 3,
});

transporter.verify((error, success) => {
  if (error) console.error("❌ SMTP ERROR:", error.message);
  else console.log("✅ SMTP Ready — Brevo Connected");
});

const sendApprovalEmail = async (toEmail, guestName, roomNumber, hostelName, checkIn, checkOut) => {
  const fmt = (d) => new Date(d).toLocaleString("en-IN", {
    dateStyle: "full", timeStyle: "short", timeZone: "Asia/Kolkata"
  });

  try {
    const info = await transporter.sendMail({
      from: `"StayPG — SGGSIE&T" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: "✅ Room Booking Approved — SGGSIE&T Hostel",
      html: `<!DOCTYPE html><html><head><meta charset="UTF-8"/>
      <style>
        *{margin:0;padding:0;box-sizing:border-box}
        body{font-family:'Segoe UI',Arial,sans-serif;background:#f0f9ff}
        .wrap{max-width:600px;margin:32px auto;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 8px 40px rgba(14,165,233,.12)}
        .hdr{background:linear-gradient(135deg,#0ea5e9,#0d9488);padding:36px 40px;text-align:center}
        .hdr h1{color:#fff;font-size:26px;font-weight:900;letter-spacing:-.5px}
        .hdr p{color:rgba(255,255,255,.8);font-size:12px;margin-top:6px;font-weight:600;text-transform:uppercase;letter-spacing:2px}
        .badge{display:inline-block;background:rgba(255,255,255,.2);color:#fff;padding:6px 18px;border-radius:50px;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;margin-top:14px;border:1px solid rgba(255,255,255,.3)}
        .body{padding:36px 40px}
        .greet{font-size:20px;font-weight:800;color:#0f172a;margin-bottom:10px}
        .intro{font-size:14px;color:#64748b;line-height:1.7;margin-bottom:28px}
        .card{background:#f0f9ff;border:2px solid #e0f2fe;border-radius:16px;padding:24px;margin-bottom:24px}
        .card-title{font-size:10px;font-weight:800;color:#0ea5e9;text-transform:uppercase;letter-spacing:2px;margin-bottom:16px}
        .row{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #e0f2fe}
        .row:last-child{border-bottom:none}
        .lbl{font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:1px}
        .val{font-size:13px;font-weight:800;color:#0f172a;text-align:right;max-width:60%}
        .notice{background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;padding:18px;text-align:center;margin-bottom:24px}
        .notice p{font-size:13px;color:#64748b;line-height:1.6}
        .notice strong{color:#0ea5e9}
        .btn{display:block;width:fit-content;margin:0 auto 24px;background:linear-gradient(135deg,#0ea5e9,#0d9488);color:#fff;text-decoration:none;padding:14px 36px;border-radius:12px;font-size:13px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;text-align:center}
        .ftr{background:#f8fafc;padding:22px 40px;text-align:center;border-top:1px solid #e2e8f0}
        .ftr p{font-size:11px;color:#94a3b8;margin:3px 0;font-weight:600}
        .inst{font-size:12px!important;color:#0ea5e9!important;font-weight:800!important}
      </style></head><body>
      <div class="wrap">
        <div class="hdr">
          <h1>StayPG</h1>
          <p>Institutional Accommodation Portal</p>
          <div class="badge">✅ Booking Confirmed</div>
        </div>
        <div class="body">
          <div class="greet">Namaskar, ${guestName}!</div>
          <div class="intro">Your accommodation at <strong>SGGSIE&T, Nanded</strong> has been <strong style="color:#059669">approved by the Rector</strong>. Your stay details are below.</div>
          <div class="card">
            <div class="card-title">🏨 Accommodation Details</div>
            <div class="row"><span class="lbl">Hostel</span><span class="val">${hostelName}</span></div>
            <div class="row"><span class="lbl">Room Number</span><span class="val">${roomNumber}</span></div>
            <div class="row"><span class="lbl">Check-in</span><span class="val">${fmt(checkIn)}</span></div>
            <div class="row"><span class="lbl">Check-out</span><span class="val">${fmt(checkOut)}</span></div>
            <div class="row"><span class="lbl">Institution</span><span class="val">SGGSIE&T, Nanded — 431606</span></div>
          </div>
          <div class="notice">
            <p>🔐 Your <strong>Smart QR Gate Pass</strong> is now active.<br/>Login to <strong>StayPG</strong> → My Bookings → View QR Pass<br/>Show QR at main gate for campus entry.</p>
          </div>
          <a href="https://hostel-management-system-psi-seven.vercel.app/my-bookings" class="btn">View My Booking & QR Pass →</a>
          <p style="font-size:12px;color:#94a3b8;text-align:center;line-height:1.6">Carry a valid photo ID along with your QR Pass.<br/>Contact Rector's office for any queries.</p>
        </div>
        <div class="ftr">
          <p class="inst">SHRI GURU GOBIND SINGHJI INSTITUTE OF ENGINEERING & TECHNOLOGY</p>
          <p>Vishnupuri, Nanded, Maharashtra — 431606</p>
          <p style="margin-top:10px">This is an automated email. Please do not reply.</p>
        </div>
      </div></body></html>`,
    });
    console.log(`✅ Email sent → ${toEmail} | ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`❌ Email failed → ${toEmail}:`, err.message);
    return { success: false, error: err.message };
  }
};

const sendRejectionEmail = async (toEmail, guestName, reason = "Please contact the Rector's office.") => {
  try {
    await transporter.sendMail({
      from: `"StayPG — SGGSIE&T" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: "❌ Room Booking Request — Not Approved",
      html: `<!DOCTYPE html><html><head><meta charset="UTF-8"/>
      <style>
        body{font-family:'Segoe UI',Arial,sans-serif;background:#fff1f2}
        .wrap{max-width:600px;margin:32px auto;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 8px 40px rgba(225,29,72,.08)}
        .hdr{background:linear-gradient(135deg,#e11d48,#be185d);padding:36px 40px;text-align:center}
        .hdr h1{color:#fff;font-size:26px;font-weight:900}
        .hdr p{color:rgba(255,255,255,.8);font-size:12px;margin-top:6px;font-weight:600;text-transform:uppercase;letter-spacing:2px}
        .body{padding:36px 40px}
        .greet{font-size:20px;font-weight:800;color:#0f172a;margin-bottom:10px}
        .intro{font-size:14px;color:#64748b;line-height:1.7;margin-bottom:20px}
        .reason{background:#fff1f2;border:2px solid #fecdd3;border-radius:14px;padding:18px;margin-bottom:24px}
        .reason p{font-size:13px;color:#be185d;font-weight:600;line-height:1.6}
        .btn{display:block;width:fit-content;margin:0 auto 24px;background:linear-gradient(135deg,#0ea5e9,#0d9488);color:#fff;text-decoration:none;padding:14px 36px;border-radius:12px;font-size:13px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;text-align:center}
        .ftr{background:#f8fafc;padding:22px 40px;text-align:center;border-top:1px solid #e2e8f0}
        .ftr p{font-size:11px;color:#94a3b8;margin:3px 0}
      </style></head><body>
      <div class="wrap">
        <div class="hdr"><h1>StayPG</h1><p>Booking Status Update</p></div>
        <div class="body">
          <div class="greet">Dear ${guestName},</div>
          <div class="intro">We regret that your accommodation request at <strong>SGGSIE&T, Nanded</strong> could not be approved at this time.</div>
          <div class="reason"><p>📋 <strong>Reason:</strong> ${reason}</p></div>
          <p style="font-size:13px;color:#64748b;line-height:1.7;margin-bottom:24px">You may re-apply with correct documents or contact the Rector's office for assistance.</p>
          <a href="https://hostel-management-system-psi-seven.vercel.app/home" class="btn">Try Booking Again →</a>
        </div>
        <div class="ftr"><p style="font-size:12px;color:#0ea5e9;font-weight:800">SGGSIE&T — Nanded</p><p>This is an automated email. Do not reply.</p></div>
      </div></body></html>`,
    });
    console.log(`📧 Rejection email → ${toEmail}`);
  } catch (err) {
    console.error(`❌ Rejection email failed:`, err.message);
  }
};

module.exports = { sendApprovalEmail, sendRejectionEmail };