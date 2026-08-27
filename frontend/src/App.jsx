import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Layout from './components/layout/Layout';
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import PublicDoctorsPage from './pages/PublicDoctorsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import DashboardPage from './pages/DashboardPage';
import PatientsPage from './pages/PatientsPage';
import PatientDetailPage from './pages/PatientDetailPage';
import DoctorsPage from './pages/DoctorsPage';
import DoctorDetailPage from './pages/DoctorDetailPage';
import StaffPage from './pages/StaffPage';
import AppointmentsPage from './pages/AppointmentsPage';
import MedicalRecordsPage from './pages/MedicalRecordsPage';
import InvoicesPage from './pages/InvoicesPage';
import PharmacyPage from './pages/PharmacyPage';
import SettingsPage from './pages/SettingsPage';
import PatientPortal from './pages/PatientPortal';

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useSelector((s) => s.auth);
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) {
    return <Navigate to={user.role === 'patient' ? '/portal' : '/dashboard'} replace />;
  }
  return children;
};

const RoleRedirect = () => {
  const { user } = useSelector((s) => s.auth);
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'patient') return <Navigate to="/portal" replace />;
  return <Navigate to="/dashboard" replace />;
};

function App() {
  const { user } = useSelector((s) => s.auth);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route
        path="/register"
        element={user ? <Navigate to="/" replace /> : <RegisterPage />}
      />
      <Route path="/login" element={user ? <RoleRedirect /> : <LoginPage />} />
      <Route path="/forgot-password" element={user ? <RoleRedirect /> : <ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={user ? <RoleRedirect /> : <ResetPasswordPage />} />
      <Route path="/doctors-list" element={<PublicDoctorsPage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      <Route path="/terms-of-service" element={<TermsOfServicePage />} />
      <Route path="/portal" element={<ProtectedRoute roles={['patient']}><PatientPortal /></ProtectedRoute>} />
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<ProtectedRoute roles={['admin', 'doctor', 'receptionist']}><DashboardPage /></ProtectedRoute>} />
        <Route path="patients" element={<ProtectedRoute roles={['admin', 'doctor', 'receptionist']}><PatientsPage /></ProtectedRoute>} />
        <Route path="patients/:id" element={<ProtectedRoute roles={['admin', 'doctor', 'receptionist']}><PatientDetailPage /></ProtectedRoute>} />
        <Route path="doctors" element={<ProtectedRoute roles={['admin', 'receptionist']}><DoctorsPage /></ProtectedRoute>} />
        <Route path="doctors/:id" element={<ProtectedRoute roles={['admin', 'receptionist']}><DoctorDetailPage /></ProtectedRoute>} />
        <Route path="staff" element={<ProtectedRoute roles={['admin']}><StaffPage /></ProtectedRoute>} />
        <Route path="appointments" element={<ProtectedRoute roles={['admin', 'doctor', 'receptionist']}><AppointmentsPage /></ProtectedRoute>} />
        <Route path="records" element={<ProtectedRoute roles={['admin', 'doctor']}><MedicalRecordsPage /></ProtectedRoute>} />
        <Route path="pharmacy" element={<ProtectedRoute roles={['admin', 'doctor', 'receptionist']}><PharmacyPage /></ProtectedRoute>} />
        <Route path="invoices" element={<ProtectedRoute roles={['admin', 'receptionist']}><InvoicesPage /></ProtectedRoute>} />
        <Route path="settings" element={<ProtectedRoute roles={['admin']}><SettingsPage /></ProtectedRoute>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
