import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { ShieldCheck, Activity, HeartPulse, Clock, Users, Stethoscope, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const stats = [
  { label: 'Patients', value: '2,400+' },
  { label: 'Doctors', value: '48' },
  { label: 'Years of Excellence', value: '15+' },
  { label: 'Uptime', value: '99.9%' },
];

const values = [
  { icon: ShieldCheck, title: 'Certified Experts', desc: 'Every specialist on our team is licensed, credentialed, and continuously trained on the latest clinical practices.' },
  { icon: Activity, title: 'Modern Technology', desc: 'From digital records to online booking, we invest in tools that make care faster and more accurate.' },
  { icon: HeartPulse, title: 'Compassionate Care', desc: 'We treat every patient like family — with patience, respect, and clear communication at every step.' },
  { icon: Clock, title: '24/7 Availability', desc: 'Emergency and urgent care services are staffed around the clock, every day of the year.' },
];

const AboutPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="bg-emerald-600 pt-36 pb-20 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-sm font-bold text-emerald-100 uppercase tracking-widest mb-3">About Us</h2>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-6">Dedicated to your health, since 2011</h1>
          <p className="text-emerald-100 text-lg max-w-2xl mx-auto leading-relaxed">
            SmartClinic is a modern healthcare institution built around one goal: making excellent
            medical care simple, accessible, and human.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex-1 w-full"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500 rounded-3xl transform -translate-x-4 translate-y-4 -z-10 opacity-20"></div>
              <img
                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Hospital Building"
                className="w-full rounded-3xl shadow-xl object-cover aspect-[4/3]"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex-1"
          >
            <h2 className="text-sm font-bold text-emerald-600 uppercase tracking-widest mb-2">Our Story</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6">Built on trust, grown by results</h3>
            <p className="text-gray-500 text-lg leading-relaxed mb-6">
              Founded in 2011, SmartClinic has grown from a single community clinic into a leading
              healthcare institution recognized for excellence in patient care, cutting-edge technology,
              and a compassionate approach.
            </p>
            <p className="text-gray-500 text-lg leading-relaxed mb-8">
              Our state-of-the-art facility brings together world-class specialists and advanced medical
              equipment under one roof, ensuring that every patient receives accurate diagnostics and
              effective treatment — supported by a digital portal that keeps your records, appointments,
              and bills in one place.
            </p>
            <Button onClick={() => navigate('/doctors-list')}>
              Meet Our Doctors <ArrowRight size={16} className="ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gray-50 border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-3xl sm:text-4xl font-extrabold text-emerald-600">{s.value}</p>
              <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-sm font-bold text-emerald-600 uppercase tracking-widest mb-2">What Drives Us</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Our core values</h3>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm"
              >
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
                  <v.icon size={22} />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">{v.title}</h4>
                <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-emerald-900 text-white text-center">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Users size={32} className="mx-auto mb-4 text-emerald-300" />
          <h3 className="text-2xl sm:text-3xl font-extrabold mb-3">
            {user ? 'Ready for your next visit?' : 'Ready to experience modern healthcare?'}
          </h3>
          <p className="text-emerald-100 mb-8">
            {user ? 'Book an appointment or check your records from your portal.' : 'Create your free patient account and book your first visit in minutes.'}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {user ? (
              <Button size="lg" onClick={() => navigate(user.role === 'patient' ? '/portal' : '/dashboard')} className="px-8">
                Go to {user.role === 'patient' ? 'Portal' : 'Dashboard'}
              </Button>
            ) : (
              <Button size="lg" onClick={() => navigate('/register')} className="px-8">Create Account</Button>
            )}
            <Button size="lg" variant="secondary" className="px-8 bg-transparent border-2 border-white/30 text-white hover:bg-white/10" onClick={() => navigate('/doctors-list')}>
              <Stethoscope size={18} className="mr-2" /> Browse Doctors
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;
