import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Activity, Eye, EyeOff, LogIn } from 'lucide-react';
import { login, clearError } from '../redux/slices/authSlice';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const LoginPage = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);

  useEffect(() => { dispatch(clearError()); }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(form));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-0 shadow-2xl rounded-2xl overflow-hidden bg-white">
        {/* Left Panel */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-emerald-600 to-emerald-500 p-10 flex flex-col justify-between hidden lg:flex"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Activity size={22} className="text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-xl">SmartClinic</p>
              <p className="text-emerald-100 text-xs">Hospital Management System</p>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-white leading-tight mb-4">
              Streamline your<br />clinical operations
            </h2>
            <p className="text-emerald-100 text-sm leading-relaxed mb-8">
              Manage patients, appointments, medical records, and billing all in one place.
              Built for modern healthcare teams.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Patients', value: '2,400+' },
                { label: 'Doctors', value: '48' },
                { label: 'Appointments', value: '12K+' },
                { label: 'Uptime', value: '99.9%' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/10 rounded-xl p-4">
                  <p className="text-white font-bold text-xl">{stat.value}</p>
                  <p className="text-emerald-100 text-xs">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-emerald-200 text-xs">© 2026 SmartClinic Hospital System. Built by Abdalle.</p>
        </motion.div>

        {/* Right Panel - Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="p-8 lg:p-10 flex flex-col justify-center"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center">
              <Activity size={20} className="text-white" />
            </div>
            <p className="text-xl font-bold text-gray-900">SmartClinic</p>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h1>
            <p className="text-sm text-gray-500">Sign in to your account to continue</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="email"
              label="Email address"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="name@company.com"
              required
            />

            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="input-field pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full justify-center py-2.5 text-base mt-2"
            >
              <LogIn size={18} />
              Sign In
            </Button>
            
            <p className="text-center text-sm text-gray-500 mt-4">
              Don't have an account? <a href="/register" className="text-emerald-600 font-semibold hover:underline">Register here</a>
            </p>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6">
            Secure access · HIPAA compliant · Role-based permissions
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
