export const formatDate = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
};

export const formatDateTime = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency,
  }).format(amount || 0);
};

export const formatPhone = (phone) => phone || '—';

export const getInitials = (name = '') =>
  name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

export const getBadgeClass = (status) => {
  const map = {
    Scheduled: 'badge-scheduled',
    Pending: 'badge-scheduled',
    Confirmed: 'badge-completed',
    Completed: 'badge-completed',
    Cancelled: 'badge-cancelled',

    Paid: 'badge-paid',
    Unpaid: 'badge-unpaid',
    Partial: 'badge-partial',
  };
  return map[status] || 'badge-scheduled';
};
