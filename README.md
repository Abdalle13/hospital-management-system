# SmartClinic

A full-stack hospital / clinic management system built on the MERN stack. SmartClinic covers the whole lifecycle of running a clinic — public appointment booking, patient self-service, role-scoped staff dashboards, medical records, billing, and a pharmacy inventory — behind role-based access control.

Live backend API: https://hospital-management-system-teal-nine.vercel.app

## Roles

The system has four roles, each with its own scoped view — the UI only ever shows actions a role is actually allowed to perform, matching the backend's permission checks exactly.

- **Patient** — public landing page, doctor directory, self-registration, and a dedicated portal to book appointments, view medical records, and check invoices.
- **Doctor** — sees only their own appointments and patients, with a dashboard scoped to their own schedule.
- **Receptionist** — manages patients, appointment requests, and billing, with a front-desk-focused dashboard.
- **Admin** — full access: staff and doctor management, clinic-wide dashboard and revenue reporting, pharmacy inventory, and settings.

## Features

- **Public booking** — book directly with a specific doctor (constrained to their working days/hours, with conflict checking) or submit a general appointment request without an account.
- **Patient portal** — appointments, medical records, invoices, and profile management in one place.
- **Role-scoped dashboards** — admin, doctor, and receptionist each see different stats and quick actions suited to their job.
- **Medical records & prescriptions** — doctors record diagnoses, vitals, and prescriptions per visit.
- **Billing** — invoice generation, payment recording (cash/card/insurance), and PDF receipt export.
- **Pharmacy inventory** — stock levels, low-stock and expiry alerts, medicine images.
- **Doctor & medicine photos** — image uploads proxied server-side through ImageKit (no credentials exposed to the browser).
- **Email notifications** — appointment request received, confirmed, declined, and cancelled emails sent via SMTP.
- **Forgot / reset password** — token-based password reset via email, for any role.
- **Security** — JWT auth, per-route RBAC, ownership checks on patient-owned resources (IDOR protection), rate limiting on auth/booking/upload endpoints, Helmet, and MongoDB query sanitization.
- **Responsive** — usable on mobile, tablet, and desktop across every page.

## Tech Stack

**Frontend:** React (Vite), Redux Toolkit, Tailwind CSS, Framer Motion, Recharts, React Router, jsPDF

**Backend:** Node.js, Express, MongoDB / Mongoose, JWT, bcryptjs, Nodemailer, express-rate-limit, Helmet, express-mongo-sanitize

**File storage:** ImageKit (private-key server-side proxy)

## Project Structure

```
backend/    Express API — models, controllers, routes, middleware
frontend/   React app (Vite)
```

Each has its own `package.json`, `.env`, and `vercel.json` — they're deployed as two separate Vercel projects.

## Getting Started

### 1. Clone

```bash
git clone https://github.com/Abdalle13/hospital-management-system.git
cd hospital-management-system
```

### 2. Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=a_long_random_string

# Frontend origin — used for CORS in production and for links in emails
FRONTEND_URL=http://localhost:3000

# File uploads (doctor photos, medicine images) — private key only
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key

# Email notifications — leave unset to run without email (it no-ops safely)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM="SmartClinic" <your_email@gmail.com>
```

```bash
npm run dev
```

Optionally seed demo data:

```bash
npm run seed          # populate demo users, doctors, patients, appointments, etc.
npm run seed:destroy   # wipe it back out
```

Demo logins after seeding (all `password123`):

| Role | Email |
|---|---|
| Admin | admin@gmail.com |
| Receptionist | reception@gmail.com |
| Doctor | dr.yusuf@gmail.com |
| Patient | patient@gmail.com |

### 3. Frontend

```bash
cd ../frontend
npm install
npm run dev
```

The dev server proxies `/api` to `http://localhost:5000` (see `frontend/vite.config.js`), so no frontend env var is needed locally.

## Deployment (Vercel)

Backend and frontend deploy as two separate Vercel projects from the same repo.

**Backend** — root directory `backend`, add all the `.env` variables above as project environment variables (with `NODE_ENV=production` and `FRONTEND_URL` set to the real frontend URL once it exists). MongoDB Atlas Network Access must allow `0.0.0.0/0` since Vercel functions don't have fixed IPs.

**Frontend** — root directory `frontend`. It has no build-time API env var; instead `frontend/vercel.json` rewrites `/api/*` to the backend's deployed URL, so that file's `destination` must point at the real backend deployment before deploying.

## Security Notes

- Rotate `JWT_SECRET` and all seeded demo passwords before using this for anything beyond a demo.
- `.env` files are gitignored and never committed — set real secrets directly in each Vercel project's environment variables.

## License

MIT

---

Built by [Abdalle](https://github.com/Abdalle13)
