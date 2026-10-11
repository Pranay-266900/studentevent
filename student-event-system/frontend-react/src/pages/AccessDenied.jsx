import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const AccessDenied = () => {
  const { user } = useAuth();

  let destination = '/';
  if (user?.role === 'STUDENT') destination = '/student-dashboard';
  else if (user?.role === 'ORGANIZER') destination = '/organizer-dashboard';
  else if (user?.role === 'ADMIN') destination = '/admin-dashboard';

  return (
    <div className="py-5 bg-light min-vh-100 d-flex align-items-center">
      <div className="container-xl text-center">
        <div className="card shadow-sm border-0 p-5 mx-auto" style={{ maxWidth: '550px' }}>
          <div className="mb-3">
            <div className="d-inline-flex p-3 rounded-circle bg-danger bg-opacity-10 text-danger">
              <i className="bi bi-shield-slash-fill display-4"></i>
            </div>
          </div>
          <h2 className="fw-bold text-dark mb-2">403 - Access Forbidden</h2>
          <p className="text-muted mb-4">
            You do not have the required permissions to access this page. Your current account role is{' '}
            <span className="badge bg-secondary">{user?.role || 'GUEST'}</span>.
          </p>
          <div className="d-flex justify-content-center gap-2">
            <Link to={destination} className="btn btn-primary px-4">
              <i className="bi bi-house-door me-1"></i> Go to Dashboard
            </Link>
            <Link to="/events" className="btn btn-outline-secondary px-4">
              Browse Events
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
