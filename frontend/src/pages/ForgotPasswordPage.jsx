import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Activity, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { forgotPassword, clearError } from '../redux/slices/authSlice';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const ForgotPasswordPage = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((s) => s.auth);
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    const result = await dispatch(forgotPassword(email));
    if (forgotPassword.fulfilled.match(result)) setSent(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8 lg:p-10"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center">
            <Activity size={20} className="text-white" />
          </div>
          <p className="text-xl font-bold text-gray-900">SmartClinic</p>
        </div>

        {sent ? (
          <div className="text-center py-4">
            <div className="w-14 h-14 mx-auto bg-emerald-50 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 size={26} className="text-emerald-600" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Check your email</h1>
            <p className="text-sm text-gray-500 mb-6">
              If an account exists for <span className="font-medium text-gray-700">{email}</span>, we've sent a link to reset your password. The link expires in 30 minutes.
            </p>
            <a href="/login" className="inline-flex items-center gap-1.5 text-sm text-emerald-600 font-semibold hover:underline">
              <ArrowLeft size={14} /> Back to Sign In
            </a>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Forgot password?</h1>
              <p className="text-sm text-gray-500">Enter your account email and we'll send you a reset link.</p>
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                required
              />
              <Button type="submit" loading={loading} className="w-full justify-center py-2.5 text-base mt-2">
                <Mail size={18} />
                Send Reset Link
              </Button>
              <p className="text-center text-sm text-gray-500 mt-4">
                <a href="/login" className="text-emerald-600 font-semibold hover:underline inline-flex items-center gap-1">
                  <ArrowLeft size={14} /> Back to Sign In
                </a>
              </p>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
