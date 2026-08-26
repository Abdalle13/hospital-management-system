import nodemailer from 'nodemailer';

let transporter;

const getTransporter = () => {
  if (transporter !== undefined) return transporter;

  const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS } = process.env;
  if (!EMAIL_HOST || !EMAIL_USER || !EMAIL_PASS) {
    transporter = null;
    return transporter;
  }

  transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: Number(EMAIL_PORT) || 587,
    secure: Number(EMAIL_PORT) === 465,
    auth: { user: EMAIL_USER, pass: EMAIL_PASS },
  });
  return transporter;
};

// Never throws — a notification failing to send should never break the
// request that triggered it (booking, confirming, etc).
const sendEmail = async ({ to, subject, html }) => {
  if (!to) return;

  const t = getTransporter();
  if (!t) {
    console.log(`[email] Not configured — skipped "${subject}" to ${to}`);
    return;
  }

  try {
    await t.sendMail({
      from: process.env.EMAIL_FROM || `"SmartClinic" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error('[email] Failed to send:', error.message);
  }
};

export default sendEmail;
