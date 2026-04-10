const nodemailer = require("nodemailer");

// 1. Ek "Transporter" banao (Postman jo email deliver karega)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // .env se aapka email aayega
    pass: process.env.EMAIL_PASS, // .env se wo 16-digit password aayega
  },
});

// 2. Email bhejne ka function
const sendApprovalEmail = async (userEmail, userName, roomNumber) => {
  try {
    const mailOptions = {
      from: `"SGGS Institutional" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: "🎉 Room Booking Approved - SGGSIE&T",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
          <h2 style="color: #0ea5e9;">Welcome to SGGSIE&T Hostel Stay!!</h2>
          <p>Dear <strong>${userName}</strong>,</p>
          <p>Congratulations!! Your Hostel Room application has been successfully verified and approved by the Rector.</p>
          <div style="background-color: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Status:</strong> <span style="color: #10b981;">Approved ✅</span></p>
            <p style="margin: 5px 0 0 0;"><strong>Allocated Room:</strong> ${roomNumber}</p>
          </div>
          <p>You can now  access your Smart Outpass and other features by logging in to your dashboard to.</p>
          <p>Best Regards,<br/><strong>SGGSIE&T_Rector Admin Team</strong></p>
        </div>
      `,
    };

    // Email bhej do
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email successfully sent to ${userEmail}`);
    return true;

  } catch (error) {
    console.error("❌ There is an ERROR While Sending an Email:", error.message);
    return false;
  }
};

module.exports = { sendApprovalEmail };