import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, ArrowLeft, Search, Stethoscope, Clock, ShieldCheck } from 'lucide-react';
import Button from '../components/ui/Button';
import api from '../utils/api';

const PublicDoctorsPage = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/doctors')
      .then(res => {
        setDoctors(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredDoctors = doctors.filter(doc => 
    doc.name.toLowerCase().includes(search.toLowerCase()) ||
    doc.specialization.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <Activity size={18} className="text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">SmartClinic</span>
            </div>
          </div>
          <Button onClick={() => navigate('/login')}>Sign In</Button>
        </div>
      </header>

      {/* Hero / Search */}
      <section className="bg-emerald-600 py-16 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl font-extrabold mb-4">Our Medical Specialists</h1>
          <p className="text-emerald-100 text-lg mb-8 max-w-2xl mx-auto">
            Find the right expert for your healthcare needs. We have a team of certified professionals across all specialties.
          </p>
          
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text"
              placeholder="Search by name or specialty (e.g. Cardiology)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-none shadow-xl text-gray-900 focus:ring-4 focus:ring-emerald-500/20"
            />
          </div>
        </div>
      </section>

      {/* Doctors Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        {loading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="h-80 bg-white rounded-[2rem] animate-pulse shadow-sm border border-gray-100" />
            ))}
          </div>
        ) : filteredDoctors.length > 0 ? (
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredDoctors.map((doc, i) => (
              <motion.div 
                key={doc._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all group"
              >
                <div className="h-48 bg-gray-100 relative overflow-hidden">
                  <img 
                    src={`https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80`} 
                    alt={doc.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-emerald-600 uppercase">
                    {doc.specialization}
                  </div>
                </div>
                <div className="p-5">
                  <h4 className="text-lg font-bold text-gray-900 mb-1">Dr. {doc.name}</h4>
                  <p className="text-gray-500 text-sm mb-4 flex items-center gap-1.5">
                    <Stethoscope size={14} className="text-emerald-500" />
                    {doc.specialization}
                  </p>
                  
                  <div className="flex items-center justify-between py-3 border-t border-gray-50 mb-4">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                      <Clock size={14} />
                      {doc.experience || '10+'} Yrs Exp
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                      <ShieldCheck size={14} />
                      Verified
                    </div>
                  </div>

                  <Button 
                    className="w-full py-2.5 rounded-xl text-sm"
                    onClick={() => navigate('/register')}
                  >
                    Book Appointment
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[2rem] p-20 text-center border border-dashed border-gray-200">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search size={32} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No doctors found</h3>
            <p className="text-gray-500">We couldn't find any medical specialist matching your search.</p>
            <Button variant="secondary" className="mt-6" onClick={() => setSearch('')}>Clear Search</Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default PublicDoctorsPage;
