const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });

const wrapper = (title, bodyHtml) => `
  <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; color: #1f2937;">
    <div style="background: #059669; padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
      <h1 style="color: #fff; margin: 0; font-size: 20px;">SmartClinic</h1>
    </div>
    <div style="background: #ffffff; border: 1px solid #e5e7eb; border-top: none; padding: 24px; border-radius: 0 0 12px 12px;">
      <h2 style="font-size: 18px; margin-top: 0;">${title}</h2>
      ${bodyHtml}
    </div>
    <p style="text-align:center; color:#9ca3af; font-size:12px; margin-top:16px;">SmartClinic</p>
  </div>
`;

export const requestReceivedEmail = ({ name, department, date, time }) => ({
  subject: 'We received your appointment request — SmartClinic',
  html: wrapper('Request Received', `
    <p>Hi ${name},</p>
    <p>We've received your appointment request for <strong>${department}</strong> on <strong>${formatDate(date)}</strong> at <strong>${time}</strong>.</p>
    <p>Our reception team will call you shortly to confirm your exact slot.</p>
  `),
});

export const appointmentConfirmedEmail = ({ name, doctorName, specialization, date, time }) => ({
  subject: 'Your appointment is confirmed — SmartClinic',
  html: wrapper('Appointment Confirmed', `
    <p>Hi ${name},</p>
    <p>Your appointment has been confirmed:</p>
    <ul style="line-height: 1.8;">
      <li><strong>Doctor:</strong> Dr. ${doctorName}${specialization ? ` (${specialization})` : ''}</li>
      <li><strong>Date:</strong> ${formatDate(date)}</li>
      <li><strong>Time:</strong> ${time}</li>
    </ul>
    <p>Please arrive 10 minutes early. If you need to reschedule, contact us directly.</p>
  `),
});

export const appointmentDeclinedEmail = ({ name, date, time }) => ({
  subject: 'Update on your appointment request — SmartClinic',
  html: wrapper('Request Declined', `
    <p>Hi ${name},</p>
    <p>Unfortunately we're unable to confirm your requested appointment for ${formatDate(date)} at ${time}.</p>
    <p>Please contact us or submit a new request for a different time.</p>
  `),
});

export const passwordResetEmail = ({ name, resetUrl }) => ({
  subject: 'Reset your password — SmartClinic',
  html: wrapper('Reset Your Password', `
    <p>Hi ${name},</p>
    <p>We received a request to reset your SmartClinic password. Click the button below to choose a new one. This link expires in 30 minutes.</p>
    <p style="text-align:center; margin: 24px 0;">
      <a href="${resetUrl}" style="background:#059669; color:#fff; padding:12px 24px; border-radius:8px; text-decoration:none; font-weight:bold; display:inline-block;">Reset Password</a>
    </p>
    <p style="color:#6b7280; font-size:13px;">If you didn't request this, you can safely ignore this email — your password will stay the same.</p>
  `),
});

export const appointmentCancelledEmail = ({ name, doctorName, date, time }) => ({
  subject: 'Your appointment has been cancelled — SmartClinic',
  html: wrapper('Appointment Cancelled', `
    <p>Hi ${name},</p>
    <p>Your appointment with Dr. ${doctorName} on <strong>${formatDate(date)}</strong> at <strong>${time}</strong> has been cancelled.</p>
    <p>If this wasn't expected, please contact us to reschedule.</p>
  `),
});
