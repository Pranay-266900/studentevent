import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { CategoryBadge, AttendanceBadge, formatDate, formatTime } from '../components/Badges';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      api.get('/student/dashboard'),
      api.get('/registrations/my')
    ])
      .then(([statsData, regsData]) => {
        setStats(statsData);
        setRegistrations(regsData);
      })
      .catch(err => {
        setError(err.message || 'Failed to load student dashboard.');
      })
      .finally(() => setLoading(false));
  }, []);

  const upcomingRegistrations = registrations.filter(
    r => r.registrationStatus === 'REGISTERED' && r.event?.status === 'UPCOMING'
  );

  return (
    <div className="py-4 bg-light min-vh-100">
      <div className="container-xl">
        {/* Welcome Header */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-1">Student Dashboard</h2>
            <p className="text-muted mb-0">Welcome back, {user?.fullName}! Track your event schedules and passes.</p>
          </div>
          <div className="d-flex gap-2">
            <Link to="/events" className="btn btn-primary">
              <i className="bi bi-compass me-1"></i> Browse Events
            </Link>
            <Link to="/my-registrations" className="btn btn-outline-secondary">
              <i className="bi bi-ticket-perforated me-1"></i> My Passes
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
            <p className="text-muted mt-2">Loading your activity...</p>
          </div>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="row g-3 mb-4">
              <div className="col-md-3 col-6">
                <div className="card stat-card shadow-sm border-0">
                  <div className="card-body">
                    <span className="text-muted small fw-semibold text-uppercase">Total Registrations</span>
                    <h2 className="fw-bold text-primary mt-2 mb-0">{stats?.totalRegistrations ?? 0}</h2>
                  </div>
                </div>
              </div>
              <div className="col-md-3 col-6">
                <div className="card stat-card shadow-sm border-0">
                  <div className="card-body">
                    <span className="text-muted small fw-semibold text-uppercase">Upcoming Events</span>
                    <h2 className="fw-bold text-success mt-2 mb-0">{stats?.upcomingEventsCount ?? 0}</h2>
                  </div>
                </div>
              </div>
              <div className="col-md-3 col-6">
                <div className="card stat-card shadow-sm border-0">
                  <div className="card-body">
                    <span className="text-muted small fw-semibold text-uppercase">Events Attended</span>
                    <h2 className="fw-bold text-info mt-2 mb-0">{stats?.attendedEventsCount ?? 0}</h2>
                  </div>
                </div>
              </div>
              <div className="col-md-3 col-6">
                <div className="card stat-card shadow-sm border-0">
                  <div className="card-body">
                    <span className="text-muted small fw-semibold text-uppercase">Attendance Rate</span>
                    <h2 className="fw-bold text-warning mt-2 mb-0">
                      {stats?.totalRegistrations
                        ? `${Math.round((stats.attendedEventsCount / stats.totalRegistrations) * 100)}%`
                        : '0%'}
                    </h2>
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Registered Events */}
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                <h5 className="fw-bold mb-0">My Upcoming Events</h5>
                <Link to="/my-registrations" className="small fw-semibold text-primary">
                  View All ({registrations.length})
                </Link>
              </div>
              <div className="card-body p-0">
                {upcomingRegistrations.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="bi bi-calendar-check fs-1 text-muted mb-2"></i>
                    <p className="text-muted mb-3">You have no upcoming registered events right now.</p>
                    <Link to="/events" className="btn btn-outline-primary btn-sm">
                      Discover Events to Join
                    </Link>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="table-light small">
                        <tr>
                          <th>Event Name</th>
                          <th>Category</th>
                          <th>Date & Time</th>
                          <th>Venue</th>
                          <th>Attendance</th>
                          <th className="text-end">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {upcomingRegistrations.map((reg) => (
                          <tr key={reg.id}>
                            <td>
                              <span className="fw-bold text-dark">{reg.event?.title}</span>
                            </td>
                            <td>
                              <CategoryBadge category={reg.event?.category} />
                            </td>
                            <td>
                              <span className="small">
                                {formatDate(reg.event?.eventDate)} &bull; {formatTime(reg.event?.startTime)}
                              </span>
                            </td>
                            <td>
                              <span className="small text-muted">{reg.event?.location}</span>
                            </td>
                            <td>
                              <AttendanceBadge status={reg.attendanceStatus} />
                            </td>
                            <td className="text-end">
                              <Link to="/my-registrations" className="btn btn-sm btn-outline-primary">
                                <i className="bi bi-ticket-perforated me-1"></i> View Pass
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Action Guide */}
            <div className="row g-3">
              <div className="col-md-6">
                <div className="card border-0 shadow-sm p-3">
                  <div className="d-flex align-items-center gap-3">
                    <div className="p-3 rounded-circle bg-primary bg-opacity-10 text-primary">
                      <i className="bi bi-qr-code fs-3"></i>
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1">Check-in at Event Venue</h6>
                      <p className="text-muted small mb-0">
                        Present your digital registration pass from "My Registrations" at the entrance desk for attendance scanning.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card border-0 shadow-sm p-3">
                  <div className="d-flex align-items-center gap-3">
                    <div className="p-3 rounded-circle bg-success bg-opacity-10 text-success">
                      <i className="bi bi-calendar2-plus fs-3"></i>
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1">Explore Open Sessions</h6>
                      <p className="text-muted small mb-0">
                        Workshops and hackathons fill up rapidly. Check the live catalog frequently to secure seats early.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
