import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, Eye, EyeOff, UserPlus } from 'lucide-react';
import { register, clearError } from '../redux/slices/authSlice';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((s) => s.auth);
  
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '',
    phone: '',
    role: 'patient' 
  });
  const [showPass, setShowPass] = useState(false);
  const [passError, setPassError] = useState('');

  useEffect(() => { dispatch(clearError()); }, [dispatch]);

  // If user is registered and logged in, redirect them
  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setPassError('');
    
    if (form.password !== form.confirmPassword) {
      setPassError('Passwords do not match');
      return;
    }

    const { confirmPassword, ...registerData } = form;
    dispatch(register(registerData));
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
              <p className="text-emerald-100 text-xs">Patient Portal</p>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-white leading-tight mb-4">
              Join SmartClinic<br />Today
            </h2>
            <p className="text-emerald-100 text-sm leading-relaxed mb-8">
              Access your medical records, book appointments instantly, and manage your billing from your personalized patient dashboard.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Top Doctors', value: '50+' },
                { label: 'Specialties', value: '20+' },
                { label: 'Happy Patients', value: '10K+' },
                { label: 'Support', value: '24/7' },
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

        {/* Right Panel - Register Form */}
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

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Create an Account</h1>
            <p className="text-sm text-gray-500">Sign up to access the patient portal</p>
          </div>

          {(error || passError) && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600"
            >
              {error || passError}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="name"
              label="Full Name"
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="John Doe"
              required
            />
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                id="email"
                label="Email address"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="john@example.com"
                required
              />
              <Input
                id="phone"
                label="Phone Number"
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="061XXXXXXX"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                    minLength={6}
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

              <div className="flex flex-col gap-1">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  id="confirmPassword"
                  type={showPass ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  className="input-field"
                  minLength={6}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full justify-center py-2.5 text-base mt-4"
            >
              <UserPlus size={18} />
              Create Account
            </Button>
            
            <p className="text-center text-sm text-gray-500 mt-4">
              Already have an account? <a href="/login" className="text-emerald-600 font-semibold hover:underline">Log in here</a>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;
