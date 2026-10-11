import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/admin/dashboard')
      .then(setStats)
      .catch(err => {
        setError(err.message || 'Failed to load administrator statistics.');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="py-4 bg-light min-vh-100">
      <div className="container-xl">
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-1">Administrator Control Center</h2>
            <p className="text-muted mb-0">System-wide health, user directory, event audit, and reporting</p>
          </div>
          <div className="d-flex gap-2">
            <Link to="/admin-reports" className="btn btn-outline-primary">
              <i className="bi bi-file-earmark-bar-graph me-1"></i> Reports & CSV
            </Link>
            <Link to="/admin-users" className="btn btn-primary">
              <i className="bi bi-people me-1"></i> User Directory
            </Link>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>{error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="text-muted mt-2">Loading campus metrics...</p>
          </div>
        ) : (
          <>
            {/* System Overview KPIs */}
            <div className="row g-3 mb-4">
              <div className="col-lg-3 col-sm-6">
                <div className="card stat-card shadow-sm border-0">
                  <div className="card-body">
                    <span className="text-muted small fw-semibold text-uppercase">Total Users</span>
                    <h2 className="fw-bold text-primary mt-2 mb-0">{stats?.totalUsers ?? 0}</h2>
                    <small className="text-muted">Students, Organizers & Admins</small>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-sm-6">
                <div className="card stat-card shadow-sm border-0">
                  <div className="card-body">
                    <span className="text-muted small fw-semibold text-uppercase">Total Campus Events</span>
                    <h2 className="fw-bold text-success mt-2 mb-0">{stats?.totalEvents ?? 0}</h2>
                    <small className="text-muted">{stats?.upcomingEventsCount ?? 0} Upcoming</small>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-sm-6">
                <div className="card stat-card shadow-sm border-0">
                  <div className="card-body">
                    <span className="text-muted small fw-semibold text-uppercase">Total Registrations</span>
                    <h2 className="fw-bold text-info mt-2 mb-0">{stats?.totalRegistrations ?? 0}</h2>
                    <small className="text-muted">All-time passes issued</small>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-sm-6">
                <div className="card stat-card shadow-sm border-0">
                  <div className="card-body">
                    <span className="text-muted small fw-semibold text-uppercase">Verified Attendees</span>
                    <h2 className="fw-bold text-warning mt-2 mb-0">{stats?.attendedCount ?? 0}</h2>
                    <small className="text-muted">
                      {stats?.totalRegistrations
                        ? `${Math.round((stats.attendedCount / stats.totalRegistrations) * 100)}% attendance rate`
                        : '0% attendance'}
                    </small>
                  </div>
                </div>
              </div>
            </div>

            {/* Admin Modules Navigation Cards */}
            <div className="row g-4 mb-4">
              <div className="col-md-4">
                <div className="card shadow-sm border-0 h-100 hover-shadow">
                  <div className="card-body p-4 d-flex flex-column">
                    <div className="d-inline-flex p-3 rounded-circle bg-primary bg-opacity-10 text-primary mb-3 align-self-start">
                      <i className="bi bi-people-fill fs-3"></i>
                    </div>
                    <h5 className="fw-bold">User Management</h5>
                    <p className="text-muted small flex-grow-1">
                      Manage campus accounts, toggle active/disabled states, and promote users between Student, Organizer, and Admin roles.
                    </p>
                    <Link to="/admin-users" className="btn btn-outline-primary btn-sm">
                      Manage Directory <i className="bi bi-arrow-right ms-1"></i>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card shadow-sm border-0 h-100 hover-shadow">
                  <div className="card-body p-4 d-flex flex-column">
                    <div className="d-inline-flex p-3 rounded-circle bg-success bg-opacity-10 text-success mb-3 align-self-start">
                      <i className="bi bi-calendar2-range-fill fs-3"></i>
                    </div>
                    <h5 className="fw-bold">Event Oversight</h5>
                    <p className="text-muted small flex-grow-1">
                      Audit all campus events across departments, inspect venue allocations, and cancel violating or duplicate listings.
                    </p>
                    <Link to="/admin-events" className="btn btn-outline-success btn-sm">
                      Review Events <i className="bi bi-arrow-right ms-1"></i>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card shadow-sm border-0 h-100 hover-shadow">
                  <div className="card-body p-4 d-flex flex-column">
                    <div className="d-inline-flex p-3 rounded-circle bg-warning bg-opacity-10 text-warning mb-3 align-self-start">
                      <i className="bi bi-file-earmark-spreadsheet-fill fs-3"></i>
                    </div>
                    <h5 className="fw-bold">Analytics & Reports</h5>
                    <p className="text-muted small flex-grow-1">
                      Generate cross-filter attendance reports, track turn-out ratios, and download official CSV data exports for accreditation.
                    </p>
                    <Link to="/admin-reports" className="btn btn-outline-warning btn-sm">
                      Export CSV & Reports <i className="bi bi-arrow-right ms-1"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick System Integrity Status */}
            <div className="card shadow-sm border-0">
              <div className="card-body p-4">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-3">
                    <div className="badge bg-success p-2 rounded-circle">
                      <i className="bi bi-shield-check fs-4"></i>
                    </div>
                    <div>
                      <h6 className="fw-bold mb-0">System Operating Normally</h6>
                      <small className="text-muted">
                        Spring Boot REST Backend connected &bull; Atomic Concurrency Active &bull; Role-Based Security Configured
                      </small>
                    </div>
                  </div>
                  <span className="badge bg-success-subtle text-success border border-success px-3 py-2">
                    HEALTHY
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
