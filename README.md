# SmartClinic - Hospital Management System

A modern, full-stack Hospital Management System designed to streamline clinic operations, improve patient experiences, and manage medical records efficiently. Built with the MERN stack (MongoDB, Express.js, React, Node.js) and styled with TailwindCSS.

## 🚀 Features

### For Patients
- **Patient Portal:** A dedicated, full-width dashboard for patients.
- **Appointment Booking:** Easily schedule appointments with preferred doctors, dates, and times.
- **Medical Records:** Access medical history, recent activities, and clinical reports securely.
- **Billing & Invoices:** View unpaid invoices and billing history.

### For Doctors & Admins
- **Admin Dashboard:** Centralized view of all hospital activities, appointments, and staff.
- **Patient Management:** View, add, and manage patient profiles and records.
- **Appointment Management:** Approve, decline, or reschedule patient appointment requests.
- **Staff Management:** Manage doctors, nurses, and administrative staff profiles.

## 💻 Tech Stack

- **Frontend:** React (Vite), Tailwind CSS, Framer Motion, Redux Toolkit, Lucide React
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs

## ⚙️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Abdalle13/hospital-management-system.git
   cd hospital-management-system
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` folder and add:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```
   Run the backend:
   ```bash
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```
   Run the frontend:
   ```bash
   npm run dev
   ```

## 📜 License & Credits

This project is licensed under the MIT License.

**Built with ❤️ by Abdalle**
