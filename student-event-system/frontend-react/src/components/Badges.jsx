import React from 'react';

export const CategoryBadge = ({ category }) => {
  const cat = (category || '').toLowerCase();
  let cls = 'badge-cat-other';
  if (cat === 'technical') cls = 'badge-cat-technical';
  else if (cat === 'cultural') cls = 'badge-cat-cultural';
  else if (cat === 'sports') cls = 'badge-cat-sports';
  else if (cat === 'workshop') cls = 'badge-cat-workshop';
  else if (cat === 'seminar') cls = 'badge-cat-seminar';
  return <span className={`badge badge-category ${cls}`}>{category || 'General'}</span>;
};

export const StatusBadge = ({ status }) => {
  const s = (status || '').toUpperCase();
  let cls = 'badge-status-upcoming';
  if (s === 'ONGOING') cls = 'badge-status-ongoing';
  else if (s === 'COMPLETED') cls = 'badge-status-completed';
  else if (s === 'CANCELLED') cls = 'badge-status-cancelled';
  return <span className={`badge ${cls}`}>{s}</span>;
};

export const AttendanceBadge = ({ status }) => {
  const s = (status || '').toUpperCase();
  let cls = 'badge-attendance-pending';
  let icon = 'bi-hourglass-split';
  if (s === 'PRESENT') {
    cls = 'badge-attendance-present';
    icon = 'bi-check2-circle';
  } else if (s === 'ABSENT') {
    cls = 'badge-attendance-absent';
    icon = 'bi-x-circle';
  }
  return <span className={`badge ${cls}`}><i className={`bi ${icon} me-1`}></i>{s}</span>;
};

export const RegistrationStatusBadge = ({ status }) => {
  const s = (status || '').toUpperCase();
  if (s === 'REGISTERED') {
    return <span className="badge bg-success"><i className="bi bi-check-lg me-1"></i>Registered</span>;
  }
  return <span className="badge bg-secondary"><i className="bi bi-slash-circle me-1"></i>Cancelled</span>;
};

export const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const formatTime = (timeStr) => {
  if (!timeStr) return 'N/A';
  const parts = timeStr.split(':');
  let hours = parseInt(parts[0], 10);
  const minutes = parts[1] || '00';
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${hours}:${minutes} ${ampm}`;
};

export const formatDateTime = (dateTimeStr) => {
  if (!dateTimeStr) return 'N/A';
  const d = new Date(dateTimeStr);
  return d.toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};
