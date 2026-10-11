import React from 'react';
import { Link } from 'react-router-dom';

export const NotFound = () => {
  return (
    <div className="py-5 bg-light min-vh-100 d-flex align-items-center">
      <div className="container-xl text-center">
        <div className="card shadow-sm border-0 p-5 mx-auto" style={{ maxWidth: '550px' }}>
          <div className="mb-3">
            <div className="d-inline-flex p-3 rounded-circle bg-warning bg-opacity-10 text-warning">
              <i className="bi bi-question-circle-fill display-4"></i>
            </div>
          </div>
          <h2 className="fw-bold text-dark mb-2">404 - Page Not Found</h2>
          <p className="text-muted mb-4">
            The page or event resource you requested does not exist or has been moved.
          </p>
          <div className="d-flex justify-content-center gap-2">
            <Link to="/" className="btn btn-primary px-4">
              <i className="bi bi-house-door me-1"></i> Home
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
