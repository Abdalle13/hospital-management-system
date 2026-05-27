import React from 'react';
import { getBadgeClass } from '../../utils/formatter';

const Badge = ({ status, className = '' }) => {
  return (
    <span className={`${getBadgeClass(status)} ${className}`}>
      {status}
    </span>
  );
};

export default Badge;
