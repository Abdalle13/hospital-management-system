import rateLimit from 'express-rate-limit';

// General ceiling for all API traffic.
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' },
});

// Tighter cap on login/register to slow down brute force and credential stuffing.
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many attempts. Please try again in 15 minutes.' },
});

// The public appointment-request endpoint takes no auth, so it's the easiest
// target for spam/abuse — keep it very tight.
export const publicRequestLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many appointment requests from this device. Please try again later or call the clinic directly.' },
});

// File uploads cost real storage/bandwidth on the ImageKit account — throttle
// harder than generic API reads.
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many uploads from this device. Please try again later.' },
});
