import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = '', hover = false, onClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, ease: 'easeOut' }}
    onClick={onClick}
    className={`card ${hover ? 'card-hover cursor-pointer' : ''} ${className}`}
  >
    {children}
  </motion.div>
);

export default Card;
