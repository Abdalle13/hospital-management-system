import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, iconColor = 'text-emerald-500', iconBg = 'bg-emerald-50', trend, trendValue, index = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: index * 0.08, ease: 'easeOut' }}
    className="card card-hover p-4 sm:p-6"
  >
    <div className="flex items-start justify-between gap-3">
      <div className="flex-1 min-w-0">
        <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1 leading-snug">{title}</p>
        <p className="text-2xl sm:text-3xl font-bold text-gray-900">{value}</p>
        {trendValue !== undefined && (
          <div className="flex items-center gap-1 mt-2 flex-wrap">
            {trend === 'up' ? (
              <TrendingUp size={14} className="text-emerald-500 flex-shrink-0" />
            ) : (
              <TrendingDown size={14} className="text-red-400 flex-shrink-0" />
            )}
            <span className={`text-xs font-medium ${trend === 'up' ? 'text-emerald-500' : 'text-red-400'}`}>
              {trendValue}
            </span>
            <span className="text-xs text-gray-400">vs last month</span>
          </div>
        )}
      </div>
      <div className={`${iconBg} p-2 sm:p-3 rounded-xl flex-shrink-0`}>
        <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${iconColor}`} />
      </div>
    </div>
  </motion.div>
);

export default StatCard;
