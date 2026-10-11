import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { CategoryBadge, StatusBadge, formatDate, formatTime } from '../components/Badges';

export const OrganizerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState(null);

  const fetchDashboardData = () => {
    setLoading(true);
    Promise.all([
      api.get('/organizer/dashboard'),
      api.get('/organizer/events')
    ])
      .then(([statsData, eventsData]) => {
        setStats(statsData);
        setEvents(eventsData);
        setError('');
      })
      .catch(err => {
        setError(err.message || 'Failed to load organizer dashboard.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleCancelEvent = async (id, title) => {
    if (!window.confirm(`Are you sure you want to cancel the event "${title}"? This cannot be undone.`)) {
      return;
    }

    try {
      await api.delete(`/events/${id}`);
      setActionMessage({ type: 'info', text: `Event "${title}" has been cancelled.` });
      fetchDashboardData();
    } catch (err) {
      setActionMessage({ type: 'danger', text: err.message || 'Failed to cancel event.' });
    }
  };

  return (
    <div className="py-4 bg-light min-vh-100">
      <div className="container-xl">
        {/* Welcome Header */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-1">Organizer Dashboard</h2>
            <p className="text-muted mb-0">Welcome, {user?.fullName}! Manage your scheduled sessions and attendee rosters.</p>
          </div>
          <div className="d-flex gap-2">
            <Link to="/organizer-event-form" className="btn btn-primary">
              <i className="bi bi-plus-lg me-1"></i> Create New Event
            </Link>
            <Link to="/organizer-participants" className="btn btn-outline-success">
              <i className="bi bi-person-check me-1"></i> Mark Attendance
            </Link>
          </div>
        </div>

        {actionMessage && (
          <div className={`alert alert-${actionMessage.type} alert-dismissible fade show mb-4`} role="alert">
            <i className={`bi bi-${actionMessage.type === 'info' ? 'info-circle-fill' : 'check-circle-fill'} me-2`}></i>
            {actionMessage.text}
            <button type="button" className="btn-close" onClick={() => setActionMessage(null)}></button>
          </div>
        )}

        {error && (
          <div className="alert alert-danger" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>{error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="text-muted mt-2">Loading organizer data...</p>
          </div>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="row g-3 mb-4">
              <div className="col-md-3 col-6">
                <div className="card stat-card shadow-sm border-0">
                  <div className="card-body">
                    <span className="text-muted small fw-semibold text-uppercase">Events Created</span>
                    <h2 className="fw-bold text-primary mt-2 mb-0">{stats?.totalEventsCreated ?? events.length}</h2>
                  </div>
                </div>
              </div>
              <div className="col-md-3 col-6">
                <div className="card stat-card shadow-sm border-0">
                  <div className="card-body">
                    <span className="text-muted small fw-semibold text-uppercase">Total Registrations</span>
                    <h2 className="fw-bold text-success mt-2 mb-0">{stats?.totalRegistrationsReceived ?? 0}</h2>
                  </div>
                </div>
              </div>
              <div className="col-md-3 col-6">
                <div className="card stat-card shadow-sm border-0">
                  <div className="card-body">
                    <span className="text-muted small fw-semibold text-uppercase">Upcoming Events</span>
                    <h2 className="fw-bold text-info mt-2 mb-0">{stats?.upcomingEventsCount ?? 0}</h2>
                  </div>
                </div>
              </div>
              <div className="col-md-3 col-6">
                <div className="card stat-card shadow-sm border-0">
                  <div className="card-body">
                    <span className="text-muted small fw-semibold text-uppercase">Verified Attendees</span>
                    <h2 className="fw-bold text-warning mt-2 mb-0">{stats?.attendedCount ?? 0}</h2>
                  </div>
                </div>
              </div>
            </div>

            {/* My Managed Events Table */}
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                <h5 className="fw-bold mb-0">Managed Events</h5>
                <span className="badge bg-light text-dark border">{events.length} Events Total</span>
              </div>
              <div className="card-body p-0">
                {events.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="bi bi-calendar-x fs-1 text-muted mb-2"></i>
                    <p className="text-muted mb-3">You haven't published any events yet.</p>
                    <Link to="/organizer-event-form" className="btn btn-primary btn-sm">
                      Create Your First Event
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
                          <th>Capacity</th>
                          <th>Status</th>
                          <th className="text-end">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {events.map((event) => {
                          const capacityPercent = Math.min(100, Math.round((event.registeredCount / event.maxCapacity) * 100));
                          return (
                            <tr key={event.id}>
                              <td>
                                <strong className="text-dark">{event.title}</strong>
                              </td>
                              <td>
                                <CategoryBadge category={event.category} />
                              </td>
                              <td>
                                <span className="small">{formatDate(event.eventDate)}</span>
                                <div className="text-muted small">{formatTime(event.startTime)}</div>
                              </td>
                              <td>
                                <span className="small text-muted">{event.location}</span>
                              </td>
                              <td style={{ minWidth: '130px' }}>
                                <div className="d-flex justify-content-between small text-muted mb-1">
                                  <span>{event.registeredCount}/{event.maxCapacity}</span>
                                  <span>{capacityPercent}%</span>
                                </div>
                                <div className="progress progress-thin">
                                  <div
                                    className={`progress-bar ${capacityPercent >= 100 ? 'bg-danger' : 'bg-primary'}`}
                                    style={{ width: `${capacityPercent}%` }}
                                  ></div>
                                </div>
                              </td>
                              <td>
                                <StatusBadge status={event.status} />
                              </td>
                              <td className="text-end">
                                <div className="btn-group btn-group-sm">
                                  <Link
                                    to={`/organizer-participants?eventId=${event.id}`}
                                    className="btn btn-outline-success"
                                    title="View Roster & Mark Attendance"
                                  >
                                    <i className="bi bi-people-fill me-1"></i> Roster
                                  </Link>
                                  {event.status !== 'CANCELLED' && (
                                    <>
                                      <Link
                                        to={`/organizer-event-form?id=${event.id}`}
                                        className="btn btn-outline-secondary"
                                        title="Edit Event"
                                      >
                                        <i className="bi bi-pencil"></i>
                                      </Link>
                                      <button
                                        type="button"
                                        className="btn btn-outline-danger"
                                        onClick={() => handleCancelEvent(event.id, event.title)}
                                        title="Cancel Event"
                                      >
                                        <i className="bi bi-slash-circle"></i>
                                      </button>
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
